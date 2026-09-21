import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Table, { type TableColumn } from '@/components/ui/Table';
import { InfoIcon } from '@/components/ui/icons';
import { scanRuns } from '@/pages/scan-history/scanHistoryMockData';
import { StatusBadge } from '@/pages/scan-history/badges';
import type { ScanRun } from '@/pages/scan-history/types';
import generatingIcon from '@/assets/Generating.svg';
import downloadIcon from '@/assets/Download.svg';
import regenerateIcon from '@/assets/Regenerate.svg';

const formatFindings = (scan: ScanRun) => {
  if (scan.findingsCount === null || scan.findingsBreakdown === null) return '—';
  const { high, medium, low } = scan.findingsBreakdown;
  return (
    <span>
      {scan.findingsCount}{' '}
      <span className="text-muted">
        ({high}H/{medium}M/{low}L)
      </span>
    </span>
  );
};

const ScanHistoryPage = () => {
  const navigate = useNavigate();

  const columns: TableColumn<ScanRun>[] = [
    {
      key: 'id',
      header: 'Scan ID',
      width: 70,
      render: (scan) => <span className="font-medium text-[13px] text-slate-900">{scan.id}</span>,
    },
    {
      key: 'dateTime',
      header: 'Date/Time',
      width: 190,
      render: (scan) => <span className="text-[13px] text-[#353839]">{scan.dateTime}</span>,
    },
    {
      key: 'trigger',
      header: 'Trigger',
      width: 210,
      render: (scan) => <span className="text-[13px] text-[#353839]">{scan.triggerLabel}</span>,
    },
    {
      key: 'scanned',
      header: 'Scanned',
      width: 110,
      render: (scan) => (
        <span className="text-[13px] text-[#353839]">
          {scan.scannedCount} document{scan.scannedCount === 1 ? '' : 's'}
        </span>
      ),
    },
    {
      key: 'findings',
      header: 'Findings',
      width: 110,
      render: (scan) => <span className="text-[13px] text-[#353839]">{formatFindings(scan)}</span>,
    },
    {
      key: 'runBy',
      header: 'Run By',
      width: 120,
      render: (scan) => <span className="text-[13px] text-[#353839]">{scan.runBy}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 110,
      render: (scan) => <StatusBadge status={scan.status} />,
    },
    {
      key: 'workbook',
      header: 'Workbook',
      width: 110,
      render: (scan) => {
        if (scan.workbook.state === 'generating') {
          return (
            <span className="inline-flex items-center gap-1 text-[13px] text-muted">
              <img src={generatingIcon} alt="" className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Generating
            </span>
          );
        }
        if (scan.workbook.state === 'expired') {
          return (
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-danger hover:underline"
            >
              <img src={regenerateIcon} alt="" className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Regenerate
            </button>
          );
        }
        return (
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
          >
            <img src={downloadIcon} alt="" className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Download
          </button>
        );
      },
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9]">
      <PageHeader title="Scan History" subtitle="View past scan runs and download governance workbooks." />

      <div className="flex min-h-0 flex-1 flex-col gap-md overflow-hidden px-6 pb-6 pt-4">
        <div className="flex shrink-0 items-start gap-2 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-[13px] text-[#1D4ED8]">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Governance workbooks are retained for 7 days. Expired workbooks can be regenerated from preserved scan
            data.
          </span>
        </div>

        <Table
          className="min-h-0 flex-1"
          columns={columns}
          data={scanRuns}
          getRowKey={(scan) => scan.id}
          onRowClick={(scan) => navigate(`/scans/${scan.id}`)}
          emptyMessage="No scans have been run yet."
          pagination={{
            page: 1,
            pageSize: 10,
            totalItems: scanRuns.length,
            onPageChange: () => {},
          }}
        />
      </div>
    </div>
  );
};

export default ScanHistoryPage;
