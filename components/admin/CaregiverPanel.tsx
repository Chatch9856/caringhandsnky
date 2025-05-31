
import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { 
    Caregiver, CaregiverFormData, CaregiverShift, CaregiverShiftFormData, ShiftStatus,
    CaregiverDocument, CaregiverDocumentFormData, DocumentType
} from '../../types';
import { useToast } from '../ToastContext';
import TabButton from '../TabButton';
import LoadingSpinner from '../LoadingSpinner';
import CaregiverListTable from '../CaregiverListTable';
import CaregiverFormModal from '../CaregiverFormModal';
import { getCaregivers, addCaregiver, updateCaregiver, deleteCaregiver } from '../../services/caregiverService';
import { getCaregiverShifts, addCaregiverShift } from '../../services/caregiverShiftService';
import { getCaregiverDocuments, addCaregiverDocument, deleteCaregiverDocument } from '../../services/caregiverDocumentService';
import {
  CAREGIVER_SUB_TAB_LIST, CAREGIVER_SUB_TAB_SHIFTS, CAREGIVER_SUB_TAB_DOCUMENTS,
  CAREGIVER_SUB_TAB_INCIDENTS, CAREGIVER_SUB_TAB_NOTIFICATIONS,
  ListBulletIcon, ClockSolidIcon, DocumentDuplicateIcon, ExclamationTriangleIcon, BellIcon,
  PlusCircleIcon, RefreshIconSolid, DeleteIcon as TrashIcon, CloudArrowUpIcon,
  ALLOWED_DOCUMENT_TYPES, MAX_DOCUMENT_SIZE_MB, CAREGIVER_DOCUMENT_TYPE_OPTIONS
} from '../../constants';
import { supabase } from '../../supabaseClient'; // Import supabase

type CaregiverSubTab = 
  typeof CAREGIVER_SUB_TAB_LIST | 
  typeof CAREGIVER_SUB_TAB_SHIFTS | 
  typeof CAREGIVER_SUB_TAB_DOCUMENTS | 
  typeof CAREGIVER_SUB_TAB_INCIDENTS | 
  typeof CAREGIVER_SUB_TAB_NOTIFICATIONS;

const inputBaseClass = "mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
const labelBaseClass = "block text-sm font-medium text-neutral-dark";
const buttonBaseClass = "font-semibold py-2 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center disabled:opacity-60";


const CaregiverPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<CaregiverSubTab>(CAREGIVER_SUB_TAB_LIST);
  const { addToast } = useToast();

  // Caregiver List State
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [isLoadingCaregivers, setIsLoadingCaregivers] = useState(false);
  const [caregiversError, setCaregiversError] = useState<string | null>(null);
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);
  const [editingCaregiver, setEditingCaregiver] = useState<CaregiverFormData | null>(null);
  const [isSavingCaregiver, setIsSavingCaregiver] = useState(false);

  // Shifts State
  const [shifts, setShifts] = useState<CaregiverShift[]>([]);
  const [isLoadingShifts, setIsLoadingShifts] = useState(false);
  const [showAddShiftForm, setShowAddShiftForm] = useState(false);
  const [newShiftData, setNewShiftData] = useState<CaregiverShiftFormData>({
    caregiver_id: '', patient_id: null, patient_identifier_notes: '',
    shift_date: new Date().toISOString().split('T')[0], start_time: '', end_time: '',
    location: '', notes: '',
  });
  const [isSavingShift, setIsSavingShift] = useState(false);

  // Documents State
  const [documents, setDocuments] = useState<CaregiverDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [showAddDocForm, setShowAddDocForm] = useState(false);
  const [newDocFormData, setNewDocFormData] = useState<CaregiverDocumentFormData>({
    caregiver_id: '', doc_type: DocumentType.OTHER, expires_on: '', file: null,
  });
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [docFilePreview, setDocFilePreview] = useState<string | null>(null);


  // --- Data Fetching Callbacks ---
  const fetchCaregivers = useCallback(async () => {
    setIsLoadingCaregivers(true);
    setCaregiversError(null);
    try {
      const data = await getCaregivers();
      setCaregivers(data);
    } catch (err: any) {
      setCaregiversError(`Failed to load caregivers: ${err.message}`);
      addToast(`Failed to load caregivers: ${err.message}`, "error");
    } finally {
      setIsLoadingCaregivers(false);
    }
  }, [addToast]);

  const fetchShifts = useCallback(async () => {
    setIsLoadingShifts(true);
    try {
      const data = await getCaregiverShifts();
      setShifts(data);
    } catch (error: any) {
      addToast(`Error fetching shifts: ${error.message}`, 'error');
    } finally {
      setIsLoadingShifts(false);
    }
  }, [addToast]);

  const fetchDocuments = useCallback(async () => {
    setIsLoadingDocuments(true);
    try {
      const data = await getCaregiverDocuments();
      setDocuments(data);
    } catch (error: any) {
      addToast(`Error fetching documents: ${error.message}`, 'error');
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [addToast]);

  // Initial caregiver fetch and tab-specific fetching
  useEffect(() => {
    fetchCaregivers();
  }, [fetchCaregivers]);

  useEffect(() => {
    if (activeSubTab === CAREGIVER_SUB_TAB_SHIFTS) {
      fetchShifts();
    } else if (activeSubTab === CAREGIVER_SUB_TAB_DOCUMENTS) {
      fetchDocuments();
    }
  }, [activeSubTab, fetchShifts, fetchDocuments]);

  // --- Caregiver List Handlers ---
  const handleOpenAddCaregiverModal = () => { setEditingCaregiver(null); setIsCaregiverModalOpen(true); };
  const handleOpenEditCaregiverModal = (cg: Caregiver) => { setEditingCaregiver(cg); setIsCaregiverModalOpen(true); };
  const handleCloseCaregiverModal = () => { setIsCaregiverModalOpen(false); setEditingCaregiver(null); };
  
  const handleCaregiverFormSubmit = async (data: CaregiverFormData, file?: File | null) => {
    if (!supabase) {
      addToast("Cannot save caregiver: Database connection is not configured. Please contact support.", "error");
      setIsSavingCaregiver(false);
      return;
    }
    setIsSavingCaregiver(true);
    try {
      if (editingCaregiver?.id) {
        await updateCaregiver(editingCaregiver.id, data, file);
        addToast('Caregiver updated successfully!', 'success');
      } else {
        await addCaregiver(data, file === null ? undefined : file);
        addToast('Caregiver added successfully!', 'success');
      }
      setIsCaregiverModalOpen(false);
      fetchCaregivers();
    } catch (err: any) { addToast(`Failed to save caregiver: ${err.message}`, 'error');
    } finally { setIsSavingCaregiver(false); }
  };

  const handleDeleteCaregiver = async (id: string) => {
    if (!supabase) {
      addToast("Cannot delete caregiver: Database connection is not configured. Please contact support.", "error");
      return;
    }
    if (window.confirm("Are you sure you want to delete this caregiver? This also deletes related shifts and documents if not handled by DB constraints.")) {
      try {
        await deleteCaregiver(id);
        addToast('Caregiver deleted successfully!', 'success');
        fetchCaregivers();
      } catch (err: any) { addToast(`Failed to delete caregiver: ${err.message}`, 'error'); }
    }
  };

  // --- Shifts Handlers ---
  const handleShiftInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewShiftData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddShiftSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      addToast("Cannot add shift: Database connection is not configured. Please contact support.", "error");
      setIsSavingShift(false);
      return;
    }
    if (!newShiftData.caregiver_id || !newShiftData.shift_date || !newShiftData.start_time || !newShiftData.end_time || !newShiftData.patient_identifier_notes?.trim()) {
      addToast('Fill caregiver, patient, date, & times.', 'error'); return;
    }
    setIsSavingShift(true);
    try {
      await addCaregiverShift(newShiftData);
      addToast('New shift added!', 'success');
      setShowAddShiftForm(false);
      setNewShiftData({ caregiver_id: '', patient_id: null, patient_identifier_notes: '', shift_date: new Date().toISOString().split('T')[0], start_time: '', end_time: '', location: '', notes: '' });
      fetchShifts();
    } catch (err: any) { addToast(`Error adding shift: ${err.message}`, 'error');
    } finally { setIsSavingShift(false); }
  };

  // --- Documents Handlers ---
  const handleDocInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDocFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDocFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
        if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
            addToast(`Invalid file type. Allowed: ${ALLOWED_DOCUMENT_TYPES.map(t=>t.split('/')[1]).join(', ')}`, "error");
            setNewDocFormData(prev => ({ ...prev, file: null }));
            setDocFilePreview(null);
            e.target.value = ''; // Reset file input
            return;
        }
        if (file.size > MAX_DOCUMENT_SIZE_MB * 1024 * 1024) {
            addToast(`File size exceeds ${MAX_DOCUMENT_SIZE_MB}MB.`, "error");
            setNewDocFormData(prev => ({ ...prev, file: null }));
            setDocFilePreview(null);
            e.target.value = ''; // Reset file input
            return;
        }
        setNewDocFormData(prev => ({ ...prev, file }));
        setDocFilePreview(file.name); // Show file name as preview
    } else {
        setNewDocFormData(prev => ({ ...prev, file: null }));
        setDocFilePreview(null);
    }
  };

  const handleAddDocumentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      addToast("Cannot upload document: Database connection is not configured. Please contact support.", "error");
      setIsUploadingDocument(false);
      return;
    }
    if (!newDocFormData.caregiver_id || !newDocFormData.doc_type || !newDocFormData.file) {
      addToast('Please select caregiver, document type, and a file.', 'error'); return;
    }
    setIsUploadingDocument(true);
    try {
      const { caregiver_id, doc_type, expires_on } = newDocFormData;
      await addCaregiverDocument({ caregiver_id, doc_type, expires_on }, newDocFormData.file);
      addToast('Document uploaded successfully!', 'success');
      setShowAddDocForm(false);
      setNewDocFormData({ caregiver_id: '', doc_type: DocumentType.OTHER, expires_on: '', file: null });
      setDocFilePreview(null);
      fetchDocuments();
    } catch (err: any) { addToast(`Error uploading document: ${err.message}`, 'error');
    } finally { setIsUploadingDocument(false); }
  };

  const handleDeleteDocument = async (docId: string, docUrl: string) => {
    if (!supabase) {
      addToast("Cannot delete document: Database connection is not configured. Please contact support.", "error");
      return;
    }
     if (window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
        try {
            await deleteCaregiverDocument(docId, docUrl);
            addToast('Document deleted successfully!', 'success');
            fetchDocuments();
        } catch (err: any) {
            addToast(`Error deleting document: ${err.message}`, 'error');
        }
     }
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-primary-dark mb-1">Manage Caregivers & Operations</h2>
        <p className="text-sm text-neutral-DEFAULT mb-4">
          Oversee caregiver profiles, schedules, documents, and other operational aspects.
        </p>
      </div>

      <div className="mb-0 border-b border-slate-200 px-2 md:px-4">
        <div className="flex space-x-1 -mb-px overflow-x-auto pb-0">
          {[
            { label: "Caregiver List", id: CAREGIVER_SUB_TAB_LIST, icon: <ListBulletIcon className="w-5 h-5" /> },
            { label: "Manage Shifts", id: CAREGIVER_SUB_TAB_SHIFTS, icon: <ClockSolidIcon className="w-5 h-5" /> },
            { label: "Documents", id: CAREGIVER_SUB_TAB_DOCUMENTS, icon: <DocumentDuplicateIcon className="w-5 h-5" /> },
            { label: "Incidents", id: CAREGIVER_SUB_TAB_INCIDENTS, icon: <ExclamationTriangleIcon className="w-5 h-5" />, disabled: true },
            { label: "Notifications", id: CAREGIVER_SUB_TAB_NOTIFICATIONS, icon: <BellIcon className="w-5 h-5" />, disabled: true },
          ].map(tab => (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={activeSubTab === tab.id}
              onClick={() => setActiveSubTab(tab.id as CaregiverSubTab)}
              icon={tab.icon}
              disabled={tab.disabled}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === CAREGIVER_SUB_TAB_LIST && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-primary-dark">All Caregivers</h3>
              <div className="space-x-2">
                <button onClick={fetchCaregivers} className={`${buttonBaseClass} bg-primary-light hover:bg-primary text-primary-dark hover:text-white text-sm`} title="Refresh caregiver list" disabled={isLoadingCaregivers}>
                  <RefreshIconSolid className={`w-4 h-4 mr-2 ${isLoadingCaregivers ? 'animate-spin' : ''}`} /> Sync
                </button>
                <button onClick={handleOpenAddCaregiverModal} className={`${buttonBaseClass} bg-accent hover:bg-accent-dark text-white text-sm`} title="Add a new caregiver">
                  <PlusCircleIcon className="w-5 h-5 mr-1" /> Add Caregiver
                </button>
              </div>
            </div>
            {caregiversError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-sm mb-4" role="alert">{caregiversError}</div>}
            <CaregiverListTable caregivers={caregivers} onEdit={handleOpenEditCaregiverModal} onDelete={handleDeleteCaregiver} isLoading={isLoadingCaregivers} />
            <CaregiverFormModal isOpen={isCaregiverModalOpen} onClose={handleCloseCaregiverModal} onSubmit={handleCaregiverFormSubmit} initialData={editingCaregiver} isSaving={isSavingCaregiver} />
          </div>
        )}

        {activeSubTab === CAREGIVER_SUB_TAB_SHIFTS && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-primary-dark">Manage Caregiver Shifts</h3>
              <button onClick={() => setShowAddShiftForm(!showAddShiftForm)} className={`${buttonBaseClass} bg-accent hover:bg-accent-dark text-white text-sm`}>
                <PlusCircleIcon className="w-5 h-5 mr-2" /> {showAddShiftForm ? 'Cancel Assignment' : 'Assign New Shift'}
              </button>
            </div>
            {showAddShiftForm && (
              <form onSubmit={handleAddShiftSubmit} className="p-6 border border-slate-200 rounded-xl mb-8 space-y-4 bg-slate-50 shadow-sm">
                <h4 className="text-lg font-medium text-secondary mb-2">New Shift Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="caregiver_id_shift" className={labelBaseClass}>Caregiver</label>
                    <select name="caregiver_id" id="caregiver_id_shift" value={newShiftData.caregiver_id} onChange={handleShiftInputChange} required className={`${inputBaseClass} bg-white`}>
                      <option value="" disabled>Select Caregiver</option>
                      {caregivers.map(cg => <option key={cg.id} value={cg.id}>{cg.full_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="patient_identifier_notes" className={labelBaseClass}>Patient Identifier/Details</label>
                    <input type="text" name="patient_identifier_notes" id="patient_identifier_notes" value={newShiftData.patient_identifier_notes} onChange={handleShiftInputChange} required className={inputBaseClass} placeholder="e.g., John D. (Room 101)"/>
                  </div>
                  <div>
                    <label htmlFor="shift_date" className={labelBaseClass}>Shift Date</label>
                    <input type="date" name="shift_date" id="shift_date" value={newShiftData.shift_date} onChange={handleShiftInputChange} required min={today} className={inputBaseClass}/>
                  </div>
                  <div>
                    <label htmlFor="location" className={labelBaseClass}>Location</label>
                    <input type="text" name="location" id="location" value={newShiftData.location || ''} onChange={handleShiftInputChange} className={inputBaseClass} placeholder="e.g., Client's Home"/>
                  </div>
                  <div>
                    <label htmlFor="start_time" className={labelBaseClass}>Start Time</label>
                    <input type="time" name="start_time" id="start_time" value={newShiftData.start_time} onChange={handleShiftInputChange} required className={inputBaseClass}/>
                  </div>
                  <div>
                    <label htmlFor="end_time" className={labelBaseClass}>End Time</label>
                    <input type="time" name="end_time" id="end_time" value={newShiftData.end_time} onChange={handleShiftInputChange} required className={inputBaseClass}/>
                  </div>
                </div>
                <div>
                  <label htmlFor="notes_shift" className={labelBaseClass}>Shift Notes (Optional)</label>
                  <textarea name="notes" id="notes_shift" value={newShiftData.notes || ''} onChange={handleShiftInputChange} rows={3} className={inputBaseClass} placeholder="Any specific instructions..."></textarea>
                </div>
                <button type="submit" disabled={isSavingShift} className={`${buttonBaseClass} bg-primary hover:bg-primary-dark text-white`}>
                  {isSavingShift ? <LoadingSpinner size="sm"/> : 'Save Shift'}
                </button>
              </form>
            )}
            {isLoadingShifts ? <LoadingSpinner text="Loading shifts..." /> : (
              shifts.length > 0 ? (
                <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-100"><tr>
                  {["Caregiver", "Date", "Time", "Patient/Details", "Location", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">{h}</th>)}
                </tr></thead><tbody className="bg-white divide-y divide-slate-200">
                  {shifts.map(shift => (<tr key={shift.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{shift.caregiver_full_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{new Date(shift.shift_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{shift.start_time} - {shift.end_time}</td>
                    <td className="px-4 py-3 text-sm text-neutral-dark max-w-xs truncate" title={shift.notes || undefined}>{shift.notes || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{shift.location || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ shift.status === ShiftStatus.COMPLETED ? 'bg-green-100 text-green-700' : shift.status === ShiftStatus.CANCELLED ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700' }`}>{shift.status}</span></td>
                  </tr>))}
                </tbody></table></div>
              ) : (!showAddShiftForm && <p className="text-neutral-DEFAULT text-center py-6">No shifts recorded.</p>)
            )}
          </div>
        )}

        {activeSubTab === CAREGIVER_SUB_TAB_DOCUMENTS && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-primary-dark">Caregiver Documents</h3>
              <button onClick={() => setShowAddDocForm(!showAddDocForm)} className={`${buttonBaseClass} bg-accent hover:bg-accent-dark text-white text-sm`}>
                <PlusCircleIcon className="w-5 h-5 mr-2" /> {showAddDocForm ? 'Cancel Upload' : 'Upload Document'}
              </button>
            </div>
            {showAddDocForm && (
              <form onSubmit={handleAddDocumentSubmit} className="p-6 border border-slate-200 rounded-xl mb-8 space-y-4 bg-slate-50 shadow-sm">
                <h4 className="text-lg font-medium text-secondary mb-2">New Document Upload</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="caregiver_id_doc" className={labelBaseClass}>Caregiver</label>
                    <select name="caregiver_id" id="caregiver_id_doc" value={newDocFormData.caregiver_id} onChange={handleDocInputChange} required className={`${inputBaseClass} bg-white`}>
                      <option value="" disabled>Select Caregiver</option>
                      {caregivers.map(cg => <option key={cg.id} value={cg.id}>{cg.full_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="doc_type" className={labelBaseClass}>Document Type</label>
                    <select name="doc_type" id="doc_type" value={newDocFormData.doc_type} onChange={handleDocInputChange} required className={`${inputBaseClass} bg-white`}>
                       {CAREGIVER_DOCUMENT_TYPE_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="expires_on" className={labelBaseClass}>Expiration Date (Optional)</label>
                    <input type="date" name="expires_on" id="expires_on" value={newDocFormData.expires_on || ''} onChange={handleDocInputChange} className={inputBaseClass} min={today}/>
                  </div>
                  <div>
                    <label htmlFor="file" className={labelBaseClass}>Document File</label>
                    <input type="file" name="file" id="file" onChange={handleDocFileChange} required accept={ALLOWED_DOCUMENT_TYPES.join(",")} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-primary/30"/>
                    {docFilePreview && <p className="text-xs text-slate-500 mt-1">Selected: {docFilePreview}</p>}
                  </div>
                </div>
                <button type="submit" disabled={isUploadingDocument} className={`${buttonBaseClass} bg-primary hover:bg-primary-dark text-white`}>
                  {isUploadingDocument ? <LoadingSpinner size="sm"/> : <><CloudArrowUpIcon className="w-5 h-5 mr-2" /> Upload Document</>}
                </button>
              </form>
            )}
            {isLoadingDocuments ? <LoadingSpinner text="Loading documents..." /> : (
              documents.length > 0 ? (
                <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-100"><tr>
                  {["Caregiver", "Type", "Expires", "File Name", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">{h}</th>)}
                </tr></thead><tbody className="bg-white divide-y divide-slate-200">
                  {documents.map(doc => (<tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{doc.caregiver_full_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{doc.doc_type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{doc.expires_on ? new Date(doc.expires_on).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-dark max-w-xs truncate" title={doc.file_name || doc.doc_url}>
                      <a href={doc.doc_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{doc.file_name || 'View Document'}</a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">
                       <button onClick={() => handleDeleteDocument(doc.id, doc.doc_url)} className="text-red-500 hover:text-red-700 p-1" title="Delete Document"><TrashIcon className="w-4 h-4"/></button>
                    </td>
                  </tr>))}
                </tbody></table></div>
              ) : (!showAddDocForm && <p className="text-neutral-DEFAULT text-center py-6">No documents uploaded.</p>)
            )}
          </div>
        )}

        {[CAREGIVER_SUB_TAB_INCIDENTS, CAREGIVER_SUB_TAB_NOTIFICATIONS].includes(activeSubTab as any) && (
          <div className="text-center py-10 p-6 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
            {activeSubTab === CAREGIVER_SUB_TAB_INCIDENTS && <ExclamationTriangleIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />}
            {activeSubTab === CAREGIVER_SUB_TAB_NOTIFICATIONS && <BellIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />}
            <h3 className="text-xl font-semibold text-primary-dark mb-2">
              {activeSubTab === CAREGIVER_SUB_TAB_INCIDENTS ? "Record & View Incidents" : "Send Notifications"}
            </h3>
            <p className="text-neutral-DEFAULT">
              {activeSubTab === CAREGIVER_SUB_TAB_INCIDENTS 
                ? "This section will be for logging and reviewing caregiver-related incidents." 
                : "This section will be for sending notifications to caregivers."}
            </p>
            <p className="text-sm text-slate-400 mt-2">(Feature coming soon)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverPanel;