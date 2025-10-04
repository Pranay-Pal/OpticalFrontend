# Doctor Portal Frontend Mapping

This document maps backend Doctor Portal API endpoints (3–8) to the implemented frontend components, user interactions, and rendered data.

## Endpoint Coverage

| Endpoint | Frontend Location | Trigger / Interaction | Data Displayed | Error Handling |
|----------|-------------------|-----------------------|----------------|----------------|
| GET /doctor/patients | `Patients.tsx` route `/doctor-dashboard/patients` | Page load + pagination (local) | ID, Name, Age, Gender, Phone, Last Visit, Shop | Toast + inline error row |
| POST /doctor/prescriptions | `CreatePrescriptionForm.tsx` (left column of prescriptions page) | Submit form after entering values | Success toast, auto-opens detail drawer | Toast on failure; form stays for correction |
| GET /doctor/prescriptions?page&limit | `Prescriptions/index.tsx` route `/doctor-dashboard/prescriptions` | Initial load & page navigation | Table rows with ID, Patient, Eye summaries, Created date | Toast + inline error message |
| GET /doctor/prescriptions/:id | `PrescriptionDetail.tsx` (drawer) | Clicking a prescription row or immediate after create | Full patient info + both eyes + timestamps | Inline error in drawer |
| GET /doctor/prescriptions/:id/pdf | Buttons (PDF) in table row & detail drawer | Button click initiates download | --- | Toast on failure |
| GET /doctor/prescriptions/:id/thermal | Buttons (Thermal) in table row & detail drawer | Button click opens new window with pre-formatted text | Monospace prescription slip | Toast on failure |

## Component Summary

### Patients Page (`Patients.tsx`)
- Fetches patients once (with placeholder pagination state).
- Shows loading skeleton rows while awaiting response.
- Displays count from `count` field of response.
- Gracefully handles empty and error states.

### Prescription Creation (`CreatePrescriptionForm.tsx`)
- Patient dropdown populated from `GET /doctor/patients`.
- Numeric inputs validated with constraints from `MEASUREMENT_LIMITS`.
- On success: toast + detail drawer opens for new prescription.

### Prescriptions List (`Prescriptions/index.tsx`)
- Paginated request with `page`, `limit` arguments.
- Row click opens detail.
- Action buttons (PDF, Thermal) stop event propagation.

### Prescription Detail (`PrescriptionDetail.tsx`)
- Drawer overlay with patient and measurement details.
- Buttons at footer for PDF download & thermal view.
- Thermal opens new tab / window displaying raw text in `<pre>`.

## Validation Rules (Frontend)
| Field | Range / Rule | Source |
|-------|--------------|--------|
| sphere | -20 to +20 | `MEASUREMENT_LIMITS` |
| cylinder | -10 to 0 | `MEASUREMENT_LIMITS` |
| axis | 0 to 180 | `MEASUREMENT_LIMITS` |
| add | 0 to 4 | `MEASUREMENT_LIMITS` |

## UX Enhancements
- Auto-open detail drawer after creation.
- Unified toast & error handling via `useApiResult` hook.
- Skeleton loading patterns for list and detail states.

## Future Enhancements (Optional)
- Server-driven pagination for patients (if backend adds params).
- Search/filter for patients & prescriptions.
- Export list as CSV.
- Accessible focus management for drawer open/close.

## QA Checklist

| Item | Pass Criteria |
|------|---------------|
| Patients load | Table populates with patient rows (>=0) and count matches length |
| Prescription create | Valid input yields success toast & drawer with new ID |
| Validation | Invalid axis (>180) blocks submit & shows error toast |
| Pagination (prescriptions) | Page changes fetch new data and updates page indicator |
| PDF download | File named `Prescription-{id}.pdf` downloaded by browser |
| Thermal viewer | New window shows monospaced text containing "PRESCRIPTION" |
| Error handling | Network failure surfaces toast + inline message |
| Header count | Reflects total prescriptions after new creation |

## Developer Notes
- API layer returns raw documented shapes; components keep mapping minimal.
- Some defensive coding remains (e.g., optional chaining) to tolerate backend evolution.
- No test harness added (user requested omission). Add Vitest + RTL later if needed.

---
Last updated: 2025-10-04
