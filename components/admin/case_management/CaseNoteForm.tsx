import React, { useState } from 'react';
import { CaseNoteFormData } from '../../../types';
import LoadingSpinner from '../../LoadingSpinner';

interface CaseNoteFormProps {
  caseId: string;
  onSubmit: (formData: Pick<CaseNoteFormData, 'note' | 'visible_to_patient'>) => Promise<void>;
}

const CaseNoteForm: React.FC<CaseNoteFormProps> = ({ caseId, onSubmit }) => {
  const [note, setNote] = useState('');
  const [visibleToPatient, setVisibleToPatient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      // Optionally add a toast or inline error for empty note
      return;
    }
    setIsSaving(true);
    await onSubmit({ note, visible_to_patient: visibleToPatient }); // Corrected typo
    setNote('');
    setVisibleToPatient(false);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50 shadow-sm">
      <h4 className="text-md font-semibold text-neutral-700 mb-2">Add New Note</h4>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        placeholder="Type your note here..."
        required
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`visibleToPatient-${caseId}`}
            checked={visibleToPatient}
            onChange={(e) => setVisibleToPatient(e.target.checked)}
            className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
          />
          <label htmlFor={`visibleToPatient-${caseId}`} className="ml-2 text-sm text-neutral-dark">
            Visible to Patient
          </label>
        </div>
        <button
          type="submit"
          disabled={isSaving || !note.trim()}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-1.5 px-4 rounded-md text-sm transition-colors disabled:opacity-50 flex items-center"
        >
          {isSaving ? <LoadingSpinner size="sm" /> : 'Add Note'}
        </button>
      </div>
    </form>
  );
};

export default CaseNoteForm;