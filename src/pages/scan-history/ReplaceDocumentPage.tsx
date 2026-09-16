import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { AlertIcon, UploadIcon } from '@/components/ui/icons';
import Breadcrumb from '@/pages/scan-history/Breadcrumb';
import { getDocumentById, getScanHistoryForDocument } from '@/pages/scan-history/scanHistoryMockData';
import fileTextIcon from '@/assets/File_text.svg';

const bumpVersion = (version: string) => {
  const match = version.match(/^v(\d+)$/i);
  if (!match) return version;
  return `v${Number(match[1]) + 1}`;
};

const ReplaceDocumentPage = () => {
  const { scanId, documentId } = useParams<{ scanId: string; documentId: string }>();
  const navigate = useNavigate();

  const document = documentId ? getDocumentById(documentId) : undefined;
  if (!document || !scanId) {
    return <Navigate to="/scans" replace />;
  }

  const scanHistory = getScanHistoryForDocument(document.id);
  const lastScannedAt = scanHistory[0]?.dateTime ?? document.addedAt;
  const nextVersion = bumpVersion(document.version);

  const [title, setTitle] = useState(document.title);
  const [whatChanged, setWhatChanged] = useState('');

  const specialtyValue = document.specialties.join(', ');
  const documentTypeValue = document.documentType;

  const goBackToDocument = () => navigate(`/scans/${scanId}/documents/${document.id}`);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9]">
      <PageHeader
        title={
          <Breadcrumb
            items={[
              { label: 'Scan History', to: '/scans' },
              { label: `Run ${scanId}`, to: `/scans/${scanId}` },
              { label: document.title, to: `/scans/${scanId}/documents/${document.id}` },
            ]}
          />
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-md overflow-auto px-6 pb-6 pt-2">
        <div className="shrink-0">
          <h1 className="text-lg font-semibold text-slate-900">Replace Document</h1>
          <p className="mt-1 text-sm text-[#64748B]">Upload a revised version of {document.title}</p>
        </div>

        <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
          <div className="flex flex-col gap-md lg:col-span-2">
            <div className="flex flex-col items-center justify-center gap-sm rounded-lg border-2 border-dashed border-primary/40 bg-background px-lg py-xl text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary">
                <UploadIcon className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-slate-900">Drag and drop your revised document here</p>
              <p className="text-xs text-muted">or click to browse your local files (.docx, .pdf, .txt)</p>
            </div>

            <div className="flex flex-col gap-md rounded-lg border border-border bg-background p-4">
              <h2 className="text-sm font-semibold text-slate-900">Document Metadata</h2>

              <Input label="Document Title" value={title} onChange={(event) => setTitle(event.target.value)} />

              <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                <div className="flex flex-col gap-xs">
                  <label className="text-sm font-medium text-slate-900">Specialty</label>
                  <Select
                    fullWidth
                    value={specialtyValue}
                    options={[{ value: specialtyValue, label: specialtyValue }]}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-sm font-medium text-slate-900">Document Type</label>
                  <Select
                    fullWidth
                    value={documentTypeValue}
                    options={[{ value: documentTypeValue, label: documentTypeValue }]}
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label htmlFor="whatChanged" className="text-sm font-medium text-slate-900">
                  What changed in this version?
                </label>
                <textarea
                  id="whatChanged"
                  value={whatChanged}
                  onChange={(event) => setWhatChanged(event.target.value)}
                  placeholder="e.g., Updated ibuprofen age restriction per current pediatric dosing guidance."
                  rows={3}
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-sm">
              <Button variant="secondary" onClick={goBackToDocument}>
                Cancel
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-sm rounded-lg border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Currently Active Document</p>
              <div className="flex items-center gap-2">
                <img src={fileTextIcon} alt="" className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-900">{document.title}</span>
              </div>
              <div className="text-xs text-[#353839]">
                <p>
                  Version: <span className="font-medium">{document.version}</span>
                </p>
                <p>
                  Type: <span className="font-medium">{document.documentType}</span>
                </p>
                <p>
                  Last Scanned: <span className="font-medium">{lastScannedAt}</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
              <div className="text-xs text-[#92400E]">
                <p className="font-semibold">Replacement Warning</p>
                <p className="mt-0.5">
                  {document.version} will be replaced by {nextVersion}. The previous file will not be retained.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-end pb-2">
          <Button onClick={goBackToDocument}>Replace &amp; Update</Button>
        </div>
      </div>
    </div>
  );
};

export default ReplaceDocumentPage;
