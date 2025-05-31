import React, { useState, useEffect, useCallback } from 'react';
import { Case, CaseNote, CaseFile, Patient, Caregiver, CaseStatus, UserType, CaseNoteFormData } from '../../../types';
import { supabase } from '../../../supabaseClient';
import { useToast } from '../../ToastContext';
import LoadingSpinner from '../../LoadingSpinner';
import { getCaseNotes, addCaseNote, getCaseFiles, uploadCaseFile, deleteCaseFile, updateCase } from '../../../services/caseManagementService';
import { ADMIN_USER_ID, ADMIN_DISPLAY_NAME, ArrowUturnLeftIcon, PaperclipIcon, PlusCircleIcon, UserCircleIcon, SendIcon } from '../../../constants';
import CaseNoteForm from './CaseNoteForm';
import CaseFileForm from './CaseFileForm';


interface CaseDetailViewProps {
  caseItem: Case;
  onClose: () => void;
  patients: Patient[]; // For patient name lookup if needed, though caseItem should have it
  caregivers: Caregiver[]; // For assigning staff
}

const CaseDetailView: React.FC<CaseDetailViewProps> = ({ caseItem, onClose, patients, caregivers }) => {
  const { addToast } = useToast();
  const [currentCase, setCurrentCase] = useState<Case>(caseItem);
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [isUpdatingCase, setIsUpdatingCase] = useState(false);
  
  const [editableStatus, setEditableStatus] = useState<CaseStatus | string>(currentCase.status);
  const [editableAssignedStaffId, setEditableAssignedStaffId] = useState<string | undefined>(currentCase.assigned_staff_id || undefined);


  const adminUser = { id: ADMIN_USER_ID, type: UserType.ADMIN, name: ADMIN_DISPLAY_NAME };

  const fetchDetails = useCallback(async () => {
    if (!supabase) return;
    setIsLoadingDetails(true);
    try {
      const [caseNotes, caseFiles] = await Promise.all([
        getCaseNotes(currentCase.id),
        getCaseFiles(currentCase.id)
      ]);
      setNotes(caseNotes);
      setFiles(caseFiles);
    } catch (err: any) {
      addToast(`Error loading case details: ${err.message}`, 'error');
    } finally {
      setIsLoadingDetails(false);
    }
  }, [currentCase.id, addToast]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);
  
  useEffect(() => { // Keep editable fields in sync if caseItem prop changes (e.g. parent list re-fetch)
    setCurrentCase(caseItem);
    setEditableStatus(caseItem.status);
    setEditableAssignedStaffId(caseItem.assigned_staff_id || undefined);
  }, [caseItem]);


  const handleAddNote = async (noteData: Pick<CaseNoteFormData, 'note' | 'visible_to_patient'>) => {
    if(!supabase) return;
    try {
      const newNote = await addCaseNote(
        { ...noteData, case_id: currentCase.id },
        adminUser.id,
        adminUser.type,
        adminUser.name
      );
      setNotes(prev => [...prev, newNote]);
      addToast('Note added successfully!', 'success');
    } catch (err: any) {
      addToast(`Error adding note: ${err.message}`, 'error');
    }
  };

  const handleFileUpload = async (file: File, visibleToPatient: boolean) => {
     if(!supabase) return;
    try {
      const newFile = await uploadCaseFile(
        currentCase.id,
        file,
        adminUser.id,
        adminUser.type,
        adminUser.name,
        visibleToPatient
      );
      setFiles(prev => [...prev, newFile]);
      addToast('File uploaded successfully!', 'success');
    } catch (err: any) {
      addToast(`Error uploading file: ${err.message}`, 'error');
    }
  };
  
  const handleDeleteFile = async (fileId: string, filePath: string) => {
    if(!supabase) return;
    if (window.confirm("Are you sure you want to delete this file?")) {
        try {
            await deleteCaseFile(fileId, filePath);
            setFiles(prev => prev.filter(f => f.id !== fileId));
            addToast('File deleted successfully.', 'success');
        } catch (err: any) {
            addToast(`Error deleting file: ${err.message}`, 'error');
        }
    }
  };

  const handleUpdateCaseDetails = async () => {
    if(!supabase) return;
    setIsUpdatingCase(true);
    try {
        const updatePayload: Partial<Case> = {
            status: editableStatus as CaseStatus,
            assigned_staff_id: editableAssignedStaffId || null, // Ensure it's null if empty string
        };
        const updated = await updateCase(currentCase.id, updatePayload);
        setCurrentCase(updated); // Update local state with the response
        addToast("Case details updated successfully!", "success");
    } catch (err: any) {
        addToast(`Error updating case: ${err.message}`, "error");
    } finally {
        setIsUpdatingCase(false);
    }
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
    <div className="p-6 bg-slate-50 min-h-full">
      <button onClick={onClose} className="mb-6 text-sm text-primary hover:underline flex items-center">
        <ArrowUturnLeftIcon className="w-4 h-4 mr-1" /> Back to Case List
      </button>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-primary-dark mb-1">{currentCase.title}</h2>
        <p className="text-sm text-neutral-500 mb-4">Case ID: {currentCase.id}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <h4 className="font-semibold text-neutral-700">Patient:</h4>
                <p className="text-neutral-600">{currentCase.patient_name || 'N/A'}</p>
            </div>
            <div>
                <h4 className="font-semibold text-neutral-700">Created:</h4>
                <p className="text-neutral-600">{new Date(currentCase.created_at).toLocaleString()}</p>
            </div>
             <div>
                <label htmlFor="caseStatus" className="block text-sm font-medium text-neutral-700">Status:</label>
                 <select 
                    id="caseStatus" 
                    value={editableStatus} 
                    onChange={(e) => setEditableStatus(e.target.value as CaseStatus)}
                    className={`mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm ${getStatusColor(editableStatus).replace('bg-', 'border-').replace('text-', 'focus:border-')}`}
                 >
                    {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
            </div>
            <div>
                <label htmlFor="assignedStaff" className="block text-sm font-medium text-neutral-700">Assigned Staff:</label>
                 <select 
                    id="assignedStaff" 
                    value={editableAssignedStaffId || ''} 
                    onChange={(e) => setEditableAssignedStaffId(e.target.value || undefined)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm bg-white"
                 >
                    <option value="">None</option>
                    {caregivers.map(cg => <option key={cg.id} value={cg.id}>{cg.full_name}</option>)}
                 </select>
            </div>
        </div>
         <div className="mb-6">
            <h4 className="font-semibold text-neutral-700">Description:</h4>
            <p className="text-neutral-600 whitespace-pre-wrap">{currentCase.description}</p>
        </div>
        {currentCase.tags && currentCase.tags.length > 0 && (
            <div className="mb-6">
                <h4 className="font-semibold text-neutral-700">Tags:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {currentCase.tags.map(tag => <span key={tag} className="px-2 py-0.5 text-xs bg-secondary-light text-secondary-dark rounded-full">{tag}</span>)}
                </div>
            </div>
        )}
        <button onClick={handleUpdateCaseDetails} disabled={isUpdatingCase} className="w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center">
            {isUpdatingCase ? <LoadingSpinner size="sm"/> : "Save Case Changes"}
        </button>

        {/* Notes Section */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-xl font-semibold text-primary-dark mb-4">Case Journal & Notes</h3>
          {isLoadingDetails ? <LoadingSpinner text="Loading notes..." /> : (
            notes.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {notes.map(note => (
                  <div key={note.id} className={`p-3 rounded-lg ${note.author_type === UserType.ADMIN ? 'bg-primary-light/30' : 'bg-slate-100'}`}>
                    <p className="text-xs text-neutral-500 mb-1">
                      <UserCircleIcon className="w-4 h-4 inline mr-1"/> 
                      <strong>{note.author_name || note.author_type || 'System'}</strong> on {new Date(note.created_at).toLocaleString()}
                      {note.visible_to_patient && <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-200 text-green-800 rounded-full">Visible to Patient</span>}
                    </p>
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap">{note.note}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-neutral-500">No notes added to this case yet.</p>
          )}
          <CaseNoteForm caseId={currentCase.id} onSubmit={handleAddNote} />
        </div>

        {/* Files Section */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-xl font-semibold text-primary-dark mb-4">Attached Files</h3>
           {isLoadingDetails ? <LoadingSpinner text="Loading files..." /> : (
            files.length > 0 ? (
              <ul className="space-y-2">
                {files.map(file => (
                  <li key={file.id} className="flex justify-between items-center p-3 bg-slate-100 rounded-md hover:bg-slate-200/70 transition-colors">
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center text-sm">
                      <PaperclipIcon className="w-4 h-4 mr-2"/> {file.file_name}
                    </a>
                    <div className="text-xs">
                        {file.visible_to_patient && <span className="mr-2 px-1.5 py-0.5 text-xs bg-green-200 text-green-800 rounded-full">Patient Visible</span>}
                        ({(file.file_size || 0 / 1024).toFixed(1)} KB) - Uploaded by {file.uploader_name || file.uploader_type}
                        <button onClick={() => handleDeleteFile(file.id, file.file_path)} className="ml-3 text-red-500 hover:text-red-700" title="Delete file">&times;</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="text-neutral-500">No files attached to this case.</p>
          )}
          <CaseFileForm caseId={currentCase.id} onUpload={handleFileUpload} />
        </div>
      </div>
    </div>
  );
};

export default CaseDetailView;
