# ClinSync API — Low-Level Design (Frontend ↔ Backend)

This document describes the API contracts the **ClinSync UI** expects, based on current pages, mock data, and TypeScript types.

**Spec-driven:** user-facing behavior and the auth cookie/token split are defined in [`.specify/specs/`](./.specify/specs/README.md). If this file and a spec contract disagree, the spec wins — then this file must be updated.

**Status today**

| Area | UI route | Data source |
|------|----------|-------------|
| Auth | `/login` | Real API (`POST /centralauth/login`). Session cookie (`refresh_token`) specified but not yet issued — see [auth gaps](./.specify/specs/001-authentication/gaps.md). |
| Dashboard | `/dashboard` | Hardcoded mock in components |
| Library | `/library` | `libraryMockData.ts` |
| Add Content | `/library/add-content` | Client validation + LocalStack S3 (dev only) |
| Scan History | `/scans` | `scanHistoryMockData.ts` |
| Scan Results | `/scans/:scanId` | Mock |
| Document Details | `/scans/:scanId/documents/:documentId` | Mock |
| Replace Document | `/scans/:scanId/documents/:documentId/replace` | Mock |

**Suggested base URL:** `/api/v1` (or align with existing Mytonomy services)

**Auth:** All endpoints below (except login and refresh) require `Authorization: Bearer <access_token>`.

**Canonical auth spec:** [`.specify/specs/001-authentication/`](./.specify/specs/001-authentication/spec.md) — cookie name, attributes, and “who writes the cookie” live there. This section is a short index of that contract.

---

## 1. Authentication

Frontend is wired via RTK Query (`credentials: 'include'`). The UI **does not** write cookies. The auth service **must** issue the session cookie on login.

Canonical contract: [`.specify/specs/001-authentication/contracts/auth.md`](./.specify/specs/001-authentication/contracts/auth.md).

### Session cookie

| Attribute | Value |
|-----------|--------|
| Name | `refresh_token` |
| HttpOnly | yes |
| Path | `/` |
| SameSite | `Lax` |
| Domain | omit (host-only) |
| Secure | only on HTTPS — **not** on `http://localhost` |

`credentials: 'include'` only stores/sends this cookie if login’s response includes `Set-Cookie`. Missing `Set-Cookie` → empty Cookies tab → refresh `401` missing token.

### `POST /centralauth/login`

**Request**

```json
{
  "email": "content-ops@mytonomy.com",
  "password": "string",
  "client_id": "CS"
}
```

**Response `200`**

Headers (required):

```http
Set-Cookie: refresh_token=<opaque>; Path=/; HttpOnly; SameSite=Lax; Max-Age=<seconds>
```

Body:

```json
{
  "access_token": "string",
  "expires_in": 3600
}
```

Frontend stores `access_token` in Redux only.

### `POST /centralauth/logout`

Empty JSON body is acceptable. Returns `204`. MUST expire `refresh_token` (`Max-Age=0`).

### `POST /centralauth/refresh`

Empty body. **No Bearer required.** Identity is the `refresh_token` cookie.

Returns the same JSON shape as login. `401` when the cookie is missing, invalid, or expired.

---

## 2. Library

**UI:** `LibraryPage` — table with search, pagination, bulk actions, row actions (Edit / Replace / Download / Delete), Scan Full Library, Scan Selected.

### `GET /library/documents`

List documents for the library table.

**Query params**

| Param | Type | Notes |
|-------|------|-------|
| `search` | string | Filter by title (optional) |
| `page` | number | Default `1` |
| `pageSize` | number | Default `10` |
| `specialty` | string[] | Optional filter |
| `documentType` | string | Optional filter |

**Response `200`**

```json
{
  "items": [
    {
      "id": "doc-1",
      "title": "Whipple Procedure",
      "specialties": ["Oncology", "Gastroenterology"],
      "documentType": "Patient Education Text",
      "version": "v1",
      "addedAt": "2026-09-08T09:00:00Z",
      "lastScannedAt": null,
      "highestRisk": null,
      "findings": null
    }
  ],
  "totalItems": 7,
  "page": 1,
  "pageSize": 10,
  "assignedCount": 5,
  "unassignedCount": 2
}
```

**Field notes**

| Field | Type | Values |
|-------|------|--------|
| `highestRisk` | string \| null | `"high"` \| `"medium"` \| `"low"` \| `null` |
| `findings` | number \| null | Total findings from latest scan |
| `addedAt`, `lastScannedAt` | ISO 8601 string | UI formats for display |

Frontend type: `LibraryDocument` in `src/pages/content-library/types.ts`.

---

### `GET /library/documents/:documentId`

Single document detail (used for Edit / metadata panels).

**Response `200`**

```json
{
  "id": "doc-7",
  "title": "Famotidine Patient Handout",
  "specialties": ["Gastroenterology"],
  "documentType": "Medication Guide",
  "version": "v1",
  "sourceFile": "Famotidine_Patient_Handout.docx",
  "sourceFileUrl": "https://...",
  "addedAt": "2026-07-20T09:00:00Z",
  "lastScannedAt": "2026-09-01T09:00:00Z",
  "highestRisk": "low",
  "findings": 2
}
```

---

### `PATCH /library/documents/:documentId`

Edit metadata from library row action **Edit**.

**Request**

```json
{
  "title": "string",
  "specialties": ["Gastroenterology"],
  "documentType": "Medication Guide"
}
```

**Response `200`:** Updated document object.

---

### `DELETE /library/documents/:documentId`

Row action **Delete**. Removes document from library.

**Response `204`**

---

### `GET /library/documents/:documentId/download`

Row action **Download**. Returns file or redirect to presigned S3 URL.

**Response `200`:** Binary stream, or `302` redirect to presigned URL.

---

### `POST /library/documents/bulk-update`

Bulk actions bar — **Apply** after selecting rows and choosing Specialty / Document Type.

**Request**

```json
{
  "documentIds": ["doc-1", "doc-3"],
  "specialty": ["Oncology"],
  "documentType": "Patient Education Text"
}
```

At least one of `specialty` or `documentType` should be provided.

**Response `200`**

```json
{
  "updatedCount": 2
}
```

---

### `GET /library/filters`

Options for bulk-action dropdowns.

**Response `200`**

```json
{
  "specialties": ["Oncology", "Gastroenterology", "Unassigned"],
  "documentTypes": ["Patient Education Text", "Medication", "Video Script"]
}
```

---

## 3. Content upload (Add Content)

**UI:** `AddContentPage` — drag/drop files, client-side basic validation, then upload.

**Supported formats:** `pdf`, `doc`, `docx`, `zip`  
**Max size:** 5 GB per file

**Client validation today (before API call):**

| Check | Result in UI |
|-------|----------------|
| Unsupported extension | `rejected` |
| Empty file | `rejected` |
| Over 5 GB | `rejected` |
| Duplicate filename in same batch | `review` |
| Duplicate filename already in library | `review` (backend should confirm) |
| Passes all checks | `ready` |

### Recommended upload flow (production)

Frontend should **not** receive AWS credentials. Use presigned URLs:

```
1. POST /library/uploads/initiate   → get upload URL + uploadId
2. PUT  <presigned-url>             → browser uploads file to S3
3. POST /library/uploads/complete   → backend creates library record
```

**Local dev:** Frontend currently PUTs directly to LocalStack via Vite proxy (`/s3/...`). Backend can mirror the same contract with LocalStack in dev and real S3 in prod.

---

### `POST /library/uploads/initiate`

**Request**

```json
{
  "files": [
    {
      "fileName": "ClinSync.zip",
      "contentType": "application/zip",
      "sizeBytes": 444
    }
  ]
}
```

**Response `200`**

```json
{
  "uploads": [
    {
      "uploadId": "upl-abc123",
      "fileName": "ClinSync.zip",
      "objectKey": "library/1758...-ClinSync.zip",
      "uploadUrl": "https://s3.../presigned",
      "status": "ready",
      "rejectReason": null
    },
    {
      "uploadId": null,
      "fileName": "bad.exe",
      "status": "rejected",
      "rejectReason": "Unsupported file format (.exe)."
    },
    {
      "uploadId": "upl-def456",
      "fileName": "Guide.pdf",
      "status": "review",
      "rejectReason": "Duplicate filename already exists in library."
    }
  ]
}
```

`status`: `"ready"` | `"review"` | `"rejected"` — matches UI badges.

---

### `POST /library/uploads/complete`

Called after successful S3 PUT for each `ready` file.

**Request**

```json
{
  "uploadId": "upl-abc123",
  "objectKey": "library/1758...-ClinSync.zip"
}
```

**Response `201`**

```json
{
  "document": {
    "id": "doc-8",
    "title": "ClinSync",
    "specialties": ["Unassigned"],
    "documentType": "Unknown",
    "version": "v1",
    "addedAt": "2026-09-21T12:00:00Z",
    "lastScannedAt": null,
    "highestRisk": null,
    "findings": null
  }
}
```

---

## 4. Scans

**UI:** Scan History table, Scan Results, workbook download/regenerate.

### `GET /scans`

**Query params:** `page`, `pageSize`

**Response `200`**

```json
{
  "items": [
    {
      "id": "SR-003",
      "dateTime": "2026-09-01T09:00:00Z",
      "trigger": "manual-selected",
      "triggerLabel": "Manual — selected documents",
      "documentIds": ["doc-1", "doc-2"],
      "scannedCount": 6,
      "status": "success",
      "runBy": "John Doe",
      "findingsCount": 9,
      "findingsBreakdown": { "high": 1, "medium": 4, "low": 4 },
      "mandatoryClinicalReview": 1,
      "scanWarnings": 0,
      "workbook": {
        "state": "available",
        "downloadUrl": "/api/v1/scans/SR-003/workbook"
      }
    }
  ],
  "totalItems": 4,
  "page": 1,
  "pageSize": 10
}
```

**Enums**

| Field | Values |
|-------|--------|
| `trigger` | `"manual-selected"` \| `"scheduled-full-library"` |
| `status` | `"in-progress"` \| `"success"` \| `"expired"` |
| `workbook.state` | `"generating"` \| `"available"` \| `"expired"` |

Frontend type: `ScanRun` in `src/pages/scan-history/types.ts`.

---

### `GET /scans/:scanId`

Scan run detail + summary for Scan Results page header.

**Response `200`:** Single `ScanRun` object.

---

### `GET /scans/:scanId/findings`

Findings table on Scan Results page.

**Response `200`**

```json
{
  "items": [
    {
      "id": "f-001",
      "scanId": "SR-003",
      "documentId": "doc-1",
      "documentTitle": "Whipple Procedure",
      "risk": "medium",
      "category": "Dosage Guideline",
      "flaggedText": "Original flagged sentence...",
      "suggestedChange": "Suggested replacement..."
    }
  ]
}
```

| `risk` | `"high"` \| `"medium"` \| `"low"` \| `"clear"` |

---

### `POST /scans`

Trigger a scan from Library page.

**Request — Scan Selected**

```json
{
  "trigger": "manual-selected",
  "documentIds": ["doc-1", "doc-3"]
}
```

**Request — Scan Full Library**

```json
{
  "trigger": "scheduled-full-library"
}
```

**Response `202`**

```json
{
  "id": "SR-005",
  "status": "in-progress",
  "workbook": { "state": "generating" }
}
```

---

### `GET /scans/:scanId/workbook`

Download governance workbook (Scan History **Download**, Scan Results button).

**Response `200`:** `.xlsx` file stream, or `302` to presigned URL.

---

### `POST /scans/:scanId/workbook/regenerate`

When workbook is **expired** (retention: 7 days per UI banner).

**Response `202`**

```json
{
  "workbook": { "state": "generating" }
}
```

---

## 5. Document details & replace

**UI:** Document Details, Replace Document pages under scan history routes.

### `GET /documents/:documentId`

Document metadata + scan history for one document.

**Response `200`**

```json
{
  "id": "doc-7",
  "title": "Famotidine Patient Handout",
  "specialties": ["Gastroenterology"],
  "documentType": "Medication Guide",
  "version": "v1",
  "sourceFile": "Famotidine_Patient_Handout.docx",
  "sourceFileUrl": "https://...",
  "addedAt": "2026-07-20T09:00:00Z",
  "scanHistory": [
    {
      "scanId": "SR-001",
      "dateTime": "2026-08-20T10:30:00Z",
      "triggerLabel": "Manual — selected documents",
      "findingsCount": 2,
      "highestRisk": "medium"
    }
  ],
  "latestFindings": [
    {
      "id": "f-001",
      "risk": "medium",
      "category": "Dosage Guideline",
      "flaggedText": "...",
      "suggestedChange": "..."
    }
  ]
}
```

---

### `POST /documents/:documentId/scan`

**Scan This Document** button on Document Details.

**Response `202`:** New or existing `ScanRun` with `status: "in-progress"`.

---

### `POST /documents/:documentId/replace`

Replace document with new version (Replace page).

Uses same upload flow as Add Content, plus metadata:

**Request**

```json
{
  "uploadId": "upl-xyz",
  "objectKey": "library/...",
  "title": "Famotidine Patient Handout",
  "specialties": ["Gastroenterology"],
  "documentType": "Medication Guide",
  "changeLog": "Updated ibuprofen age restriction..."
}
```

**Response `200`**

```json
{
  "id": "doc-7",
  "version": "v2",
  "title": "Famotidine Patient Handout",
  "replacedAt": "2026-09-21T12:00:00Z"
}
```

Previous file is not retained (per UI warning).

---

## 6. Dashboard

**UI:** Inventory, Coverage, Backlog, Risk Trend, Documents by Year — all use hardcoded numbers today.

### `GET /dashboard/summary`

**Query params:** `range` = `"7d"` | `"30d"` | `"90d"` | `"all"`

**Response `200`**

```json
{
  "inventory": {
    "totalTitles": 8,
    "untaggedCount": 2,
    "specialtyTags": [
      { "label": "Oncology", "count": 1, "flagged": false },
      { "label": "Unassigned", "count": 2, "flagged": true }
    ],
    "documentTypes": [
      { "label": "Procedural Guide", "count": 1 }
    ]
  },
  "coverage": {
    "scannedCount": 6,
    "totalTitles": 8,
    "coveragePercent": 75,
    "oldestUnscanned": {
      "name": "Post-Op Wound Care Guide",
      "addedOn": "2026-09-06T09:00:00Z",
      "position": 1,
      "totalUnscanned": 2
    }
  },
  "backlog": {
    "tiles": [
      { "level": "high", "label": "High", "count": 1 },
      { "level": "medium", "label": "Medium", "count": 4 },
      { "level": "low", "label": "Low", "count": 4 }
    ]
  },
  "riskTrend": [
    { "date": "2026-08-01", "high": 0, "medium": 2, "low": 1 }
  ],
  "documentsByYear": [
    { "year": "2026", "count": 8 }
  ]
}
```

Frontend types: `src/pages/dashboard/types.ts`.

---

## 7. Error format

Use a consistent error body for all endpoints:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [
      { "field": "fileName", "message": "Unsupported file format" }
    ]
  }
}
```

| HTTP | When |
|------|------|
| `400` | Validation / bad request |
| `401` | Missing or expired token |
| `403` | Not allowed |
| `404` | Document or scan not found |
| `409` | Duplicate filename / conflict |
| `413` | File too large |
| `500` | Server error |

Frontend helper: `getApiErrorMessage()` in `src/types/api.ts`.

---

## 8. Mock data → API mapping

| Mock file | Replace with |
|-----------|----------------|
| `src/pages/content-library/libraryMockData.ts` | `GET /library/documents` |
| `src/pages/scan-history/scanHistoryMockData.ts` | `GET /scans`, `GET /scans/:id/findings`, `GET /documents/:id` |
| Dashboard component constants | `GET /dashboard/summary` |
| `uploadFileToLocalStack()` (dev) | `initiate` → S3 PUT → `complete` |

---

## 9. Open questions for backend discussion

1. **Duplicate detection** — Should `initiate` check library for existing filenames, or only on `complete`?
2. **ZIP handling** — One library row per zip, or one row per extracted file?
3. **Specialty multi-select** — Array on document, or join table?
4. **Workbook retention** — Confirm 7-day TTL and regenerate behavior.
5. **Scan async** — Polling vs webhook vs SSE for `in-progress` → `success`?
6. **Date format** — Prefer ISO 8601 in API; UI formats for display.
7. **Pagination** — Cursor vs offset (UI uses offset today).
8. **Base path** — Single BFF vs separate library/scan services?

---

## 10. Frontend integration plan (after API is ready)

1. Add RTK Query slices: `libraryApiSlice`, `scansApiSlice`, `dashboardApiSlice`.
2. Replace mock imports in pages with generated hooks.
3. Swap LocalStack upload for presigned URL flow from backend.
4. Keep client-side basic validation; defer duplicate-in-library check to `initiate` response.
