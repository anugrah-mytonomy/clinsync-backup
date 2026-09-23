# Feature Specification: Scan History

**Feature Branch**: `005-scan-history`
**Created**: 2026-09-22
**Status**: Partial (pages + mock data; scan APIs not wired)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review past scans (Priority: P1)

The user opens `/scans` and sees scan runs with trigger, status, findings, and workbook state.

**Independent Test**: Open Scan History; table of `ScanRun` rows.

**Acceptance Scenarios**:

1. **Given** scan runs, **When** the page loads, **Then** each row shows date/time, trigger label, scanned count, status, run by, findings, workbook state.
2. **Given** a completed scan with workbook `available`, **When** they Download, **Then** they receive the workbook (`GET /scans/:scanId/workbook`).
3. **Given** workbook `expired` (7-day retention), **When** they regenerate, **Then** `POST /scans/:scanId/workbook/regenerate` returns generating.

### User Story 2 - Inspect a scan (Priority: P1)

The user opens `/scans/:scanId` to see findings, then a document under that scan.

**Acceptance Scenarios**:

1. **Given** a scan id, **When** they open Scan Results, **Then** findings list with risk, category, flagged text, suggested change.
2. **Given** a finding document, **When** they open Document Details, **Then** they see metadata, scan history for that document, and latest findings.
3. **Given** Document Details, **When** they Replace, **Then** they go to `/scans/:scanId/documents/:documentId/replace`. Previous file is not retained (UI warning).

### Edge Cases

- Status `in-progress`: findings may be null.
- Finding risk may be `clear` as well as high/medium/low.
- Scan This Document from details: `POST /documents/:documentId/scan` → `202`.

## Requirements *(mandatory)*

- **FR-001**: List `GET /scans`. Detail `GET /scans/:scanId`. Findings `GET /scans/:scanId/findings`.
- **FR-002**: Enums match `src/pages/scan-history/types.ts` and `API_LLD.md` §4–5.
- **FR-003**: Replace uses the same upload pipeline as Add Content plus metadata (`POST /documents/:documentId/replace`).
- **FR-004**: Mock data is allowed until APIs are wired; status stays Partial.

### Key Entities

- ScanRun, Finding, ScanDocument, ScanWorkbook.

## Success Criteria *(mandatory)*

- **SC-001**: User can open a historical scan and read findings.
- **SC-002**: User can download or regenerate a workbook according to workbook state.

## Out of Scope

- Async transport choice (polling vs SSE) — listed as an open question in `API_LLD.md` §9
