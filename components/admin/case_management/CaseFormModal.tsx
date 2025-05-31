import React, { useState, useEffect } from 'react';
import Modal from '../../Modal';
import { Patient, Caregiver, CaseStatus, CaseFormData, Case } from '../../../types';
import LoadingSpinner from '../../LoadingSpinner';
import { useToast } from '../../ToastContext';

interface CaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CaseFormData, caseId?: string) => Promise<void>;
  initialData?: Case | null;
  patients: Patient[];
  caregivers: Caregiver[]; // For 'assigned_staff_id'
  isLoading: boolean;
}

const CaseFormModal: React.FC<CaseFormModalProps> = ({ 
  isOpen, onClose, onSubmit, initialData, patients, caregivers, isLoading 
}) => {
  const { addToast } = useToast();
  const defaultFormData: CaseFormData = {
    patient_id: '',
    title: '',
    description: '',
    assigned_staff_id: '',
    status: CaseStatus.OPEN,
    tags: '',
  };

  const [formData, setFormData] = useState<CaseFormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof CaseFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          patient_id: initialData.patient_id,
          title: initialData.title,
          description: initialData.description,
          assigned_staff_id: initialData.assigned_staff_id || '',
          status: initialData.status as CaseStatus,
          tags: initialData.tags.join(', '),
        });
      } else {
        setFormData(defaultFormData);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CaseFormData, string>> = {};
    if (!formData.patient_id) newErrors.patient_id = 'Patient is required.';
    if (!formData.title.trim()) newErrors.title = 'Case title is required.';
    if (!formData.description.trim()) newErrors.description = 'Case description is required.';
    if (!formData.status) newErrors.status = 'Case status is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CaseFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast("Please correct the errors in the form.", "error");
      return;
    }
    await onSubmit(formData, initialData?.id);
  };

  const inputClass = (field: keyof CaseFormData) => 
    `mt-1 block w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`;
  const labelClass = "block text-sm font-medium text-neutral-dark";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Case' : 'Create New Case'}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label htmlFor="patient_id" className={labelClass}>Patient *</label>
          <select name="patient_id" id="patient_id" value={formData.patient_id} onChange={handleChange} className={`${inputClass('patient_id')} bg-white`}>
            <option value="" disabled>Select Patient</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.full_name} (ID: ...{p.id.slice(-6)})</option>)}
          </select>
          {errors.patient_id && <p className="text-xs text-red-500 mt-1">{errors.patient_id}</p>}
        </div>
        <div>
          <label htmlFor="title" className={labelClass}>Case Title *</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass('title')} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Description *</label>
          <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className={inputClass('description')}></textarea>
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="assigned_staff_id" className={labelClass}>Assign to Staff (Optional)</label>
                <select name="assigned_staff_id" id="assigned_staff_id" value={formData.assigned_staff_id} onChange={handleChange} className={`${inputClass('assigned_staff_id')} bg-white`}>
                    <option value="">None</option>
                    {caregivers.map(cg => <option key={cg.id} value={cg.id}>{cg.full_name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="status" className={labelClass}>Status *</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className={`${inputClass('status')} bg-white`}>
                    {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                 {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
            </div>
        </div>
         <div>
          <label htmlFor="tags" className={labelClass}>Tags (comma-separated, e.g., Urgent, Follow-Up)</label>
          <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} className={inputClass('tags')} placeholder="Urgent, Follow-Up"/>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose} disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-neutral-dark bg-slate-100 hover:bg-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark disabled:opacity-50 flex items-center">
            {isLoading ? <LoadingSpinner size="sm" /> : (initialData ? 'Save Changes' : 'Create Case')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CaseFormModal;
