import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Table, { type TableColumn } from '@/components/ui/Table';
import Breadcrumb from '@/pages/scan-history/Breadcrumb';
import { RiskBadge } from '@/pages/scan-history/badges';
import { getDocumentById, getFindingsForScan, getScanById } from '@/pages/scan-history/scanHistoryMockData';
import type { FindingRow } from '@/pages/scan-history/types';
import downloadIcon from '@/assets/Download.svg';

const ScanResultsPage = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const scan = scanId ? getScanById(scanId) : undefined;

  if (!scan) {
    return <Navigate to="/scans" replace />;
  }

  const findingRows: FindingRow[] = getFindingsForScan(scan.id).map((finding) => ({
    ...finding,
    documentTitle: getDocumentById(finding.documentId)?.title ?? 'Unknown document',
  }));

  const columns: TableColumn<FindingRow>[] = [
    {
      key: 'document',
      header: 'Document',
      width: 170,
      render: (row) => <span className="font-medium text-[13px] text-slate-900">{row.documentTitle}</span>,
    },
    {
      key: 'risk',
      header: 'Risk',
      width: 90,
      render: (row) => <RiskBadge risk={row.risk} variant="text" />,
    },
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
      header: 'Suggested Changes',
      render: (row) => <span className="text-[13px] text-[#353839]">{row.suggestedChange}</span>,
    },
  ];

  const findingsCount = scan.findingsCount;
  const breakdown = scan.findingsBreakdown;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9]">
      <PageHeader
        title={
          <Breadcrumb
            items={[{ label: 'Scan History', to: '/scans' }, { label: `Run ${scan.id}` }]}
          />
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-md overflow-hidden px-6 pb-6 pt-2">
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-sm">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Scan Results — {scan.id}</h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Run Date: {scan.dateTime} · Trigger: {scan.triggerLabel} · Scope: {scan.scannedCount} documents · Run
              by: {scan.runBy}
            </p>
          </div>
          {scan.workbook.state === 'available' && (
            <Button>
              <img src={downloadIcon} alt="" className="h-4 w-4 shrink-0" aria-hidden="true" />
              Governance Workbook
            </Button>
          )}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-sm md:grid-cols-4">
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Documents Scanned</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{scan.scannedCount}</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Findings</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {findingsCount ?? '—'}{' '}
              {breakdown && (
                <span className="text-sm font-normal text-muted">
                  ({breakdown.high} HIGH, {breakdown.medium} MED, {breakdown.low} LOW)
                </span>
              )}
            </p>
          </div>
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#DC2626]">Mandatory Clinical Review</p>
            <p className="mt-1 text-2xl font-bold text-[#DC2626]">{scan.mandatoryClinicalReview ?? '—'}</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Scan Warnings</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{scan.scanWarnings ?? '—'}</p>
          </div>
        </div>

        <Table
          className="min-h-0 flex-1"
          columns={columns}
          data={findingRows}
          getRowKey={(row) => row.id}
          onRowClick={(row) =>
            navigate(`/scans/${scan.id}/documents/${row.documentId}`)
          }
          emptyMessage={
            scan.status === 'in-progress' ? 'This scan is still running.' : 'No findings for this scan.'
          }
          pagination={{
            page: 1,
            pageSize: 10,
            totalItems: findingRows.length,
            onPageChange: () => {},
          }}
        />
      </div>
    </div>
  );
};

export default ScanResultsPage;
