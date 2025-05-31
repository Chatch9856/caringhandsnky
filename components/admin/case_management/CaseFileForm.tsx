import React, { useState, ChangeEvent } from 'react';
import LoadingSpinner from '../../LoadingSpinner';
import { ALLOWED_CASE_FILE_TYPES, MAX_CASE_FILE_SIZE_MB } from '../../../constants';
import { useToast } from '../../ToastContext';

interface CaseFileFormProps {
  caseId: string;
  onUpload: (file: File, visibleToPatient: boolean) => Promise<void>;
}

const CaseFileForm: React.FC<CaseFileFormProps> = ({ caseId, onUpload }) => {
  const { addToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [visibleToPatient, setVisibleToPatient] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);
    if (selectedFile) {
      if (!ALLOWED_CASE_FILE_TYPES.includes(selectedFile.type)) {
        setFileError(`Invalid file type. Allowed: ${ALLOWED_CASE_FILE_TYPES.map(t => t.split('/')[1]).join(', ')}.`);
        setFile(null);
        e.target.value = ''; // Reset file input
        return;
      }
      if (selectedFile.size > MAX_CASE_FILE_SIZE_MB * 1024 * 1024) {
        setFileError(`File size exceeds ${MAX_CASE_FILE_SIZE_MB}MB.`);
        setFile(null);
        e.target.value = ''; // Reset file input
        return;
      }
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      addToast('Please select a file to upload.', 'error');
      return;
    }
    if (fileError) {
      addToast(fileError, 'error');
      return;
    }
    setIsUploading(true);
    await onUpload(file, visibleToPatient);
    setFile(null);
    setVisibleToPatient(false);
    // Clear the file input visually. The input is uncontrolled for file type.
    // This can be done by resetting the form or the input's value if a ref is used.
    // For simplicity, user needs to re-select if they want to upload another one immediately.
    const fileInput = document.getElementById(`file-upload-${caseId}`) as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    setIsUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50 shadow-sm">
      <h4 className="text-md font-semibold text-neutral-700 mb-2">Upload New File</h4>
      <div className="mb-3">
        <label htmlFor={`file-upload-${caseId}`} className="block text-sm font-medium text-neutral-dark">Choose file</label>
        <input
          type="file"
          id={`file-upload-${caseId}`}
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-primary/30"
          aria-describedby={`file-error-${caseId}`}
        />
        {fileError && <p id={`file-error-${caseId}`} className="text-xs text-red-600 mt-1">{fileError}</p>}
        {!fileError && file && <p className="text-xs text-slate-500 mt-1">Selected: {file.name}</p>}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`fileVisibleToPatient-${caseId}`}
            checked={visibleToPatient}
            onChange={(e) => setVisibleToPatient(e.target.checked)}
            className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
          />
          <label htmlFor={`fileVisibleToPatient-${caseId}`} className="ml-2 text-sm text-neutral-dark">
            Visible to Patient
          </label>
        </div>
        <button
          type="submit"
          disabled={isUploading || !file || !!fileError}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-1.5 px-4 rounded-md text-sm transition-colors disabled:opacity-50 flex items-center"
        >
          {isUploading ? <LoadingSpinner size="sm" /> : 'Upload File'}
        </button>
      </div>
    </form>
  );
};

export default CaseFileForm;
