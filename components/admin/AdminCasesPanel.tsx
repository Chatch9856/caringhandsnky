import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../ToastContext';
import LoadingSpinner from '../LoadingSpinner';
import { Case, Patient, Caregiver, CaseStatus, CaseTag, AdminCaseSortOption, UserType, CaregiverStatus } from '../../types'; // Added UserType, CaregiverStatus
import { getCases, createCase, updateCase } from '../../services/caseManagementService';
import { getCaregivers } from '../../services/caregiverService'; // Import getCaregivers
import { supabase } from '../../supabaseClient';
import { BriefcaseIcon, PlusCircleIcon, RefreshIconSolid, UserCircleIcon, CogIcon } from '../../constants';
import CaseFormModal from './case_management/CaseFormModal';
import CaseDetailView from './case_management/CaseDetailView';

const AdminCasesPanel: React.FC = () => {
  const { addToast } = useToast();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null); // For editing existing case
  
  const [selectedCase, setSelectedCase] = useState<Case | null>(null); // For detail view

  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'ALL'>('ALL');
  const [filterPatient, setFilterPatient] = useState<string | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<AdminCaseSortOption>('updated_at_desc');


  const fetchInitialData = useCallback(async () => {
    if (!supabase) {
      setError("Case management system is currently unavailable. Database connection is not configured.");
      addToast("Case management system unavailable.", "error");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [casesData, patientsDataResult, allCaregiversData] = await Promise.all([
        getCases(),
        supabase.from('patients').select('*').order('full_name'), // Fetch full patient objects
        getCaregivers() // Fetch full, mapped caregiver objects
      ]);
      setCases(casesData);
      setPatients(patientsDataResult.data || []);
      // Filter active caregivers client-side and sort
      setCaregivers(
        allCaregiversData
          .filter(cg => cg.status === CaregiverStatus.ACTIVE)
          .sort((a,b) => a.full_name.localeCompare(b.full_name))
      );
    } catch (err: any) {
      setError(`Failed to load case data: ${err.message}`);
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleFormSubmit = async (formData: any, caseId?: string) => { // Type CaseFormData when defined
    setIsLoading(true);
    try {
      if (caseId) { // Editing existing case
        // const updatedCase = await updateCase(caseId, formData);
        // setCases(prev => prev.map(c => c.id === caseId ? updatedCase : c));
        addToast('Case updated successfully!', 'success'); // Placeholder
         // For edit, re-fetch the specific case or all cases to reflect changes
        fetchInitialData();
      } else { // Creating new case
        const newCase = await createCase(formData, 'ADMIN_USER_ID_PLACEHOLDER', UserType.ADMIN); // Corrected: Use UserType.ADMIN
        setCases(prev => [newCase, ...prev]);
        addToast('Case created successfully!', 'success');
      }
      setIsFormModalOpen(false);
      setEditingCase(null);
    } catch (err: any) {
      addToast(`Failed to save case: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenCreateModal = () => {
    setEditingCase(null);
    setIsFormModalOpen(true);
  };
  
  // const handleOpenEditModal = (caseItem: Case) => {
  //   setEditingCase(caseItem);
  //   setIsFormModalOpen(true);
  // };

  const handleViewCaseDetails = (caseItem: Case) => {
    setSelectedCase(caseItem);
  };
  
  const handleCloseDetailView = () => {
    setSelectedCase(null);
    fetchInitialData(); // Re-fetch to see any updates made within detail view
  };

  const filteredAndSortedCases = cases
    .filter(c => (filterStatus === 'ALL' || c.status === filterStatus) && (filterPatient === 'ALL' || c.patient_id === filterPatient))
    .sort((a, b) => {
        switch(sortOption) {
            case 'created_at_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            case 'updated_at_desc': return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            case 'status': return a.status.localeCompare(b.status);
            case 'patient_name': return (a.patient_name || '').localeCompare(b.patient_name || '');
            default: /* created_at_desc */ return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

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


  if (selectedCase) {
    return <CaseDetailView caseItem={selectedCase} onClose={handleCloseDetailView} patients={patients} caregivers={caregivers} />;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h3 className="text-xl font-semibold text-primary-dark flex items-center">
          <BriefcaseIcon className="w-6 h-6 mr-2" />Case Management
        </h3>
        <div className="flex gap-2">
          <button onClick={fetchInitialData} disabled={isLoading} className="text-sm bg-primary-light hover:bg-primary text-primary-dark hover:text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-sm flex items-center disabled:opacity-50">
            <RefreshIconSolid className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} /> Sync Cases
          </button>
          <button onClick={handleOpenCreateModal} className="text-sm bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-sm flex items-center">
            <PlusCircleIcon className="w-5 h-5 mr-1.5" /> New Case
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-sm mb-4" role="alert">{error}</div>}
      
      {/* Filters and Sort */}
       <div className="mb-6 p-4 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="filterPatient" className="block text-sm font-medium text-neutral-dark">Filter by Patient</label>
              <select id="filterPatient" value={filterPatient} onChange={(e) => setFilterPatient(e.target.value)} className="mt-1 input-style bg-white">
                <option value="ALL">All Patients</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-neutral-dark">Filter by Status</label>
              <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as CaseStatus | 'ALL')} className="mt-1 input-style bg-white">
                <option value="ALL">All Statuses</option>
                {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="sortOption" className="block text-sm font-medium text-neutral-dark">Sort By</label>
              <select id="sortOption" value={sortOption} onChange={(e) => setSortOption(e.target.value as AdminCaseSortOption)} className="mt-1 input-style bg-white">
                <option value="updated_at_desc">Last Updated (Newest)</option>
                <option value="created_at_desc">Date Created (Newest)</option>
                <option value="created_at_asc">Date Created (Oldest)</option>
                <option value="patient_name">Patient Name</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>


      {isLoading && !cases.length ? <LoadingSpinner text="Loading cases..." /> : (
        filteredAndSortedCases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Assigned To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredAndSortedCases.map(caseItem => (
                  <tr key={caseItem.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-dark max-w-xs truncate" title={caseItem.title}>{caseItem.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{caseItem.patient_name || caseItem.patient_id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{caseItem.assigned_staff_name || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">{new Date(caseItem.updated_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                       <button onClick={() => handleViewCaseDetails(caseItem)} className="text-primary hover:text-primary-dark p-1" title="View/Edit Details">
                           <CogIcon className="w-5 h-5"/>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-neutral-500">
            <BriefcaseIcon className="w-12 h-12 mx-auto text-slate-300 mb-2"/>
            No cases match current filters or no cases found.
          </div>
        )
      )}

      {isFormModalOpen && (
        <CaseFormModal
          isOpen={isFormModalOpen}
          onClose={() => { setIsFormModalOpen(false); setEditingCase(null); }}
          onSubmit={handleFormSubmit}
          initialData={editingCase}
          patients={patients}
          caregivers={caregivers}
          isLoading={isLoading}
        />
      )}
        <style>{`
        .input-style {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem; 
          border-radius: 0.375rem; 
          border: 1px solid #cbd5e1; 
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); 
        }
        .input-style:focus {
          outline: none;
          border-color: #0891b2; 
          box-shadow: 0 0 0 0.2rem rgba(8, 145, 178, 0.25); 
        }
      `}</style>
    </div>
  );
};

export default AdminCasesPanel;