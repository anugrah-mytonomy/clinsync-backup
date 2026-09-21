import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Table, { type TableColumn } from '@/components/ui/Table';
import { MoreVerticalIcon, PlusIcon, SearchIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import { libraryDocuments as initialDocuments } from '@/pages/content-library/libraryMockData';
import NoContent from '@/pages/content-library/NoContent';
import type { LibraryDocument, LibraryRiskLevel } from '@/pages/content-library/types';
import scanMaximizeIcon from '@/assets/Scan_Maximize.svg';
import playIcon from '@/assets/Play.svg';
import filterLinesIcon from '@/assets/Filter_lines.svg';

const riskBadgeClasses: Record<LibraryRiskLevel, string> = {
  high: 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]',
  medium: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]',
  low: 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]',
};

const DEFAULT_PAGE_SIZE = 10;

const LibraryPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<LibraryDocument[]>(initialDocuments);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [specialty, setSpecialty] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const goToAddContent = () => navigate('/library/add-content');

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter((doc) => doc.title.toLowerCase().includes(query));
  }, [documents, search]);

  const pageCount = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedDocuments = filteredDocuments.slice((safePage - 1) * pageSize, safePage * pageSize);

  const assignedCount = documents.filter((doc) => !doc.specialties.includes('Unassigned')).length;
  const unassignedCount = documents.length - assignedCount;

  const specialtyOptions = useMemo(() => {
    const values = [...new Set(documents.flatMap((doc) => doc.specialties))];
    return values.map((value) => ({ value, label: value }));
  }, [documents]);

  const documentTypeOptions = useMemo(() => {
    const values = [...new Set(documents.map((doc) => doc.documentType))];
    return values.map((value) => ({ value, label: value }));
  }, [documents]);

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(pagedDocuments.map((doc) => doc.id)) : new Set());
  };

  const handleRemove = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setOpenMenuId(null);
  };

  const columns: TableColumn<LibraryDocument>[] = [
    {
      key: 'title',
      header: 'Title',
      width: 140,
      render: (doc) => <span className="font-medium text-[13px] text-slate-900">{doc.title}</span>,
    },
    {
      key: 'specialties',
      header: (
        <span className="inline-flex items-center gap-1">
          Specialty
          <img src={filterLinesIcon} alt="" className="h-4 w-4 shrink-0" aria-hidden="true" />
        </span>
      ),
      width: 130,
      render: (doc) => (
        <div className="flex flex-wrap gap-1">
          {doc.specialties.map((specialty) => (
            <span
              key={specialty}
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                specialty === 'Unassigned'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-[#D9ECF2] text-[#005875]',
              )}
            >
              {specialty}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'documentType',
      header: (
        <span className="inline-flex items-center gap-1">
          Document type
          <img src={filterLinesIcon} alt="" className="h-4 w-4 shrink-0" aria-hidden="true" />
        </span>
      ),
      width: 140,
      render: (doc) => <span className=" text-[13px] whitespace-nowrap text-[#353839]">{doc.documentType}</span>,
    },
    {
      key: 'version',
      header: 'Version',
      width: 60,
      render: (doc) => <span className="text-[13px] text-[#353839]">{doc.version}</span>,
    },
    {
      key: 'addedAt',
      header: 'Added',
      width: 110,
      render: (doc) => <span className=" text-[13px] text-[#353839]">{doc.addedAt}</span>,
    },
    {
      key: 'lastScannedAt',
      header: 'Last scanned',
      width: 110,
      render: (doc) => (
        <span className="text-[#353839] text-[13px]">
          {doc.lastScannedAt ?? 'Never'}
        </span>
      ),
    },
    {
      key: 'highestRisk',
      header: 'Highest risk',
      width: 90,
      render: (doc) =>
        doc.highestRisk ? (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs text-[#353839] font-semibold uppercase',
              riskBadgeClasses[doc.highestRisk],
            )}
          >
            {doc.highestRisk}
          </span>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: 'findings',
      header: 'Findings',
      align: 'center',
      width: 60,
      render: (doc) => <span className="text-[#353839] text-[13px]">{doc.findings ?? '—'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: 60,
      render: (doc) => (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setOpenMenuId((current) => (current === doc.id ? null : doc.id))}
            aria-label={`Actions for ${doc.title}`}
            className="rounded p-1 text-muted transition-colors hover:bg-surface hover:text-slate-900"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </button>
          {openMenuId === doc.id && (
            <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-lg border border-[#35383914] bg-background py-1 shadow-[0px_4px_6px_-1px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.1)]">
              <button
                type="button"
                onClick={() => setOpenMenuId(null)}
                className="block w-full px-4 py-2.5 text-left text-sm font-medium text-[#353839] hover:bg-surface"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setOpenMenuId(null)}
                className="block w-full px-4 py-2.5 text-left text-sm font-medium text-[#353839] hover:bg-surface"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => setOpenMenuId(null)}
                className="block w-full px-4 py-2.5 text-left text-sm font-medium text-[#353839] hover:bg-surface"
              >
                Download
              </button>
              <button
                type="button"
                onClick={() => handleRemove(doc.id)}
                className="block w-full px-4 py-2.5 text-left text-sm font-medium text-[#B42318] hover:bg-surface"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (documents.length === 0) {
    return <NoContent onAddContent={goToAddContent} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9]">
      <PageHeader
        title="Library"
        subtitle="Manage content, run governance scans, and track compliance."
        actions={
          <div className="flex items-center gap-sm">
            <Button variant="secondary">
              <img src={scanMaximizeIcon} alt="" className="h-4 w-4 shrink-0" aria-hidden="true" />
              Scan Full Library
            </Button>
            <Button variant="secondary" disabled={selectedIds.size === 0}>
              <img src={playIcon} alt="" className="h-4 w-4 shrink-0" aria-hidden="true" />
              Scan Selected
            </Button>
            <Button onClick={goToAddContent}>
              <PlusIcon className="h-4 w-4" />
              Add Content
            </Button>
          </div>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-md overflow-hidden px-6 pb-6 pt-4">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-sm rounded-lg border border-border bg-background px-md py-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-sm">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-[#5A6065]">
              Bulk actions:
            </span>
            <div className="min-w-[12rem] flex-1">
              <Select
                fullWidth
                placeholder="Specialty (Multi-select)"
                options={specialtyOptions}
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
              />
            </div>
            <div className="min-w-[12rem] flex-1">
              <Select
                fullWidth
                placeholder="Document Type"
                options={documentTypeOptions}
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value)}
              />
            </div>
            <Button variant="secondary" size="md" disabled={selectedIds.size === 0} className="shrink-0">
              Apply
            </Button>
          </div>

          <span className="text-xs font-medium text-[#353839]">
            {assignedCount} Assigned · {unassignedCount} Unassigned
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative w-full max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="h-9 w-full rounded-md border border-[#35383961] bg-background py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary-hover"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        </div>

        <Table
          className="min-h-0 flex-1"
          columns={columns}
          data={pagedDocuments}
          getRowKey={(doc) => doc.id}
          selectable
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          emptyMessage="No documents match your search."
          pagination={{
            page: safePage,
            pageSize,
            totalItems: filteredDocuments.length,
            onPageChange: setPage,
            onPageSizeChange: (size) => {
              setPageSize(size);
              setPage(1);
            },
          }}
        />
      </div>
    </div>
  );
};

export default LibraryPage;
