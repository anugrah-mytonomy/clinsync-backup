import { useState } from 'react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

const specialtyOptions = [
  'Oncology',
  'General Surgery',
  'Gastroenterology',
  'Emergency Medicine',
  'Ophthalmology',
  'Pediatrics',
  'Urology',
  'Pulmonology',
].map((value) => ({ value, label: value }));

const documentTypeOptions = [
  'Procedural Guide',
  'Medication Information',
  'Discharge Instructions',
  'Condition Overview / Disease Management',
].map((value) => ({ value, label: value }));

const DashboardFilters = () => {
  const [specialty, setSpecialty] = useState('');
  const [documentType, setDocumentType] = useState('');
  const hasFilters = Boolean(specialty || documentType);

  const clearFilters = () => {
    setSpecialty('');
    setDocumentType('');
  };

  return (
    <div className="flex flex-wrap items-center gap-sm rounded-lg border border-border bg-background px-md py-3">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-[#5A6065]">
        Filter by:
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
      <Button
        variant="secondary"
        size="md"
        disabled={!hasFilters}
        onClick={clearFilters}
        className="shrink-0"
      >
        Clear
      </Button>
      <Button variant="secondary" size="md" disabled={!hasFilters} className="shrink-0">
        Apply
      </Button>
    </div>
  );
};

export default DashboardFilters;
