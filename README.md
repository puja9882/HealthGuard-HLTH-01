# HealthRecord

A role-based health record web application with three portals — **Patient**, **Clinician**, and **Admin** — sharing one consistent design system.

## Portals

| Portal | Purpose | Accent |
| --- | --- | --- |
| **Patient** | View medical history & prescriptions, generate temporary QR codes for clinician access, review access history | Emerald |
| **Clinician** | Scan a patient's temporary QR to gain time-boxed authorized access, manage consultations & prescriptions, audit access logs | Cyan |
| **Admin** | Anonymized aggregate public-health analytics (disease & regional trends) with privacy guarantees (k-anonymity) | Violet |

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS 4**
- **React Router 7**
- **lucide-react** icons, **qrcode.react** / **html5-qrcode** for the QR flow

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Other scripts:

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # oxlint
```

## Demo Flow

1. Open the landing page and pick a portal (mock credentials — any email + 6+ character password).
2. **Patient**: generate a QR code from *Generate QR* (valid for 5 minutes).
3. **Clinician**: use *Scan Patient QR* — scan the QR or use the demo simulator buttons to test valid / expired / revoked / unauthorized states.
4. While the clinician session is active (5-minute countdown), they can view history, add consultations, and issue prescriptions. Every action is audit-logged.
5. **Admin**: sees only anonymized aggregate statistics — no individual patient data leaves the patient/clinician modules.

> Data is currently served from in-module mocks (`src/services/api.js`) shaped to match a future FastAPI backend, so swapping in real REST endpoints is isolated to one file.

## Project Structure

```
src/
├── components/     # Shared UI (Card, Button, Sidebar, Navbar, badges, scanner)
├── context/        # Auth, notifications, toast, patient-access session
├── data/           # Mock records
├── layouts/        # Per-role layouts (Patient, Clinician, Admin)
├── pages/          # patient/ · clinician/ · administrative/ · auth/
├── routes/         # Route table with role-protected routes
├── services/       # API layer (mock today, REST-ready)
└── utils/          # Formatting helpers
```

## Security Model (UI Layer)

- Role-gated routes via `ProtectedRoute` (UI-side UX gate; the real boundary is the backend).
- Patient records are only accessible to clinicians **after** scanning a valid temporary QR token — never by URL or patient ID alone.
- Access sessions expire automatically after 5 minutes and every access event is logged for audit.
