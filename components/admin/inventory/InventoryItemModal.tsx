import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Modal from '../../Modal';
import LoadingSpinner from '../../LoadingSpinner';
import { InventoryItemFormData, InventoryItem } from '../../../types'; // Added InventoryItem import
// import { useToast } from '../../ToastContext'; // If you want to use toast inside modal

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: InventoryItemFormData) => Promise<void>;
  initialData?: InventoryItem | null;
  isSaving: boolean;
}

const InventoryItemModal: React.FC<InventoryItemModalProps> = ({ 
  isOpen, onClose, onSubmit, initialData, isSaving 
}) => {
  // const { addToast } = useToast();
  const defaultFormData: InventoryItemFormData = {
    name: '',
    category: '',
    quantity: 0,
    reorder_level: 0,
    unit: 'pcs',
    notes: '',
  };

  const [formData, setFormData] = useState<InventoryItemFormData>(initialData ? {
    name: initialData.name,
    category: initialData.category || '',
    quantity: initialData.quantity,
    reorder_level: initialData.reorder_level || 0,
    unit: initialData.unit || 'pcs',
    notes: initialData.notes || '',
  } : defaultFormData);

  const [errors, setErrors] = useState<Partial<Record<keyof InventoryItemFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          category: initialData.category || '',
          quantity: initialData.quantity,
          reorder_level: initialData.reorder_level || 0,
          unit: initialData.unit || 'pcs',
          notes: initialData.notes || '',
        });
      } else {
        setFormData(defaultFormData);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InventoryItemFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Item name is required.';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative.';
    if (formData.reorder_level && formData.reorder_level < 0) newErrors.reorder_level = 'Reorder level cannot be negative.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name as keyof InventoryItemFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };
  
  const inputClass = (field: keyof InventoryItemFormData) => 
    `mt-1 block w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`;
  const labelClass = "block text-sm font-medium text-neutral-dark";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Inventory Item' : 'Add New Item'}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label htmlFor="name" className={labelClass}>Item Name *</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass('name')} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <input type="text" name="category" id="category" value={formData.category || ''} onChange={handleChange} className={inputClass('category')} />
          </div>
          <div>
            <label htmlFor="unit" className={labelClass}>Unit</label>
            <input type="text" name="unit" id="unit" value={formData.unit || ''} onChange={handleChange} className={inputClass('unit')} placeholder="e.g., pcs, box, ml"/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className={labelClass}>Quantity *</label>
            <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} className={inputClass('quantity')} step="1" min="0"/>
            {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
          </div>
          <div>
            <label htmlFor="reorder_level" className={labelClass}>Reorder Level</label>
            <input type="number" name="reorder_level" id="reorder_level" value={formData.reorder_level || ''} onChange={handleChange} className={inputClass('reorder_level')} step="1" min="0"/>
             {errors.reorder_level && <p className="text-xs text-red-500 mt-1">{errors.reorder_level}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="notes" className={labelClass}>Notes (Optional)</label>
          <textarea name="notes" id="notes" rows={2} value={formData.notes || ''} onChange={handleChange} className={inputClass('notes')}></textarea>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose} disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-neutral-dark bg-slate-100 hover:bg-slate-200 rounded-md shadow-sm disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-md shadow-sm disabled:opacity-50 flex items-center">
            {isSaving ? <LoadingSpinner size="sm" /> : (initialData ? 'Save Changes' : 'Add Item')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryItemModal;