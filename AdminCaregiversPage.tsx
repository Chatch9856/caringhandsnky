import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout'; // Corrected import path
import CaregiverListTable from './components/CaregiverListTable'; // Corrected import path
import CaregiverFormModal from './components/CaregiverFormModal'; // Corrected import path
import { Caregiver, CaregiverFormData } from './types';
import { useToast } from './components/ToastContext';
import LoadingSpinner from './components/LoadingSpinner';
import { getCaregivers, addCaregiver, updateCaregiver, deleteCaregiver } from './services/caregiverService';
import { PlusCircleIcon, RefreshCw as RefreshIconSolid } from 'lucide-react'; // Using lucide-react directly
import { supabase } from './supabaseClient';

export default function AdminCaregiversPage() {
  const { addToast } = useToast();
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [isLoadingCaregivers, setIsLoadingCaregivers] = useState(false);
  const [caregiversError, setCaregiversError] = useState<string | null>(null);
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);
  const [editingCaregiver, setEditingCaregiver] = useState<CaregiverFormData | null>(null);
  const [isSavingCaregiver, setIsSavingCaregiver] = useState(false);

  const fetchCaregiversCallback = useCallback(async () => {
    setIsLoadingCaregivers(true);
    setCaregiversError(null);
    try {
      const data = await getCaregivers();
      setCaregivers(data);
    } catch (err: any) {
      const errorMsg = `Failed to load caregivers: ${err.message}`;
      setCaregiversError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setIsLoadingCaregivers(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCaregiversCallback();
  }, [fetchCaregiversCallback]);

  const handleOpenAddCaregiverModal = () => {
    setEditingCaregiver(null);
    setIsCaregiverModalOpen(true);
  };

  const handleOpenEditCaregiverModal = (cg: Caregiver) => {
    setEditingCaregiver(cg); 
    setIsCaregiverModalOpen(true);
  };

  const handleCloseCaregiverModal = () => {
    setIsCaregiverModalOpen(false);
    setEditingCaregiver(null);
  };

  const handleCaregiverFormSubmit = async (data: CaregiverFormData, file?: File | null) => {
    if (!supabase) {
      addToast("Cannot save caregiver: Database connection is not configured.", "error");
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
      setEditingCaregiver(null); // Clear editing state
      fetchCaregiversCallback(); 
    } catch (err: any) {
      addToast(`Failed to save caregiver: ${err.message}`, 'error');
    } finally {
      setIsSavingCaregiver(false);
    }
  };

  const handleDeleteCaregiver = async (id: string) => {
    if (!supabase) {
      addToast("Cannot delete caregiver: Database connection is not configured.", "error");
      return;
    }
    if (window.confirm("Are you sure you want to delete this caregiver?")) {
      try {
        await deleteCaregiver(id);
        addToast('Caregiver deleted successfully!', 'success');
        fetchCaregiversCallback(); 
      } catch (err: any) {
        addToast(`Failed to delete caregiver: ${err.message}`, 'error');
      }
    }
  };
  
  const buttonBaseClass = "font-semibold py-2 px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center disabled:opacity-60 text-sm";

  return (
    <AdminLayout>
      <div className="space-y-6"> {/* AdminLayout provides outer padding */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800">Caregiver Management</h1>
          <div className="flex gap-2">
            <button 
              onClick={fetchCaregiversCallback} 
              className={`${buttonBaseClass} bg-primary-light hover:bg-primary text-primary-dark hover:text-white`} 
              title="Refresh caregiver list" 
              disabled={isLoadingCaregivers}
            >
              <RefreshIconSolid size={16} className={`mr-1.5 ${isLoadingCaregivers ? 'animate-spin' : ''}`} /> Sync
            </button>
            <button 
              onClick={handleOpenAddCaregiverModal} 
              className={`${buttonBaseClass} bg-accent hover:bg-accent-dark text-white`} 
              title="Add a new caregiver"
            >
              <PlusCircleIcon size={20} className="mr-1" /> Add Caregiver
            </button>
          </div>
        </div>

        {caregiversError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
            {caregiversError}
          </div>
        )}

        <CaregiverListTable 
          caregivers={caregivers} 
          onEdit={handleOpenEditCaregiverModal} 
          onDelete={handleDeleteCaregiver} 
          isLoading={isLoadingCaregivers} 
        />
        
        {/* Render modal only when open to ensure fresh state if initialData changes */}
        {isCaregiverModalOpen && (
            <CaregiverFormModal 
                isOpen={isCaregiverModalOpen} 
                onClose={handleCloseCaregiverModal} 
                onSubmit={handleCaregiverFormSubmit} 
                initialData={editingCaregiver} 
                isSaving={isSavingCaregiver} 
            />
        )}
      </div>
    </AdminLayout>
  );
}
