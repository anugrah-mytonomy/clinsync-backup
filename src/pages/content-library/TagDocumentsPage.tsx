import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Table, { type TableColumn } from '@/components/ui/Table';
import { libraryDocuments } from '@/pages/content-library/libraryMockData';
import { cn } from '@/utils/cn';

const UNASSIGNED = 'Unassigned';

export interface TagDocumentItem {
  id: string;
  name: string;
}

export interface TaggedDocument extends TagDocumentItem {
  specialty: string;
  documentType: string;
}

interface TagDocumentsPageProps {
  documents: TagDocumentItem[];
  onConfirm?: (documents: TaggedDocument[]) => void;
}

const stripExtension = (name: string) => name.replace(/\.[^/.]+$/, '');

interface TagSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel: string;
}

const TagSelect = ({ value, options, onChange, ariaLabel }: TagSelectProps) => {
  const isUnassigned = value === UNASSIGNED;
  return (
    <div className="w-full max-w-[160px]">
      <Select
        fullWidth
        height="32px"
        aria-label={ariaLabel}
        value={value}
        options={[UNASSIGNED, ...options].map((option) => ({ value: option, label: option }))}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'text-[11px] font-medium',
          isUnassigned && '!border-[#D97706] !bg-[#FEF3E1] !text-[#D97706]',
        )}
      />
    </div>
  );
};

const TagDocumentsPage = ({ documents, onConfirm }: TagDocumentsPageProps) => {
  const specialtyValues = useMemo(
    () =>
      [...new Set(libraryDocuments.flatMap((doc) => doc.specialties))].filter(
        (value) => value !== UNASSIGNED,
      ),
    [],
  );
  const documentTypeValues = useMemo(
    () =>
      [...new Set(libraryDocuments.map((doc) => doc.documentType))].filter(
        (value) => value !== UNASSIGNED,
      ),
    [],
  );

  const [rows, setRows] = useState<TaggedDocument[]>(() =>
    documents.map((doc) => ({
      ...doc,
      specialty: UNASSIGNED,
      documentType: UNASSIGNED,
    })),
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkSpecialty, setBulkSpecialty] = useState('');
  const [bulkDocumentType, setBulkDocumentType] = useState('');

  const canApply = selectedIds.size > 0 && (bulkSpecialty !== '' || bulkDocumentType !== '');

  const updateRow = (id: string, changes: Partial<TaggedDocument>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...changes } : row)));
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(rows.map((row) => row.id)) : new Set());
  };

  const columns: TableColumn<TaggedDocument>[] = [
    {
      key: 'name',
      header: 'File Name',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-900">{stripExtension(row.name)}</span>
      ),
    },
    {
      key: 'specialty',
      header: 'Specialty',
      render: (row) => (
        <TagSelect
          ariaLabel={`Specialty for ${row.name}`}
          value={row.specialty}
          options={specialtyValues}
          onChange={(specialty) => updateRow(row.id, { specialty })}
        />
      ),
    },
    {
      key: 'documentType',
      header: 'Document Type',
      render: (row) => (
        <TagSelect
          ariaLabel={`Document type for ${row.name}`}
          value={row.documentType}
          options={documentTypeValues}
          onChange={(documentType) => updateRow(row.id, { documentType })}
        />
      ),
    },
  ];

  const handleApply = () => {
    setRows((prev) =>
      prev.map((row) =>
        selectedIds.has(row.id)
          ? {
              ...row,
              specialty: bulkSpecialty || row.specialty,
              documentType: bulkDocumentType || row.documentType,
            }
          : row,
      ),
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-sm">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">Tag Documents</h2>
          <p className="mt-0.5 text-[14px] text-[#64748B]">
            Confirm the specialty tags and document types for these documents.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-sm rounded-lg border border-[#E5E9EC] bg-background px-md py-3">
        <span className="shrink-0 text-[13px] font-[600] uppercase tracking-wide text-[#5A6065]">
          Bulk actions:
        </span>
        <div className="min-w-[12rem] flex-1">
          <Select
            fullWidth
            placeholder="Specialty (Multi-select)"
            options={specialtyValues.map((value) => ({ value, label: value }))}
            value={bulkSpecialty}
            onChange={(event) => setBulkSpecialty(event.target.value)}
          />
        </div>
        <div className="min-w-[12rem] flex-1">
          <Select
            fullWidth
            placeholder="Document Type"
            options={documentTypeValues.map((value) => ({ value, label: value }))}
            value={bulkDocumentType}
            onChange={(event) => setBulkDocumentType(event.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          size="md"
          disabled={!canApply}
          onClick={handleApply}
          className="shrink-0"
        >
          Apply
        </Button>
      </div>

      <h3 className="mt-5 text-[15px] font-[600] text-[#353839]">Documents ({rows.length})</h3>

      <Table
        className="mt-2 !overflow-visible [&>div]:!overflow-visible"
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        selectable
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        emptyMessage="No documents to tag."
      />

      <div className="mt-4 flex justify-end">
        <Button onClick={() => onConfirm?.(rows)}>Confirm &amp; Continue</Button>
      </div>
    </div>
  );
};

export default TagDocumentsPage;
