# ROOTWISE AI · Pharmaceutical RCA Workspace

An assignment/demo application for Active Pharmaceutical Ingredient manufacturing investigations. The dashboard preserves the supplied ROOTWISE workflow and uses **React + Redux Toolkit, FastAPI, LangGraph + Groq, and PostgreSQL**. SQLite is provided only for a self-contained local demo when PostgreSQL is not configured. AI output is decision support, not a verified cause, batch disposition, or compliance claim.

## Requirements

- Python 3.11 or 3.12
- Node.js 20 or newer
- PostgreSQL for the required PostgreSQL path (optional for local demo)
- A Groq API key for live AI (optional; the deterministic demo works without a key)

## Windows PowerShell setup

Open two terminals in the project folder.

### Terminal 1 · API

```powershell
cd .\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item ..\.env.example .\.env
```

Edit `backend\.env` and add your own key after `GROQ_API_KEY=`. Do not paste the key into chat or source code. For PostgreSQL, create a database named `rootwise` and set `DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/rootwise`. Tables are created from the SQLAlchemy models at backend startup. Leave it blank to run the local SQLite demo.

For scanned-PDF OCR, install Tesseract OCR for Windows separately, then set `TESSERACT_CMD` to its `tesseract.exe` path in `backend\.env`. The Python OCR libraries are installed with `requirements.txt`. Text PDFs work without the Tesseract application; scanned files return a clear setup error if OCR is unavailable. Original uploaded files are retained in the configured database with a SHA-256 checksum and linked to the saved investigation. Unsubmitted drafts are cleaned up after seven days.

To enable authenticated QA approvals, generate a password hash in Terminal 1 with `python -m app.create_password_hash`. Put the printed hash in `ROOTWISE_REVIEWERS_JSON` as a JSON array entry, for example `[{"email":"qa@example.test","display_name":"QA Reviewer","role":"QA Technical Reviewer","password_hash":"pbkdf2_sha256$310000$...$..."}]`. Set `ROOTWISE_SESSION_SECRET` to a random value of at least 32 characters. Supported approval roles are `QA Technical Reviewer` and `Qualified Person (QP)`. Approval requires password re-entry, records the review reason and a checksum of the reviewed dossier, and appends a tamper-evident audit-chain entry.

```powershell
python -m uvicorn app.main:app --reload --port 8000
```

Check `http://127.0.0.1:8000/api/health` and `http://127.0.0.1:8000/docs`.

### Terminal 2 · Web app

```powershell
cd <project-folder>
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. Vite proxies `/api` to FastAPI on port 8000; keep both terminals running. If port 5173 is occupied, stop its old Vite process instead of launching another copy on a different port.

If another app is already using port 8000, start FastAPI with `--port 8001` and launch the web app from PowerShell with `$env:ROOTWISE_API_TARGET='http://127.0.0.1:8001'; npm run dev -- --port 5178 --strictPort`. Open `http://127.0.0.1:5178`. This keeps the proxy pointed at this project's API instead of another running app.

## Workflow

1. Open the seeded fictional API crystallization incident, or create a new event.
2. Review/edit the event dossier and source evidence before analysis.
3. Generate draft 5 Whys, 6M prompts, preliminary risk prompts, and CAPA suggestions. The Groq/LangGraph path requires the backend key. Without it, a local deterministic demo provides clearly labelled unconfirmed prompts.
4. Review each statement against source records, add evidence, and update the investigation manually.
5. Save records to PostgreSQL or the local SQLite fallback. Use the demo acknowledgement for a walkthrough, or configure a QA reviewer/QP account and use password re-authentication to record an authenticated prototype approval. The latter is still not a legally binding or validated electronic signature.

The seeded AI Studio-inspired dossier includes a 10-point SCADA-style telemetry series, five illustrative QC tests, five evidence-linked 5-Whys prompts, factors across all six fishbone categories, a synthetic evidence register, two historical precedent examples, risk-screening values, and three draft CAPA recommendations with owners, due dates, and verification approaches. The UI labels this dossier as fictional demo data. Its sample evidence references are not real source records; every cause remains a hypothesis, and every CAPA remains a draft. New imports retain their original PDF, TXT, EML, or pasted-text source and display its checksum and download link in the evidence register.

## Assignment boundary and limitations

This is an educational prototype, not validated GxP software. It includes password re-authentication for configured QA reviewer / QP approvals, a reviewed-record checksum, and an application-level tamper-evident audit chain; these controls have not undergone regulatory validation and do not constitute a Part 11 compliant signature or immutable archive. Identity administration, MFA, validated access control, retention-policy enforcement, disaster recovery, validated risk scoring, and production document controls remain out of scope. OCR is optional and requires a separately installed Tesseract executable. Email ingestion accepts pasted email or `.eml` files; it does not connect to mailboxes. The PostgreSQL path requires a user-provided database and has not been certified against every PostgreSQL deployment; SQLite remains the local demo fallback. Review all AI output and extracted values manually. Live Groq analysis requires a valid key in `backend\.env` and network access; without it, deterministic local analysis remains available.

## Demo script (5–8 minutes)

1. **0:00–0:45** Introduce ROOTWISE and the fictitious Northstar Pharma crystallization deviation. Point out that it is a demo record and no product disposition is made.
2. **0:45–1:45** Open the event dossier. Review event narrative, batch/equipment context, observed lab/telemetry examples, containment, and evidence gaps. Identify which values are demo data.
3. **1:45–2:30** Edit a field and save. Show the record persists after refresh.
4. **2:30–3:45** Open 5 Whys and fishbone. Generate analysis; show Groq model mode if configured, or clearly labelled local demo mode. Highlight hypothesis labels and evidence references/gaps.
5. **3:45–5:15** Review risk and CAPA proposals; edit owner/status/verification, then inspect the review-history view.
6. **5:15–6:00** Open Review & Audit Trail. Show the demo acknowledgement versus configured reviewer approval, then verify the application audit chain. Generate/export the investigation report draft and state that QA/source verification is required and the prototype is not a compliance-certified system.

## Code walkthrough (5–10 minutes)

1. **0:00–1:00** `src/App.tsx` and `src/store.ts`: workspace navigation, selected record, and Redux state.
2. **1:00–2:00** `src/services/apiClient.ts` and `vite.config.ts`: frontend calls, local demo fallback, and same-origin API proxy.
3. **2:00–4:00** `backend/app/main.py`: FastAPI endpoints, SQLAlchemy persistence, source ingestion, and local analysis fallback.
4. **4:00–6:00** `groq_graph`: LangGraph node calls Groq; result normalization forces generated cause links to remain hypotheses and fishbone factors unverified.
5. **6:00–7:30** Show editable investigation tabs, CAPA owners/due dates/status/effectiveness verification, authenticated reviewer password re-entry, reviewed-dossier checksum, and the audit-chain check.
6. **7:30–8:30** Explain configuration and limits: PostgreSQL URL, Groq key, SQLite demo fallback, text-based PDF extraction, and the absence of validated regulatory controls.
