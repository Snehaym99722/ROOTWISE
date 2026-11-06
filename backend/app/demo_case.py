"""Illustrative, fully synthetic RCA dossier inspired by the AI Studio reference.

Nothing in this fixture represents a real batch, patient, facility, instrument,
source record, investigation, historical match, or approved quality decision.
All causal conclusions stay unconfirmed even when a demo source is described.
"""

from copy import deepcopy
from datetime import datetime, timezone


DEMO_CASE = {
    "id": "DEV-2026-0842",
    "title": "DEMO · OOS Impurity D and crystallizer thermal excursion",
    "apiProduct": "Atorvastatin Calcium Trihydrate",
    "batchNumber": "ATV-2026-0482B",
    "manufacturingStage": "Stage 4: Controlled Anti-Solvent Crystallization",
    "equipmentId": "CRY-104 (Hastelloy C-22 Crystallizer, 3000 L)",
    "facility": "Commercial API Suite 2, Building B (fictional GMP site)",
    "incidentDate": "2026-11-04T14:22:00Z",
    "detectionDate": "2026-11-04T18:45:00Z",
    "targetClosureDate": "2026-11-25T17:00:00Z",
    "severity": "CRITICAL",
    "status": "UNDER_INVESTIGATION",
    "investigatorLead": "Dr. Elena Rostova (demo investigator)",
    "qaApprover": "Marcus Vance (demo QA reviewer)",
    "eventDescription": (
        "FICTIONAL DEMONSTRATION CASE. During final release testing of fictional "
        "Atorvastatin Calcium Trihydrate lot ATV-2026-0482B, the illustrative QC "
        "record reports Related Substance Impurity D at 0.38% w/w against an "
        "illustrative limit of NMT 0.15% w/w by HPLC. The fictional process "
        "historian shows a jacket-temperature rise to 41.5°C at 14:22 while the "
        "cooling recipe setpoint was 24.0°C; the slurry reached 36.2°C and the "
        "illustrative excursion window lasted 38 minutes. These values and all "
        "associated records are fabricated for product demonstration and must "
        "not be used for manufacturing, disposition, or quality decisions."
    ),
    "immediateContainment": (
        "1. DEMO ONLY: Lot ATV-2026-0482B (illustrative net weight 412.5 kg) is "
        "shown in physical and electronic QA-HOLD quarantine.\n"
        "2. DEMO ONLY: Crystallizer CRY-104 is shown locked out from subsequent "
        "batch charging pending review.\n"
        "3. DEMO ONLY: Illustrative preceding and succeeding batches ATV-2026-0481B "
        "and ATV-2026-0483B are flagged for impurity-profile review."
    ),
    "batchDisposition": "QUARANTINED",
    "telemetryData": [
        {"time": "12:00", "jacketTemp": 58.2, "slurryTemp": 58.0, "targetTemp": 58.0, "agitatorRpm": 120, "pressure": 0.12, "pH": 7.2},
        {"time": "12:30", "jacketTemp": 52.1, "slurryTemp": 53.4, "targetTemp": 53.0, "agitatorRpm": 120, "pressure": 0.12, "pH": 7.2},
        {"time": "13:00", "jacketTemp": 44.8, "slurryTemp": 47.1, "targetTemp": 46.0, "agitatorRpm": 110, "pressure": 0.11, "pH": 7.1},
        {"time": "13:30", "jacketTemp": 35.0, "slurryTemp": 39.5, "targetTemp": 38.0, "agitatorRpm": 95, "pressure": 0.10, "pH": 7.1},
        {"time": "14:00", "jacketTemp": 31.4, "slurryTemp": 32.8, "targetTemp": 30.0, "agitatorRpm": 90, "pressure": 0.10, "pH": 7.0},
        {"time": "14:22", "jacketTemp": 41.5, "slurryTemp": 36.2, "targetTemp": 24.0, "agitatorRpm": 90, "pressure": 0.28, "pH": 6.8, "isExcursion": True},
        {"time": "14:45", "jacketTemp": 38.2, "slurryTemp": 35.8, "targetTemp": 20.0, "agitatorRpm": 90, "pressure": 0.25, "pH": 6.8, "isExcursion": True},
        {"time": "15:00", "jacketTemp": 29.0, "slurryTemp": 31.4, "targetTemp": 18.0, "agitatorRpm": 85, "pressure": 0.14, "pH": 6.9, "isExcursion": True},
        {"time": "15:30", "jacketTemp": 16.5, "slurryTemp": 21.0, "targetTemp": 15.0, "agitatorRpm": 80, "pressure": 0.11, "pH": 7.0},
        {"time": "16:00", "jacketTemp": 11.8, "slurryTemp": 12.9, "targetTemp": 12.0, "agitatorRpm": 75, "pressure": 0.10, "pH": 7.0},
    ],
    "labResults": [
        {"id": "DEMO-LAB-01", "testName": "Related Substances (HPLC)", "parameter": "Impurity D (di-tert-butyl analog)", "result": "0.38%", "specification": "NMT 0.15%", "unit": "% w/w", "status": "OOS", "instrumentId": "HPLC-AG-09 (demo)", "analyst": "T. Krishnan (demo)"},
        {"id": "DEMO-LAB-02", "testName": "Active Assay by Potentiometry", "parameter": "Atorvastatin Calcium purity", "result": "98.9%", "specification": "98.0%–102.0%", "unit": "%", "status": "PASS", "instrumentId": "POT-TIT-03 (demo)", "analyst": "A. Chen (demo)"},
        {"id": "DEMO-LAB-03", "testName": "Karl Fischer Volumetric Titration", "parameter": "Water content (trihydrate)", "result": "4.6%", "specification": "3.5%–5.5%", "unit": "% w/w", "status": "PASS", "instrumentId": "KF-MET-01 (demo)", "analyst": "A. Chen (demo)"},
        {"id": "DEMO-LAB-04", "testName": "Particle Size Distribution (Laser Diffraction)", "parameter": "D90", "result": "48.2", "specification": "NMT 55.0", "unit": "µm", "status": "PASS", "instrumentId": "MALVERN-02 (demo)", "analyst": "R. Simmons (demo)"},
        {"id": "DEMO-LAB-05", "testName": "Residual Solvents by GC Headspace", "parameter": "Methanol / ethyl acetate", "result": "210 / 420", "specification": "NMT 3000 / 5000", "unit": "ppm", "status": "PASS", "instrumentId": "GC-FID-04 (demo)", "analyst": "T. Krishnan (demo)"},
    ],
    "evidenceRecords": [
        {"id": "DEMO-SRC-01", "name": "QC HPLC chromatogram and reference-standard comparison", "type": "Laboratory record (synthetic)", "status": "DEMO AVAILABLE", "finding": "Illustrative peak at 14.8 min; fictional result is not an actual validated test."},
        {"id": "DEMO-SRC-02", "name": "SCADA historian export: TIC-104-PV and recipe setpoint", "type": "Process record (synthetic)", "status": "DEMO AVAILABLE", "finding": "Illustrative 38-minute excursion window from 14:22 to 15:00."},
        {"id": "DEMO-SRC-03", "name": "DCS command / valve-position trend: TCV-104A and ZS-104", "type": "Equipment record (synthetic)", "status": "DEMO AVAILABLE", "finding": "Illustrative 0% close command with 58.4% position feedback."},
        {"id": "DEMO-SRC-04", "name": "Maintenance teardown report MTR-2026-88", "type": "Maintenance record (synthetic)", "status": "DEMO AVAILABLE", "finding": "Illustrative 2 mm diaphragm tear and desiccant fines in regulator port."},
        {"id": "DEMO-SRC-05", "name": "CMMS WO-89110 and air-header filter F-201 inspection", "type": "Maintenance record (synthetic)", "status": "DEMO AVAILABLE", "finding": "Illustrative deferred PM and filter indicator in red zone."},
    ],
    "fiveWhys": [
        {"id": "DEMO-W1", "level": 1, "question": "Why did the illustrative batch fail final release for Impurity D (0.38% vs NMT 0.15%)?", "answer": "Thermal stress during crystallization is a candidate mechanism for the impurity result; the chemistry and causal relationship require qualified review.", "evidence": "DEMO-SRC-01: illustrative HPLC peak and retention-time comparison. Synthetic record only; verify an actual chromatogram and orthogonal identification.", "status": "HYPOTHESIS", "isRootCause": False, "contributingCategory": "Material"},
        {"id": "DEMO-W2", "level": 2, "question": "Why might thermal stress have occurred during controlled crystallization?", "answer": "The illustrative slurry temperature rose 4.2°C above the recipe trajectory; cause of the deviation is not established.", "evidence": "DEMO-SRC-02: synthetic historian points show the excursion window; source export and time synchronization require verification.", "status": "HYPOTHESIS", "isRootCause": False, "contributingCategory": "Method"},
        {"id": "DEMO-W3", "level": 3, "question": "What could explain the jacket-temperature rise during active chilling?", "answer": "A temperature-control valve failing to reach its commanded position is one candidate mechanism.", "evidence": "DEMO-SRC-03: synthetic trend shows command / position mismatch; inspect actual alarm, command, feedback, and actuator records.", "status": "HYPOTHESIS", "isRootCause": False, "contributingCategory": "Machine"},
        {"id": "DEMO-W4", "level": 4, "question": "If the valve-position mismatch is real, what might explain it?", "answer": "Actuator wear or instrument-air contamination could contribute; neither mechanism is confirmed.", "evidence": "DEMO-SRC-04: fictional teardown report description; obtain actual inspection report and component disposition.", "status": "HYPOTHESIS", "isRootCause": False, "contributingCategory": "Machine"},
        {"id": "DEMO-W5", "level": 5, "question": "Why might deterioration or contamination not have been detected before the run?", "answer": "Maintenance planning and instrument-air filtration are investigation avenues; no root cause is established.", "evidence": "DEMO-SRC-05: fictional CMMS / filter references; verify work-order history, approved deferral assessment, and inspection records.", "status": "HYPOTHESIS", "isRootCause": False, "contributingCategory": "Method"},
    ],
    "fishboneFactors": [
        {"id": "DEMO-F-MCH-01", "category": "Machine", "factor": "TCV-104A actuator or valve stem may not have tracked its command", "likelihood": "HIGH", "verified": False, "notes": "Candidate only. Test against DEMO-SRC-03 and an actual inspection record."},
        {"id": "DEMO-F-MCH-02", "category": "Machine", "factor": "Secondary Syltherm circulation pump performance may have changed", "likelihood": "LOW", "verified": False, "notes": "Candidate only. Review pump trend, vibration, and maintenance history."},
        {"id": "DEMO-F-MTH-01", "category": "Method", "factor": "PM deferral workflow may not require documented risk review", "likelihood": "MEDIUM", "verified": False, "notes": "Candidate only. Compare controlled procedure versions and actual deferral approvals."},
        {"id": "DEMO-F-MTH-02", "category": "Method", "factor": "Cooling-ramp duration or alarm response may not be adequate", "likelihood": "MEDIUM", "verified": False, "notes": "Candidate only. Compare executed batch record, validated recipe, and alarm response."},
        {"id": "DEMO-F-MAT-01", "category": "Material", "factor": "Starting-material impurity profile may contribute to the observed result", "likelihood": "LOW", "verified": False, "notes": "Candidate only. Review incoming-material lot, retest, and stability results."},
        {"id": "DEMO-F-MAN-01", "category": "Man", "factor": "Shift handover or alarm acknowledgement may affect response time", "likelihood": "LOW", "verified": False, "notes": "Candidate only. Review operator interview, training, and event chronology without presuming error."},
        {"id": "DEMO-F-MEA-01", "category": "Measurement", "factor": "Temperature transmitter or valve-position feedback may have calibration / data issues", "likelihood": "MEDIUM", "verified": False, "notes": "Candidate only. Check as-found calibration, raw historian data, audit trail, and time source."},
        {"id": "DEMO-F-MIL-01", "category": "Milieu", "factor": "Shared utility supply conditions may have influenced heat transfer", "likelihood": "LOW", "verified": False, "notes": "Candidate only. Review utility trends, seasonal changes, and other equipment events."},
    ],
    "riskAssessment": {"severity": 8, "occurrence": 3, "detection": 5, "rpn": 120, "riskCategory": "HIGH", "rationale": "Illustrative screening score only (8 × 3 × 5 = 120); not a site-approved ICH Q9 assessment. QA must reassess using actual product, patient, process, and control evidence."},
    "capas": [
        {"id": "DEMO-CAPA-01", "type": "CORRECTIVE", "title": "Maintain hold and complete documented quality-impact assessment", "description": "Illustrative recommendation only. Maintain the hold in the demo workflow; assess affected material and related batches using approved site procedures before disposition.", "owner": "Quality Assurance (demo assignment)", "department": "Quality", "dueDate": "2026-11-14", "status": "OPEN", "verificationMethod": "QA review of actual batch records, analytical results, rationale, and documented disposition; effectiveness is not assumed."},
        {"id": "DEMO-CAPA-02", "type": "CORRECTIVE", "title": "Inspect and function-test the temperature-control loop", "description": "Illustrative recommendation only. Review valve, actuator, instrument-air conditioning, transmitter, interlocks, calibration, and relevant alarm history before return to service.", "owner": "Engineering & Maintenance (demo assignment)", "department": "Engineering & Maintenance", "dueDate": "2026-11-20", "status": "OPEN", "verificationMethod": "Approved protocol, traceable as-found / as-left records, and documented QA review; acceptance criteria to be set by the site."},
        {"id": "DEMO-CAPA-03", "type": "PREVENTIVE", "title": "Review critical-equipment PM deferral and excursion controls", "description": "Illustrative recommendation only. Evaluate whether risk review, escalation, and recipe hold controls need revision after the investigation establishes supported causes.", "owner": "Process Automation (demo assignment)", "department": "Quality / Automation", "dueDate": "2026-11-30", "status": "OPEN", "verificationMethod": "Approved change control and validation evidence, followed by a predefined effectiveness review on representative future runs."},
    ],
    "historicalMatches": [
        {"id": "DEMO-HIST-01", "batchNumber": "ATV-2025-0912A", "deviationId": "DEV-2025-0411", "date": "2025-08-14", "product": "Atorvastatin Calcium Trihydrate", "failureMode": "Illustrative crystallization thermal excursion (+3.5°C over setpoint)", "rootCause": "Illustrative archived hypothesis: chiller secondary glycol-loop airlock during seasonal switchover", "similarityScore": 89, "capaEffective": True, "learnings": "Synthetic precedent for demonstration. Prior de-aeration action is shown as effective in that fictional record; it does not establish the current event's cause."},
        {"id": "DEMO-HIST-02", "batchNumber": "ROS-2025-0210C", "deviationId": "DEV-2025-0105", "date": "2025-02-09", "product": "Rosuvastatin Intermediate R-2", "failureMode": "Illustrative impurity spike after a reactor temperature excursion", "rootCause": "Illustrative archived hypothesis: instrument-air moisture affected a control valve", "similarityScore": 84, "capaEffective": False, "learnings": "Synthetic precedent for demonstration. A local dryer action is shown as ineffective in that fictional record; compare scope only after actual records are available."},
    ],
    "electronicSignatures": [],
    "auditLogs": [],
    "rootCauseSummary": "Cause not established. Thermal excursion, control-loop response, maintenance practices, measurement integrity, and the impurity result are investigation hypotheses pending actual source records and qualified human review.",
    "aiSuggestedSummary": "DEMO DRAFT ONLY: the illustrative record depicts an OOS impurity result alongside a crystallization temperature excursion. It does not establish that one caused the other.",
    "isAiAssisted": False,
    "createdAt": "2026-11-04T18:50:00Z",
    "updatedAt": "2026-11-05T16:30:12Z",
    "source": "Fictional AI Studio-inspired demo dossier · all records and metrics synthetic",
    "extractionMode": "Synthetic seeded demonstration",
    "evidenceGaps": [
        "Replace DEMO-SRC-01 with the controlled HPLC raw data, review, and reference-standard identification records.",
        "Verify DEMO-SRC-02 against the original SCADA export, tag metadata, time synchronization, and approved recipe.",
        "Obtain actual DCS command / feedback and alarm history for TCV-104A and ZS-104.",
        "Obtain actual maintenance inspection, PM deferral approval, instrument-air filter, and calibration records.",
        "Complete QA product-impact assessment, related-batch scope, and disposition using approved site procedures.",
        "Confirm owners, due dates, change controls, and measurable CAPA effectiveness criteria with the responsible site functions.",
    ],
    "demoMode": True,
    "demoNotice": "FICTIONAL DEMO DATA: values, people, records, matches, and actions are invented to illustrate the workflow. Not manufacturing evidence, not a GMP record, and not suitable for batch or patient decisions.",
}


def build_demo_case() -> dict:
    """Return a fresh copy with current timestamps for newly initialized stores."""
    case = deepcopy(DEMO_CASE)
    stamp = datetime.now(timezone.utc).isoformat()
    case["createdAt"] = stamp
    case["updatedAt"] = stamp
    case["auditLogs"] = [
        {"id": "DEMO-LOG-01", "timestamp": "2026-11-04T18:50:00Z", "operator": "QC Analyst (demo)", "action": "Illustrative OOS alert logged", "category": "STATUS_CHANGE", "details": "Synthetic example only: illustrative Impurity D result entered for the demo dossier.", "hash": ""},
        {"id": "DEMO-LOG-02", "timestamp": "2026-11-04T19:15:22Z", "operator": "QA Investigator (demo)", "action": "Demo investigation opened and hold recorded", "category": "RECORD_EDIT", "details": "Fictional workflow event; no real batch, hold, or QA decision exists.", "hash": ""},
        {"id": "DEMO-LOG-03", "timestamp": "2026-11-05T10:20:00Z", "operator": "Maintenance Lead (demo)", "action": "Synthetic equipment evidence reference added", "category": "RECORD_EDIT", "details": "DEMO-SRC-04 is an invented reference; no original teardown report is attached.", "hash": ""},
        {"id": "DEMO-LOG-04", "timestamp": stamp, "operator": "ROOTWISE demo workspace", "action": "Fictional demonstration dossier initialized", "category": "RECORD_EDIT", "details": "Synthetic reference content loaded; source records are not real and every causal status remains unconfirmed.", "hash": ""},
    ]
    return case
