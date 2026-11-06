import hashlib
import json
import unittest
from unittest.mock import patch

from fastapi import HTTPException
from pypdf import PdfWriter
from sqlalchemy import create_engine

from app import main
from app.auth import hash_password


class RootwiseApiTests(unittest.TestCase):
    """Exercise FastAPI route functions against isolated SQLite storage.

    The Windows runner's installed Starlette/httpx TestClient hangs while
    entering ASGI lifespan, so these tests invoke the same endpoint functions
    directly and separately verify the app's registered HTTP routes.
    """

    def setUp(self):
        self.test_engine = create_engine('sqlite://', connect_args={'check_same_thread': False})
        main.Base.metadata.create_all(self.test_engine)
        self.engine_patch = patch.object(main, 'engine', self.test_engine)
        self.engine_patch.start()

    def tearDown(self):
        self.engine_patch.stop()
        self.test_engine.dispose()

    def test_http_routes_are_registered_and_health_is_available(self):
        paths = {route.path for route in main.app.routes}
        self.assertIn('/api/health', paths)
        self.assertIn('/api/ingest', paths)
        self.assertIn('/api/auth/login', paths)
        self.assertIn('/api/investigations/{rid}/approve', paths)
        self.assertIn('/api/evidence/{document_id}/content', paths)
        self.assertEqual(main.health()['status'], 'ok')

    def test_seed_has_full_demo_dossier_with_unconfirmed_causes(self):
        demo = main.seed_case()
        self.assertEqual([len(demo[key]) for key in ('telemetryData', 'labResults', 'fiveWhys', 'fishboneFactors', 'evidenceRecords', 'historicalMatches', 'capas')], [10, 5, 5, 8, 5, 2, 3])
        self.assertTrue(demo['demoMode'])
        self.assertTrue(all(item['status'] == 'HYPOTHESIS' and not item['isRootCause'] for item in demo['fiveWhys']))
        self.assertTrue(all(not item['verified'] for item in demo['fishboneFactors']))

    def test_analysis_never_confirms_a_root_cause(self):
        with patch.object(main, 'GROQ_KEY', ''):
            result = main.analyze({'eventDescription': 'fictional color change during crystallization'})
        self.assertEqual(result['source'], 'LOCAL_DEMO_RULES')
        self.assertEqual(len(result['suggestedFiveWhys']), 5)
        self.assertTrue(all(item['status'] == 'HYPOTHESIS' and item['isRootCause'] is False for item in result['suggestedFiveWhys']))
        self.assertTrue(all(item['verified'] is False for item in result['suggestedFishbone']))
        self.assertIn('fictional color change', result['extractedFields']['eventDescription'])

    def test_import_retains_original_text_and_is_not_polluted_by_demo_case(self):
        source = b'Deviation for batch LOT-TEST-3001: unexpected color noted.'
        draft = main.ingest_source('event.txt', source, media_type='text/plain')
        self.assertEqual(draft['batchNumber'], 'LOT-TEST-3001')
        self.assertFalse(draft['demoMode'])
        self.assertEqual(draft['telemetryData'], [])
        self.assertEqual(draft['labResults'], [])
        self.assertEqual(draft['fiveWhys'], [])
        with main.Session(main.engine) as db:
            stored = db.get(main.EvidenceDocument, draft['sourceDocumentId'])
            self.assertIsNotNone(stored)
            self.assertEqual(stored.content, source)
            self.assertEqual(stored.sha256, hashlib.sha256(stored.content).hexdigest())
        self.assertIn('Cause not established', draft['rootCauseSummary'])

    def test_saved_evidence_can_be_listed_and_downloaded(self):
        draft = main.ingest_source('event.txt', b'Batch LOT-SAVE-8801: illustrative event narrative.', media_type='text/plain')
        saved = main.create_record(draft)
        listed = main.list_evidence(saved['id'])
        self.assertEqual(len(listed), 1)
        self.assertEqual(listed[0]['sha256'], saved['sourceSha256'])
        response = main.download_evidence(saved['sourceDocumentId'])
        self.assertEqual(response.headers['x-file-sha256'], listed[0]['sha256'])

    def test_eml_source_is_parsed_and_retained(self):
        message = b'Subject: Quality event\r\nFrom: qa@example.test\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nBatch LOT-EML-9012: unexpected color noted.\r\n'
        draft = main.ingest_source('event.eml', message, media_type='message/rfc822')
        self.assertEqual(draft['batchNumber'], 'LOT-EML-9012')
        self.assertIn('Subject: Quality event', draft['eventDescription'])
        with main.Session(main.engine) as db:
            document = db.get(main.EvidenceDocument, draft['sourceDocumentId'])
            self.assertEqual(document.content, message)

    def test_scanned_pdf_without_ocr_returns_actionable_error(self):
        writer = PdfWriter(); writer.add_blank_page(width=612, height=792)
        from io import BytesIO
        buffer = BytesIO(); writer.write(buffer)
        with self.assertRaises(HTTPException) as error:
            main.ingest_source('scan.pdf', buffer.getvalue(), media_type='application/pdf')
        self.assertEqual(error.exception.status_code, 422)
        self.assertTrue('OCR' in error.exception.detail or 'readable text' in error.exception.detail)

    def test_authenticated_approval_is_password_checked_and_audited(self):
        password = 'correct-demo-review-password'
        account = {'email': 'qa@example.test', 'display_name': 'QA Reviewer', 'role': 'QA Technical Reviewer', 'password_hash': hash_password(password)}
        env = {'ROOTWISE_SESSION_SECRET': 'test-session-secret-' * 3, 'ROOTWISE_REVIEWERS_JSON': json.dumps([account])}
        with patch.dict('os.environ', env):
            with self.assertRaises(HTTPException) as error:
                main.reviewer_login(main.LoginRequest(email=account['email'], password='wrong-password'))
            self.assertEqual(error.exception.status_code, 401)
            session = main.reviewer_login(main.LoginRequest(email=account['email'], password=password))
            record = main.create_record({'title': 'Reviewable test record', 'investigatorLead': 'Investigator A', 'auditLogs': []})
            approved = main.approve(record['id'], main.ApprovalRequest(reason='Reviewed the saved evidence and draft analysis.'), f"Bearer {session['access_token']}")
        self.assertEqual(approved['status'], 'QA_REVIEW')
        self.assertTrue(approved['electronicSignatures'][-1]['isVerified'])
        self.assertTrue(approved['electronicSignatures'][-1]['sha256Checksum'])
        self.assertTrue(main.audit_integrity(record['id'])['valid'])
        self.assertGreaterEqual(main.audit_integrity(record['id'])['hashedEntries'], 2)


if __name__ == '__main__':
    unittest.main()
