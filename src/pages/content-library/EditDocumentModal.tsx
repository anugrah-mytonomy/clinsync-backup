import { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import MultiSelect from '@/components/ui/MultiSelect';
import Select, { type SelectOption } from '@/components/ui/Select';
import type { LibraryDocument } from '@/pages/content-library/types';
interface EditDocumentModalProps {
  document: LibraryDocument;
  specialtyOptions: SelectOption[];
  documentTypeOptions: SelectOption[];
  onClose: () => void;
  onUpdate: (id: string, changes: Pick<LibraryDocument, 'specialties' | 'documentType'>) => void;
}

const labelClassName = 'mb-1.5 block text-xs font-semibold text-[#0F172A]';

const EditDocumentModal = ({
  document,
  specialtyOptions,
  documentTypeOptions,
  onClose,
  onUpdate,
}: EditDocumentModalProps) => {
  const [specialties, setSpecialties] = useState<string[]>(document.specialties);
  const [documentType, setDocumentType] = useState(document.documentType);

  const isDirty =
    documentType !== document.documentType ||
    specialties.length !== document.specialties.length ||
    specialties.some((specialty) => !document.specialties.includes(specialty));
  const canUpdate = isDirty && specialties.length > 0 && documentType !== '';

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Edit Document"
      subtitle="Update the specialty and document type."
      width={740}
      bodyClassName="!overflow-visible"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} className="h-10 px-lg py-md">
            Cancel
          </Button>
          <Button
            disabled={!canUpdate}
            onClick={() => onUpdate(document.id, { specialties, documentType })}
            className="h-10 min-w-[85px] gap-1 px-lg py-md"
          >
            Update
          </Button>
        </>
      }
    >
      <div className="rounded-lg border border-[#E5E9EC] bg-white p-4">
        <h3 className="mb-4 text-sm font-semibold text-[#0F172A]">Document Metadata</h3>

        <div className="mb-4">
          <label htmlFor="edit-document-title" className={labelClassName}>
            Title
          </label>
          <input
            id="edit-document-title"
            type="text"
            value={document.title}
            readOnly
            disabled
            className="h-9 w-full cursor-not-allowed rounded-[6px] border border-[#E5E9EC] bg-[#F1F5F9] px-3 text-sm text-[#64748B] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="edit-document-specialty" className={labelClassName}>
              Specialty
            </label>
            <MultiSelect
              id="edit-document-specialty"
              fullWidth
              placeholder="Select specialty"
              options={specialtyOptions}
              value={specialties}
              onChange={setSpecialties}
            />
          </div>
          <div>
            <label htmlFor="edit-document-type" className={labelClassName}>
              Document Type
            </label>
            <Select
              id="edit-document-type"
              fullWidth
              placeholder="Select document type"
              options={documentTypeOptions}
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditDocumentModal;
