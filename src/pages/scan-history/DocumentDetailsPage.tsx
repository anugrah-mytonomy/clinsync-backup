import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Table, { type TableColumn } from '@/components/ui/Table';
import { ChevronDownIcon, InfoIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import Breadcrumb from '@/pages/scan-history/Breadcrumb';
import { RiskBadge } from '@/pages/scan-history/badges';
import {
  getDocumentById,
  getFindingsForDocumentInScan,
  getScanHistoryForDocument,
} from '@/pages/scan-history/scanHistoryMockData';
import type { DocumentScanHistoryEntry, Finding } from '@/pages/scan-history/types';

const DocumentDetailsPage = () => {
  const { scanId, documentId } = useParams<{ scanId: string; documentId: string }>();
  const navigate = useNavigate();

  const document = documentId ? getDocumentById(documentId) : undefined;
  if (!document || !scanId) {
    return <Navigate to="/scans" replace />;
  }

  const scanHistory = getScanHistoryForDocument(document.id);
  const latestScanId = scanHistory[0]?.scanId;
  const isOlderScan = Boolean(latestScanId) && latestScanId !== scanId;
  const findings = getFindingsForDocumentInScan(scanId, document.id);
  const version = document.version.toUpperCase();

  const cellText = (entry: DocumentScanHistoryEntry, text: string) => (
    <span className={cn('text-[13px] text-[#353839]', entry.scanId === scanId && 'font-semibold text-slate-900')}>
      {text}
    </span>
  );

  const historyColumns: TableColumn<DocumentScanHistoryEntry>[] = [
    { key: 'scanId', header: 'Scan ID', width: 100, render: (entry) => cellText(entry, entry.scanId) },
    { key: 'dateTime', header: 'Date', width: 190, render: (entry) => cellText(entry, entry.dateTime) },
    { key: 'triggerLabel', header: 'Run Type', width: 230, render: (entry) => cellText(entry, entry.triggerLabel) },
    {
      key: 'findingsCount',
      header: 'Findings',
      width: 100,
      render: (entry) => cellText(entry, String(entry.findingsCount)),
    },
    { key: 'version', header: 'Version', width: 100, render: (entry) => cellText(entry, version) },
    {
      key: 'highestRisk',
      header: 'Highest Risk',
      width: 130,
      render: (entry) => <RiskBadge risk={entry.highestRisk ?? 'clear'} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (entry) =>
        entry.scanId === scanId ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#125B28]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#125B28]" />
            Currently viewing
          </span>
        ) : (
          <span className="text-[13px] text-muted">—</span>
        ),
    },
  ];

  const findingColumns: TableColumn<Finding>[] = [
    {
      key: 'document',
      header: 'Document',
      width: 170,
      render: () => <span className="text-[13px] font-semibold text-slate-900">{document.title}</span>,
    },
    { key: 'risk', header: 'Risk', width: 90, render: (row) => <RiskBadge risk={row.risk} variant="text" /> },
    {
      key: 'category',
      header: 'Category',
      width: 150,
      render: (row) => <span className="text-[13px] text-[#353839]">{row.category}</span>,
    },
    {
      key: 'flaggedText',
      header: 'Flagged Text',
      render: (row) => <span className="text-[13px] text-[#353839]">{row.flaggedText}</span>,
    },
    {
      key: 'suggestedChange',
      header: 'Suggested Change',
      render: (row) => <span className="text-[13px] font-medium text-slate-900">{row.suggestedChange}</span>,
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9]">
      <PageHeader
        title={
          <Breadcrumb
            items={[
              { label: 'Scan History', to: '/scans' },
              { label: `Run ${scanId}`, to: `/scans/${scanId}` },
              { label: document.title },
            ]}
          />
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-md overflow-auto px-6 pb-6 pt-2">
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-sm">
          <h1 className="text-lg font-semibold text-slate-900">Scan Findings</h1>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ChevronDownIcon className="h-4 w-4 rotate-90" />
            Back
          </Button>
        </div>

        <div className="grid shrink-0 grid-cols-1 gap-md rounded-lg border border-border bg-background p-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Title</p>
            <p className="mt-1 text-[13px] font-semibold text-slate-900">{document.title}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">Version</p>
            <p className="mt-1 text-[13px] text-slate-900">{document.version}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Specialty</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {document.specialties.length === 0 ? (
                <span className="rounded-full bg-[#FCEACB] px-2 py-0.5 text-xs font-medium text-[#8C5900]">
                  Unassigned
                </span>
              ) : (
                document.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-[#D9ECF2] px-2 py-0.5 text-xs font-medium text-[#005875]"
                  >
                    {specialty}
                  </span>
                ))
              )}
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">Date Added</p>
            <p className="mt-1 text-[13px] text-slate-900">{document.addedAt}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Document Type</p>
            <p className="mt-1 text-[13px] text-slate-900">{document.documentType}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-sm">
          <h2 className="text-sm font-semibold text-slate-900">Scan History</h2>
          <Table
            columns={historyColumns}
            data={scanHistory}
            getRowKey={(entry) => entry.scanId}
            onRowClick={(entry) => navigate(`/scans/${entry.scanId}/documents/${document.id}`)}
            emptyMessage="This document has not been scanned yet."
          />
        </div>

        {isOlderScan && (
          <div className="flex shrink-0 items-start gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#8C5900]" />
            <div>
              <p className="text-[13px] font-semibold text-slate-900">Viewing an Older Scan</p>
              <p className="mt-0.5 text-xs text-[#353839]">
                These findings are from {scanId} ({document.version}). A newer scan{' '}
                <span className="font-semibold">{latestScanId}</span> is available.
              </p>
            </div>
          </div>
        )}

        <div className="flex shrink-0 flex-col gap-sm">
          <h2 className="text-sm font-semibold text-slate-900">Findings</h2>
          <Table
            columns={findingColumns}
            data={findings}
            getRowKey={(row) => row.id}
            emptyMessage="No findings for this document in this scan."
            pagination={{
              page: 1,
              pageSize: 10,
              totalItems: findings.length,
              onPageChange: () => {},
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsPage;
