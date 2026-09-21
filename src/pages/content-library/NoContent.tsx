import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import { PlusIcon } from '@/components/ui/icons';
import uploadIcon from '@/assets/Upload.svg';

interface NoContentProps {
  onAddContent: () => void;
}

const NoContent = ({ onAddContent }: NoContentProps) => {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F1F5F9]">
      <PageHeader
        title="Content Library"
        subtitle="Add content to the ClinSync content library for health checking."
        actions={
          <Button onClick={onAddContent}>
            <PlusIcon className="h-4 w-4" />
            Add Content
          </Button>
        }
      />

      <div className="flex flex-1 flex-col px-6 pt-4 pb-6">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-background">
          <div className="flex flex-col items-center gap-sm text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D9ECF2] text-muted">
              <img src={uploadIcon} alt="" className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-base font-bold text-slate-900">No content added yet</p>
            <p className="text-xs font-normal text-muted">
              Upload your first documents to get started with content governance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoContent;
