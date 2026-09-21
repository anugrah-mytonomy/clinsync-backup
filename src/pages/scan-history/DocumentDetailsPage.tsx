import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Table, { type TableColumn } from '@/components/ui/Table';
import { ReplaceIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import scanIcon from '@/assets/Scan.svg';
import fileTextIcon from '@/assets/File_text.svg';
import Breadcrumb from '@/pages/scan-history/Breadcrumb';
import { RiskBadge } from '@/pages/scan-history/badges';
import {
  getDocumentById,
  getFindingsForDocumentInScan,
  getScanHistoryForDocument,
} from '@/pages/scan-history/scanHistoryMockData';
import type { DocumentScanHistoryEntry } from '@/pages/scan-history/types';

const DocumentDetailsPage = () => {
  const { scanId, documentId } = useParams<{ scanId: string; documentId: string }>();
  const navigate = useNavigate();

  const document = documentId ? getDocumentById(documentId) : undefined;
  if (!document || !scanId) {
    return <Navigate to="/scans" replace />;
  }

  const scanHistory = getScanHistoryForDocument(document.id);
  const mostRecentScanId = scanHistory[0]?.scanId ?? scanId;
  const latestFindings = getFindingsForDocumentInScan(mostRecentScanId, document.id);

  const columns: TableColumn<DocumentScanHistoryEntry>[] = [
    {
      key: 'dateTime',
      header: 'Date',
      width: 170,
      render: (entry) => <span className="text-[13px] text-[#353839]">{entry.dateTime}</span>,
    },
    {
      key: 'triggerLabel',
      header: 'Run Type',
      width: 190,
      render: (entry) => <span className="text-[13px] text-[#353839]">{entry.triggerLabel}</span>,
    },
    {
      key: 'findingsCount',
      header: 'Findings',
      width: 90,
      render: (entry) => <span className="text-[13px] text-[#353839]">{entry.findingsCount}</span>,
    },
    {
      key: 'highestRisk',
      header: 'Highest Risk',
      width: 110,
      render: (entry) => (entry.highestRisk ? <RiskBadge risk={entry.highestRisk} /> : <RiskBadge risk="clear" />),
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
          <h1 className="text-lg font-semibold text-slate-900">{document.title}</h1>
          <div className="flex items-center gap-sm">
            <Button variant="secondary" onClick={() => navigate(`/scans/${mostRecentScanId}`)}>
              <img src={scanIcon} alt="" className="h-4 w-4 shrink-0" aria-hidden="true" />
              Scan This Document
            </Button>
            <Button onClick={() => navigate(`/scans/${scanId}/documents/${document.id}/replace`)}>
              <ReplaceIcon className="h-4 w-4" />
              Replace
            </Button>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-1 gap-md rounded-lg border border-border bg-background p-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Title</p>
            <p className="mt-1 text-[13px] text-slate-900">{document.title}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">Version</p>
            <p className="mt-1 text-[13px] text-slate-900">{document.version}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Specialty</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {document.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-[#D9ECF2] px-2 py-0.5 text-xs font-medium text-[#005875]"
                >
                  {specialty}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">Date Added</p>
            <p className="mt-1 text-[13px] text-slate-900">{document.addedAt}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Document Type</p>
            <p className="mt-1 text-[13px] text-slate-900">{document.documentType}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">Source File</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
              <img src={fileTextIcon} alt="" className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {document.sourceFile}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-sm">
          <h2 className="text-sm font-semibold text-slate-900">Scan History</h2>
          <Table
            columns={columns}
            data={scanHistory}
            getRowKey={(entry) => entry.scanId}
            onRowClick={(entry) => navigate(`/scans/${entry.scanId}`)}
            emptyMessage="This document has not been scanned yet."
          />
        </div>

        <div className="flex flex-col gap-sm pb-2">
          <h2 className="text-sm font-semibold text-slate-900">Findings from Most Recent Scan</h2>
          {latestFindings.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-background px-4 py-6 text-center text-sm text-muted">
              No findings from the most recent scan — content and format meet current guidance.
            </div>
          ) : (
            <div className="flex flex-col gap-sm">
              {latestFindings.map((finding) => (
                <div
                  key={finding.id}
                  className={cn(
                    'rounded-lg border bg-background p-4',
                    finding.risk === 'high' ? 'border-[#FECACA]' : 'border-border',
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge risk={finding.risk} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {finding.category}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] text-slate-900">{finding.flaggedText}</p>
                  <p className="mt-2 text-[13px] text-[#353839]">
                    <span className="font-semibold">Suggested change:</span> {finding.suggestedChange}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsPage;
