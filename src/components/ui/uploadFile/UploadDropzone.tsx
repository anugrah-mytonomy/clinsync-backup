import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { cn } from '@/utils/cn';
import uploadIcon from '@/assets/Upload.svg';

interface UploadDropzoneProps {
  onFilesSelected: (files: FileList) => void;
  accept: string;
  formatsLabel: string;
  formats: string[];
}

const UploadDropzone = ({ onFilesSelected, accept, formatsLabel, formats }: UploadDropzoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files.length) onFilesSelected(event.dataTransfer.files);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) onFilesSelected(event.target.files);
    event.target.value = '';
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-sm rounded-lg border-2 border-dashed px-lg py-xl text-center transition-colors',
        isDragActive ? 'border-primary bg-background' : 'border-primary/40 bg-background',
      )}
    >
      <span className="flex items-center justify-center">
        <img src={uploadIcon} alt="" className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="mt-2 flex flex-col gap-2">
        <p className="text-sm text-slate-900">
          <span className="font-bold text-sm text-[#0F172A]">Drag files here or browse your system</span>
        </p>
        <p className="text-xs text-[#94A3B8] font-normal">{formatsLabel}</p>
        <div className="mt-1 flex items-center justify-center gap-2">
          {formats.map((format) => (
            <span
              key={format}
              className="rounded-[6px] border border-[#35383914] bg-white px-2 py-1 text-xs font-medium text-[#0F172A]"
            >
              {format}
            </span>
          ))}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default UploadDropzone;
