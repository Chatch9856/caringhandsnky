import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import LoadingSpinner from '../LoadingSpinner';
import { Case, CaseNote, CaseFile, Patient, UserType, CaseStatus, MessageUser } from '../../types'; // Added MessageUser
import { getCases, getCaseNotes, getCaseFiles, addCaseNote } from '../../services/caseManagementService';
import { supabase } from '../../supabaseClient';
import { BriefcaseIcon, ArrowUturnLeftIcon, PaperclipIcon, UserCircleIcon, SendIcon } from '../../constants';


interface PatientCaseDetailViewProps {
  caseItem: Case;
  notes: CaseNote[];
  files: CaseFile[];
  onClose: () => void;
  onAddNote: (noteText: string) => Promise<void>; // Simplified for patient
  isLoadingDetails: boolean;
}

const PatientCaseDetailView: React.FC<PatientCaseDetailViewProps> = ({ caseItem, notes, files, onClose, onAddNote, isLoadingDetails }) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newNoteText.trim()) return;
    setIsSubmittingNote(true);
    await onAddNote(newNoteText);
    setNewNoteText('');
    setIsSubmittingNote(false);
  };

  const getStatusColor = (status: CaseStatus | string) => {
    switch (status) {
        case CaseStatus.OPEN: return 'text-blue-700 bg-blue-100';
        case CaseStatus.ACTIVE: return 'text-yellow-700 bg-yellow-100';
        case CaseStatus.PENDING_PATIENT:
        case CaseStatus.PENDING_STAFF: return 'text-orange-700 bg-orange-100';
        case CaseStatus.RESOLVED: return 'text-green-700 bg-green-100';
        case CaseStatus.CLOSED: return 'text-slate-700 bg-slate-100';
        default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="p-1 md:p-4">
      <button onClick={onClose} className="mb-4 text-sm text-primary hover:underline flex items-center">
        <ArrowUturnLeftIcon className="w-4 h-4 mr-1" /> Back to My Cases
      </button>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold text-primary-dark mb-1">{caseItem.title}</h2>
        <p className="text-xs text-neutral-500 mb-3">Case ID: {caseItem.id}</p>
        <p className="mb-3"><span className="font-semibold">Status:</span> <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>{caseItem.status}</span></p>
        <p className="mb-3 text-sm"><span className="font-semibold">Description:</span> {caseItem.description}</p>
        {caseItem.assigned_staff_name && <p className="text-sm mb-3"><span className="font-semibold">Assigned To:</span> {caseItem.assigned_staff_name}</p>}
        <p className="text-sm text-neutral-500 mb-4">Opened: {new Date(caseItem.created_at).toLocaleDateString()}</p>

        {/* Notes */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="text-md font-semibold text-primary-dark mb-2">Case Notes</h4>
          {isLoadingDetails ? <LoadingSpinner size="sm" text="Loading notes..."/> : (
            notes.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-3">
                {notes.filter(note => note.visible_to_patient).map(note => ( // Filter for patient-visible notes
                  <div key={note.id} className={`p-2.5 rounded-lg text-sm ${note.author_type === UserType.PATIENT ? 'bg-accent-light/30 ml-auto max-w-[85%]' : 'bg-slate-100 max-w-[85%]'}`}>
                     <p className="text-xs text-neutral-500 mb-0.5">
                      <UserCircleIcon className="w-3.5 h-3.5 inline mr-1"/> 
                      <strong>{note.author_name || note.author_type || 'System'}</strong> - {new Date(note.created_at).toLocaleString()}
                    </p>
                    <p className="text-neutral-700 whitespace-pre-wrap">{note.note}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-neutral-500 mb-2">No notes visible to you for this case yet.</p>
          )}
          <form onSubmit={handleNoteSubmit} className="mt-2 flex items-start gap-2">
            <textarea 
                value={newNoteText} 
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add a comment or update..."
                rows={2}
                className="flex-grow p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-primary focus:border-primary"
            />
            <button type="submit" disabled={isSubmittingNote || !newNoteText.trim()} className="bg-accent hover:bg-accent-dark text-white font-semibold p-2 rounded-md text-sm disabled:opacity-50">
                {isSubmittingNote ? <LoadingSpinner size="sm"/> : <SendIcon className="w-5 h-5"/>}
            </button>
          </form>
        </div>

        {/* Files */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="text-md font-semibold text-primary-dark mb-2">Attached Files</h4>
          {isLoadingDetails ? <LoadingSpinner size="sm" text="Loading files..."/> : (
            files.filter(file => file.visible_to_patient).length > 0 ? ( // Filter for patient-visible files
              <ul className="space-y-1.5">
                {files.filter(file => file.visible_to_patient).map(file => (
                  <li key={file.id}>
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm flex items-center">
                      <PaperclipIcon className="w-3.5 h-3.5 mr-1.5"/> {file.file_name} ({(file.file_size || 0 / 1024).toFixed(1)} KB)
                    </a>
                  </li>
                ))}
              </ul>
            ) : <p className="text-xs text-neutral-500">No files visible to you for this case.</p>
          )}
        </div>
      </div>
    </div>
  );
};


const PatientCasesPanel: React.FC<{currentUser: Patient}> = ({ currentUser }) => {
  const { addToast } = useToast();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  const patientUser: MessageUser = { id: currentUser.id, name: currentUser.full_name, type: UserType.PATIENT };


  const fetchMyCases = useCallback(async () => {
    if (!supabase) {
      setError("Case system is currently unavailable.");
      addToast("Case system unavailable.", "error");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCases({ patientId: currentUser.id });
      setCases(data);
    } catch (err: any) {
      setError(`Failed to load your cases: ${err.message}`);
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.id, addToast]);

  useEffect(() => {
    fetchMyCases();
  }, [fetchMyCases]);

  const handleSelectCase = async (caseItem: Case) => {
    setSelectedCase(caseItem);
    if (!supabase) {
      addToast("Cannot load case details: system unavailable.", "error");
      return;
    }
    setIsLoadingDetails(true);
    try {
      const [notesData, filesData] = await Promise.all([
        getCaseNotes(caseItem.id),
        getCaseFiles(caseItem.id)
      ]);
      setCaseNotes(notesData.filter(n => n.visible_to_patient || n.author_id === patientUser.id));
      setCaseFiles(filesData.filter(f => f.visible_to_patient));
    } catch (err: any) {
      addToast(`Error loading details for case ${caseItem.title}: ${err.message}`, 'error');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleAddNoteToCase = async (noteText: string) => {
    if (!selectedCase || !supabase) return;
    try {
      const newNote = await addCaseNote(
        { case_id: selectedCase.id, note: noteText, visible_to_patient: false }, // Patient notes are not marked visible_to_patient by themselves, admin can change
        patientUser.id,
        patientUser.type,
        patientUser.name
      );
      setCaseNotes(prev => [...prev, newNote]);
      addToast("Your note has been added.", "success");
    } catch (err: any) {
      addToast(`Failed to add note: ${err.message}`, "error");
    }
  };

  const getStatusColor = (status: CaseStatus | string) => {
    switch (status) {
        case CaseStatus.OPEN: return 'bg-blue-100 text-blue-700';
        case CaseStatus.ACTIVE: return 'bg-yellow-100 text-yellow-700';
        case CaseStatus.PENDING_PATIENT:
        case CaseStatus.PENDING_STAFF: return 'bg-orange-100 text-orange-700';
        case CaseStatus.RESOLVED: return 'bg-green-100 text-green-700';
        case CaseStatus.CLOSED: return 'bg-slate-100 text-slate-700';
        default: return 'bg-gray-100 text-gray-500';
    }
  };

  if (isLoading && !error && !selectedCase) {
    return <LoadingSpinner text="Loading your cases..." />;
  }

  if (error && !selectedCase) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  if (selectedCase) {
    return (
      <PatientCaseDetailView 
        caseItem={selectedCase}
        notes={caseNotes}
        files={caseFiles}
        onClose={() => setSelectedCase(null)}
        onAddNote={handleAddNoteToCase}
        isLoadingDetails={isLoadingDetails}
      />
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-primary-dark mb-4">My Support Cases</h3>
      {cases.length > 0 ? (
        <div className="space-y-3">
          {cases.map(caseItem => (
            <button 
              key={caseItem.id} 
              onClick={() => handleSelectCase(caseItem)}
              className="w-full text-left p-3 md:p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-primary group-hover:text-primary-dark">{caseItem.title}</h4>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>{caseItem.status}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">Opened: {new Date(caseItem.created_at).toLocaleDateString()} | Last Update: {new Date(caseItem.updated_at).toLocaleDateString()}</p>
              {caseItem.assigned_staff_name && <p className="text-xs text-neutral-500 mt-0.5">Assigned: {caseItem.assigned_staff_name}</p>}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-neutral-500">
          <BriefcaseIcon className="w-12 h-12 mx-auto text-slate-300 mb-2"/>
          <p>You have no support cases at the moment.</p>
          {/* Optionally, add a button to create a new case from here if UI/UX allows */}
        </div>
      )}
    </div>
  );
};

export default PatientCasesPanel;