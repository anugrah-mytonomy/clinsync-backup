# Feature Specification: Add Content

**Feature Branch**: `006-add-content`
**Created**: 2026-09-22
**Status**: Partial (client validation + LocalStack upload in dev; production presigned-URL API not wired)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload clinical files (Priority: P1)

From `/library/add-content` (or Dashboard Add Content), the user drops files and sees ready / review / rejected states.

**Independent Test**: Drop a small PDF and a `.exe`; PDF becomes ready (or reviews if duplicate); exe is rejected.

**Acceptance Scenarios**:

1. **Given** `pdf` / `doc` / `docx` / `zip` under 5 GB and non-empty, **When** dropped, **Then** status is `ready` unless a duplicate rule applies.
2. **Given** unsupported extension, empty file, or size > 5 GB, **When** dropped, **Then** status is `rejected` with the inline reason from `addContentValidation.ts`.
3. **Given** duplicate filename in the same batch, **When** dropped, **Then** status is `review`.
4. **Given** duplicate filename already in the library, **When** validated (backend on initiate), **Then** status is `review`.

### User Story 2 - Persist uploads (Priority: P1)

Ready files are stored and appear in the library.

**Acceptance Scenarios**:

1. **Production**: `POST /library/uploads/initiate` → PUT presigned URL → `POST /library/uploads/complete`. Frontend MUST NOT receive long-lived AWS keys.
2. **Local dev**: PUT via Vite `/s3` proxy to LocalStack is allowed until the same initiate/complete contract is available locally.

### Edge Cases

- ZIP handling (one library row vs extracted files) is `NEEDS CLARIFICATION` (`API_LLD.md` §9).
- 5 GB is the specified max; browser memory limits are not separately specified.

## Requirements *(mandatory)*

- **FR-001**: Accepted extensions: `pdf`, `doc`, `docx`, `zip`. Max 5 GB. Empty files rejected.
- **FR-002**: UI statuses: `ready` | `review` | `rejected`.
- **FR-003**: Production upload MUST follow `API_LLD.md` §3 (initiate / PUT / complete).
- **FR-004**: New library records default specialties `Unassigned` and documentType `Unknown` until edited (complete response in LLD).

### Key Entities

- Upload item: fileName, contentType, sizeBytes, uploadId, objectKey, status, rejectReason.

## Success Criteria *(mandatory)*

- **SC-001**: Unsupported files never leave the client as `ready`.
- **SC-002**: A ready PDF in local dev can be uploaded to LocalStack.
- **SC-003** (when API wired): complete creates a library row visible on `/library`.

## Out of Scope

- Virus scanning UX
- In-browser ZIP extraction
