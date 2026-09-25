# Feature Specification: Content Library

**Feature Branch**: `004-content-library`
**Created**: 2026-09-22
**Status**: Partial (table UI + mock data; list/mutate APIs not wired)

## In short

The `/library` page: a searchable, paginated table of every clinical
document, with bulk actions (scan selected / scan everything) and per-row
actions (edit, replace, download, delete). The table and search work
against fake in-memory data right now — no real list/search/mutate API is
connected yet, so nothing here persists after a refresh.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse titles (Priority: P1)

The user opens `/library` and sees clinical documents with specialty, type, version, dates, risk, and findings.

**Independent Test**: Open Library; table renders rows; search and pagination controls are present.

**Acceptance Scenarios**:

1. **Given** documents exist, **When** Library loads, **Then** the user sees title, specialties, document type, version, added date, last scanned, highest risk, findings.
2. **Given** a search string, **When** they search, **Then** results filter by title (API: `search` query; today: client mock).
3. **Given** unassigned specialties, **When** present, **Then** an untagged/unassigned count is visible (assigned vs unassigned totals).

### User Story 2 - Act on documents (Priority: P1)

The user scans, edits metadata, replaces, downloads, or deletes from the table.

**Acceptance Scenarios**:

1. **Given** selected rows, **When** they Scan Selected, **Then** a scan is requested (`POST /scans` with `manual-selected` + ids) and they can move to Scan History.
2. **Given** the library, **When** they Scan Full Library, **Then** `POST /scans` with `scheduled-full-library`.
3. Row actions Edit / Replace / Download / Delete MUST exist. Backend endpoints for edit/delete/download are in `API_LLD.md` §2 (follow that contract when wiring).

### Edge Cases

- Empty library: `NoContent` empty state.
- Documents never scanned: `lastScannedAt`, `highestRisk`, `findings` are null.

## Requirements *(mandatory)*

- **FR-001**: List from `GET /library/documents` with `search`, `page`, `pageSize`, optional `specialty`, `documentType`.
- **FR-002**: Document shape is `LibraryDocument` (`src/pages/content-library/types.ts`).
- **FR-003**: `highestRisk` is `"high"` | `"medium"` | `"low"` | `null`.
- **FR-004**: Bulk and row actions must not be invented beyond `API_LLD.md` §2.
- **FR-005**: Until the API is wired, mock data in `libraryMockData.ts` is allowed; status stays Partial.

### Key Entities

- **Library document**: title, specialties[], documentType, version, addedAt, lastScannedAt, highestRisk, findings.

## Success Criteria *(mandatory)*

- **SC-001**: User can find a title by search.
- **SC-002**: User can start a scan of selected documents or the full library (UI now; API when wired).

## Out of Scope

- Upload (see 006-add-content)
- Scan results presentation (see 005-scan-history)
