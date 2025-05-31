import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import { InventoryItem, InventoryItemFormData } from '../../types';
import { ArchiveBoxIcon, PlusCircleIcon, EditIcon, DeleteIcon } from '../../constants';
import InventoryItemModal from './inventory/InventoryItemModal';
// import { getInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../../services/adminInventoryService'; // Uncomment when service implemented
// import { useToast } from '../ToastContext';

const AdminInventoryPanel: React.FC = () => {
  // const { addToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Set to true when fetching
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // const fetchItems = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     // const data = await getInventoryItems();
  //     // setItems(data);
  //     setItems([ // Placeholder data
  //       { id: 'item1', name: 'Disposable Gloves (Box of 100)', category: 'PPE', quantity: 50, reorder_level: 20, unit: 'box', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  //       { id: 'item2', name: 'Hand Sanitizer (500ml)', category: 'Hygiene', quantity: 15, reorder_level: 10, unit: 'bottle', created_at: new Date().toISOString(), updated_at: new Date().toISOString()},
  //       { id: 'item3', name: 'First Aid Kit (Standard)', category: 'Medical Supplies', quantity: 5, reorder_level: 2, unit: 'kit', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  //     ]);
  //   } catch (error) {
  //     console.error("Error fetching inventory items:", error);
  //     // addToast("Failed to load inventory.", "error");
  //   }
  //   setIsLoading(false);
  // }, [addToast]);

  // useEffect(() => {
  //   fetchItems();
  // }, [fetchItems]);

  const handleOpenModal = (item: InventoryItem | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmitItem = async (formData: InventoryItemFormData) => {
    setIsSaving(true);
    try {
      if (editingItem) {
        // await updateInventoryItem(editingItem.id, formData);
        // addToast("Item updated successfully!", "success");
      } else {
        // await addInventoryItem(formData);
        // addToast("Item added successfully!", "success");
      }
      // fetchItems(); // Refresh list
      handleCloseModal();
    } catch (error) {
      console.error("Error saving item:", error);
      // addToast("Failed to save item.", "error");
    }
    setIsSaving(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // await deleteInventoryItem(itemId);
        // addToast("Item deleted successfully!", "success");
        // fetchItems(); // Refresh list
      } catch (error) {
        console.error("Error deleting item:", error);
        // addToast("Failed to delete item.", "error");
      }
    }
  };
  
  const getQuantityColor = (quantity: number, reorderLevel?: number | null) => {
    if (reorderLevel && quantity < reorderLevel) return 'text-red-600 font-bold';
    if (reorderLevel && quantity < reorderLevel * 1.5) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading inventory..." />;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm mt-0">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary-dark flex items-center">
          <ArchiveBoxIcon className="w-6 h-6 mr-2" /> Inventory Management
        </h3>
        <button
          onClick={() => handleOpenModal()}
          className="bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md flex items-center text-sm"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Add New Item
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-neutral-500 text-center py-8">No inventory items found. Add some to get started!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Reorder Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-dark">{item.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{item.category || 'N/A'}</td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${getQuantityColor(item.quantity, item.reorder_level)}`}>
                    {item.quantity}
                    {item.reorder_level && item.quantity < item.reorder_level && 
                      <span className="ml-2 text-red-500" title="Below reorder level">!</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{item.reorder_level || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{item.unit || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button onClick={() => handleOpenModal(item)} className="text-primary hover:text-primary-dark p-1" title="Edit Item"><EditIcon className="w-4 h-4"/></button>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 p-1" title="Delete Item"><DeleteIcon className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
        <InventoryItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitItem}
          initialData={editingItem}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default AdminInventoryPanel;