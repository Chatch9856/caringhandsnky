
import React from 'react';
import { Caregiver } from '../types';
import { EditIcon, DeleteIcon, DefaultCaregiverIcon } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface CaregiverListTableProps {
  caregivers: Caregiver[];
  onEdit: (caregiver: Caregiver) => void;
  onDelete: (caregiverId: string) => void;
  isLoading: boolean;
}

const CaregiverListTable: React.FC<CaregiverListTableProps> = ({ caregivers, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <LoadingSpinner text="Loading caregivers..." />;
  }

  if (caregivers.length === 0) {
    return <p className="text-neutral-DEFAULT text-center py-8">No caregivers found. Add one to get started!</p>;
  }

  const getStatusClass = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };
  
  const truncateList = (list: string[], limit: number = 2) => {
    if (!list || list.length === 0) return 'N/A';
    const displayItems = list.slice(0, limit).join(', ');
    const remainingCount = list.length - limit;
    return remainingCount > 0 ? `${displayItems}, +${remainingCount} more` : displayItems;
  };


  return (
    <div className="overflow-x-auto bg-white shadow-sm rounded-xl"> {/* Standardized card styling */}
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Photo</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Skills</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Certifications</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {caregivers.map((caregiver) => (
            <tr key={caregiver.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap">
                {caregiver.profile_image_url ? (
                  <img 
                    src={caregiver.profile_image_url} 
                    alt={caregiver.full_name} 
                    className="w-10 h-10 rounded-full object-cover" 
                    title={`Profile photo of ${caregiver.full_name}`}
                  />
                ) : (
                  <DefaultCaregiverIcon className="w-10 h-10 text-slate-400" />
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-neutral-dark">{caregiver.full_name}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-DEFAULT">
                <div>{caregiver.email}</div>
                <div>{caregiver.phone}</div>
              </td>
              <td className="px-4 py-3 text-sm text-neutral-DEFAULT" title={caregiver.skills.join(', ')}>
                {truncateList(caregiver.skills)}
              </td>
              <td className="px-4 py-3 text-sm text-neutral-DEFAULT" title={caregiver.certifications.join(', ')}>
                 {truncateList(caregiver.certifications)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(caregiver.status)}`}>
                  {caregiver.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button 
                  onClick={() => onEdit(caregiver)} 
                  className="text-primary hover:text-primary-dark transition-colors p-1"
                  title={`Edit ${caregiver.full_name}`}
                  aria-label={`Edit details for ${caregiver.full_name}`}
                >
                  <EditIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onDelete(caregiver.id)} 
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title={`Delete ${caregiver.full_name}`}
                  aria-label={`Delete ${caregiver.full_name}`}
                >
                  <DeleteIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaregiverListTable;