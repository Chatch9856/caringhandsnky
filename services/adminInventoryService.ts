// import { supabase } from '../supabaseClient';
// import { InventoryItem, InventoryItemFormData, InventoryLogActionType } from '../types';
// import { Database } from '../types/supabase';

// type DbInventoryItem = Database['public']['Tables']['inventory_items']['Row'];
// type DbInventoryItemInsert = Database['public']['Tables']['inventory_items']['Insert'];
// type DbInventoryItemUpdate = Database['public']['Tables']['inventory_items']['Update'];
// type DbInventoryLogInsert = Database['public']['Tables']['inventory_logs']['Insert'];

// const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";

// const mapDbToInventoryItem = (dbItem: DbInventoryItem): InventoryItem => ({
//   ...dbItem,
//   // Ensure any type transformations or defaults are handled here
//   quantity: dbItem.quantity ?? 0,
// });

// Helper to log inventory actions
// const logInventoryAction = async (itemId: string, actionType: InventoryLogActionType, quantityChanged: number, userId?: string, notes?: string) => {
//   if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
//   const logEntry: DbInventoryLogInsert = {
//     item_id: itemId,
//     action_type: actionType,
//     quantity_changed: quantityChanged,
//     user_info: userId || 'System', // Or fetch current admin user
//     notes: notes,
//   };
//   const { error } = await supabase.from('inventory_logs').insert(logEntry);
//   if (error) console.error(`Failed to log inventory action ${actionType} for item ${itemId}:`, error);
// };


// export const getInventoryItems = async (): Promise<InventoryItem[]> => {
//   if (!supabase) {
//     console.warn("getInventoryItems: Supabase client not initialized.");
//     return [];
//   }
//   const { data, error } = await supabase
//     .from('inventory_items')
//     .select('*')
//     .order('name', { ascending: true });

//   if (error) {
//     console.error('Error fetching inventory items:', error);
//     throw new Error(`Failed to fetch inventory: ${error.message}`);
//   }
//   return data?.map(mapDbToInventoryItem) || [];
// };

// export const addInventoryItem = async (itemData: InventoryItemFormData): Promise<InventoryItem> => {
//   if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  
//   const dbInsert: DbInventoryItemInsert = {
//     name: itemData.name,
//     category: itemData.category,
//     quantity: itemData.quantity,
//     reorder_level: itemData.reorder_level,
//     unit: itemData.unit,
//     notes: itemData.notes,
//   };

//   const { data, error } = await supabase
//     .from('inventory_items')
//     .insert(dbInsert)
//     .select()
//     .single();

//   if (error || !data) {
//     console.error('Error adding inventory item:', error);
//     throw new Error(`Failed to add item: ${error?.message || 'No data returned'}`);
//   }
//   await logInventoryAction(data.id, InventoryLogActionType.INITIAL_STOCK, data.quantity, undefined, "Item created");
//   return mapDbToInventoryItem(data);
// };

// export const updateInventoryItem = async (itemId: string, itemData: Partial<InventoryItemFormData>): Promise<InventoryItem> => {
//   if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);

//   // Fetch current quantity to calculate change for log
//   // const { data: currentItem, error: fetchError } = await supabase.from('inventory_items').select('quantity').eq('id', itemId).single();
//   // if (fetchError || !currentItem) {
//   //    console.error('Error fetching current item for update log:', fetchError);
//   //    throw new Error(`Failed to fetch item details before update: ${fetchError?.message || 'Item not found'}`);
//   // }
//   // const oldQuantity = currentItem.quantity;

//   const dbUpdate: DbInventoryItemUpdate = { ...itemData, updated_at: new Date().toISOString() };
  
//   const { data, error } = await supabase
//     .from('inventory_items')
//     .update(dbUpdate)
//     .eq('id', itemId)
//     .select()
//     .single();
  
//   if (error || !data) {
//     console.error('Error updating inventory item:', error);
//     throw new Error(`Failed to update item ${itemId}: ${error?.message || 'No data returned'}`);
//   }

//   // Log quantity change if applicable
//   // if (itemData.quantity !== undefined && itemData.quantity !== oldQuantity) {
//   //   const quantityChange = itemData.quantity - oldQuantity;
//   //   const actionType = quantityChange > 0 ? InventoryLogActionType.ADJUSTMENT_ADD : InventoryLogActionType.ADJUSTMENT_REMOVE;
//   //   await logInventoryAction(itemId, actionType, Math.abs(quantityChange), undefined, "Item quantity updated");
//   // }

//   return mapDbToInventoryItem(data);
// };

// export const deleteInventoryItem = async (itemId: string): Promise<void> => {
//   if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
//   const { error } = await supabase.from('inventory_items').delete().eq('id', itemId);
//   if (error) {
//     console.error('Error deleting inventory item:', error);
//     throw new Error(`Failed to delete item ${itemId}: ${error.message}`);
//   }
//   // Optionally log deletion, though this might be better handled by DB triggers or audit log service
// };

console.log("Admin Inventory Service placeholder loaded.");
