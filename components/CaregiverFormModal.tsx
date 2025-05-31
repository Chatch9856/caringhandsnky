import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { CaregiverFormData, CaregiverStatus, PredefinedSkill, PredefinedCertification } from '../types';
import { 
  PREDEFINED_SKILLS_LIST, PREDEFINED_CERTIFICATIONS_LIST, 
  ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB, DefaultCaregiverIcon 
} from '../constants';

interface CaregiverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caregiverData: CaregiverFormData, imageFile?: File | null) => Promise<void>;
  initialData?: CaregiverFormData | null;
  isSaving: boolean;
}

const CaregiverFormModal: React.FC<CaregiverFormModalProps> = ({ 
  isOpen, onClose, onSubmit, initialData, isSaving 
}) => {
  const defaultFormData: CaregiverFormData = {
    full_name: '',
    email: '',
    phone: '',
    profile_image_url: null,
    skills: [],
    certifications: [],
    notes: '',
    status: CaregiverStatus.ACTIVE,
  };

  const [formData, setFormData] = useState<CaregiverFormData>(initialData || defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.profile_image_url || null);
  const [errors, setErrors] = useState<Partial<Record<keyof CaregiverFormData | 'image', string>>>({});

  useEffect(() => {
    if (isOpen) {
      const dataToLoad = initialData || defaultFormData;
      setFormData(dataToLoad);
      setImagePreview(dataToLoad.profile_image_url || null);
      setImageFile(null); // Reset file input on open
      setErrors({}); // Clear previous errors
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CaregiverFormData | 'image', string>> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid (e.g., (555) 123-4567).';
    }
    if (imageFile) {
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
        newErrors.image = `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.map(t => t.split('/')[1]).join(', ')}.`;
      }
      if (imageFile.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        newErrors.image = `File size exceeds ${MAX_IMAGE_SIZE_MB}MB.`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CaregiverFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (
    field: 'skills' | 'certifications', 
    value: PredefinedSkill | PredefinedCertification
  ) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: undefined })); // Clear image error on new selection
    } else {
      // If user cancels file selection after choosing one
      if (!initialData?.profile_image_url) { // only clear if there was no initial image
         setImageFile(null);
         setImagePreview(null);
      } else { // revert to initial image if one existed
         setImageFile(null); // means "no change" or "revert to initial"
         setImagePreview(initialData.profile_image_url);
      }
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null); // Mark for removal/no change
    setImagePreview(null); // Clear preview
    setFormData(prev => ({ ...prev, profile_image_url: null })); // Ensure URL is also cleared
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Pass null for imageFile if user cleared it and it was not just reverting to initial.
    // If imageFile is set, it's a new/replacement image.
    // If imageFile is null AND imagePreview is null (meaning user explicitly removed it), pass 'null' to service to indicate deletion.
    // If imageFile is null AND imagePreview is initialData.profile_image_url, it means no change to image.
    let fileToSend: File | null | undefined = imageFile; // undefined means no change from initialData.profile_image_url
    if (!imageFile && !imagePreview && initialData?.profile_image_url) {
        fileToSend = null; // Explicitly remove existing image
    }
    
    await onSubmit(formData, fileToSend);
  };
  
  const inputClass = (field: keyof CaregiverFormData | 'image') => 
    `mt-1 block w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`;
  const labelClass = "block text-sm font-medium text-neutral-dark";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData?.id ? 'Edit Caregiver' : 'Add New Caregiver'}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label htmlFor="full_name" className={labelClass}>Full Name</label>
          <input type="text" name="full_name" id="full_name" value={formData.full_name} onChange={handleChange} className={inputClass('full_name')} />
          {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className={labelClass}>Email Address</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass('email')} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number</label>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputClass('phone')} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
        
        <div>
          <label className={labelClass}>Profile Image</label>
          <div className="mt-1 flex items-center space-x-4">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile preview" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <DefaultCaregiverIcon className="w-20 h-20 text-slate-300 rounded-full border border-slate-200 p-2" />
            )}
            <div className="flex flex-col space-y-2">
                 <input 
                    type="file" 
                    id="profile_image_url" 
                    name="profile_image_url" 
                    accept={ALLOWED_IMAGE_TYPES.join(',')} 
                    onChange={handleImageChange} 
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-primary/30" 
                  />
                 {imagePreview && (
                    <button type="button" onClick={handleRemoveImage} className="text-xs text-red-500 hover:text-red-700">
                        Remove image
                    </button>
                  )}
            </div>
          </div>
           {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Skills</label>
            <div className="mt-1 space-y-1 max-h-32 overflow-y-auto border border-slate-200 p-2 rounded-md">
              {PREDEFINED_SKILLS_LIST.map(skill => (
                <div key={skill} className="flex items-center">
                  <input type="checkbox" id={`skill-${skill}`} name="skills" value={skill} 
                         checked={formData.skills.includes(skill)} 
                         onChange={() => handleCheckboxChange('skills', skill)} 
                         className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" />
                  <label htmlFor={`skill-${skill}`} className="ml-2 text-sm text-neutral-dark">{skill}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Certifications</label>
            <div className="mt-1 space-y-1 max-h-32 overflow-y-auto border border-slate-200 p-2 rounded-md">
              {PREDEFINED_CERTIFICATIONS_LIST.map(cert => (
                <div key={cert} className="flex items-center">
                  <input type="checkbox" id={`cert-${cert}`} name="certifications" value={cert} 
                         checked={formData.certifications.includes(cert)} 
                         onChange={() => handleCheckboxChange('certifications', cert)}
                         className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" />
                  <label htmlFor={`cert-${cert}`} className="ml-2 text-sm text-neutral-dark">{cert}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>Notes (Optional)</label>
          <textarea name="notes" id="notes" rows={3} value={formData.notes || ''} onChange={handleChange} className={inputClass('notes')}></textarea>
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className={`${inputClass('status')} bg-white`}>
            {Object.values(CaregiverStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose} disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-neutral-dark bg-slate-100 hover:bg-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark disabled:opacity-50 flex items-center">
            {isSaving ? <LoadingSpinner size="sm" /> : (initialData?.id ? 'Save Changes' : 'Add Caregiver')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CaregiverFormModal;
