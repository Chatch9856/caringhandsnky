
import React, { useState, useEffect, useCallback } from 'react';
import { AppPaymentGateway } from '../../../types';
import { useToast } from '../../ToastContext';
import { getPaymentGateways, upsertPaymentGateway } from '../../../services/paymentGatewayService';
import LoadingSpinner from '../../LoadingSpinner';
import { AVAILABLE_GATEWAY_TYPES, CloudArrowUpIcon, DeleteIcon, CreditCardIcon } from '../../../constants';
import { supabase } from '../../../supabaseClient'; // Import supabase

interface ConfigurableGateway extends AppPaymentGateway {
  isConfigured: boolean; // True if a corresponding entry exists in DB
  placeholder: string; // Placeholder text for identifier input
  defaultInstructions: string; // Default instructions if new
}


const GatewaysTab: React.FC = () => {
  const { addToast } = useToast();
  const [gateways, setGateways] = useState<ConfigurableGateway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({}); // Tracks saving state per gateway type


  const mapDbToConfigurableGateways = (
    dbGateways: AppPaymentGateway[],
    availableTypes: typeof AVAILABLE_GATEWAY_TYPES
  ): ConfigurableGateway[] => {
    return availableTypes.map(availType => {
      const dbEntry = dbGateways.find(dbGw => dbGw.type === availType.type);
      if (dbEntry) {
        return {
          ...dbEntry,
          isConfigured: true,
          placeholder: availType.placeholder,
          defaultInstructions: availType.defaultInstructions,
          currentQrPath: dbEntry.currentQrPath || null, // Ensure currentQrPath is explicitly null if not set
        };
      }
      return {
        type: availType.type,
        identifier: '',
        instructions: availType.defaultInstructions,
        qrCodeUrl: null,
        isEnabled: false,
        isConfigured: false,
        qrCodeFile: null,
        currentQrPath: null, // Default to null for new/unconfigured
        placeholder: availType.placeholder,
        defaultInstructions: availType.defaultInstructions,
      };
    });
  };

  const fetchAndSetGateways = useCallback(async () => {
    setIsLoading(true);
    try {
      const dbGateways = await getPaymentGateways();
      const configurableGateways = mapDbToConfigurableGateways(dbGateways, AVAILABLE_GATEWAY_TYPES);
      setGateways(configurableGateways);
    } catch (error: any) {
      addToast(`Error fetching payment gateways: ${error.message}`, 'error');
      // Initialize with available types if fetch fails, allowing configuration
      const unconfiguredGateways = mapDbToConfigurableGateways([], AVAILABLE_GATEWAY_TYPES);
      setGateways(unconfiguredGateways);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchAndSetGateways();
  }, [fetchAndSetGateways]);

  const handleChange = (type: string, field: keyof AppPaymentGateway, value: string | boolean | File | null) => {
    setGateways(prev =>
      prev.map(gw => {
        if (gw.type === type) {
          if (field === 'qrCodeFile') {
            const file = value as File | null;
            return { 
              ...gw, 
              qrCodeFile: file, 
              // Generate preview if it's a file, clear if null, keep existing if undefined (no change)
              qrCodeUrl: file ? URL.createObjectURL(file) : (value === null ? null : gw.qrCodeUrl)
            };
          }
          return { ...gw, [field]: value };
        }
        return gw;
      })
    );
  };
  
  const handleRemoveQrCode = (type: string) => {
     setGateways(prev =>
      prev.map(gw => 
        gw.type === type ? { ...gw, qrCodeFile: null, qrCodeUrl: null, currentQrPath: null } : gw // also clear currentQrPath if we are removing the image
      )
    );
  }

  const handleSave = async (gatewayToSave: ConfigurableGateway) => {
    if (!supabase) {
      addToast("Cannot save settings: Database connection is not configured. Please contact support.", "error");
      setIsSaving(prev => ({ ...prev, [gatewayToSave.type]: false }));
      return;
    }

    setIsSaving(prev => ({ ...prev, [gatewayToSave.type]: true }));
    try {
      // The upsert service expects AppPaymentGateway structure
      const appGatewayPayload: AppPaymentGateway = {
        dbId: gatewayToSave.dbId,
        type: gatewayToSave.type,
        identifier: gatewayToSave.identifier,
        instructions: gatewayToSave.instructions,
         // if file is null and there was a dbId (meaning update), it implies remove existing QR
        qrCodeUrl: gatewayToSave.qrCodeFile === null && gatewayToSave.dbId && !gatewayToSave.qrCodeUrl ? null : gatewayToSave.qrCodeUrl,
        isEnabled: gatewayToSave.isEnabled,
        qrCodeFile: gatewayToSave.qrCodeFile, // Pass the file itself
        currentQrPath: gatewayToSave.currentQrPath,
      };

      const savedGateway = await upsertPaymentGateway(appGatewayPayload);
      addToast(`${gatewayToSave.type} settings saved successfully!`, 'success');
      // Refresh the specific gateway in state with the potentially new URL or dbId
      setGateways(prev => prev.map(gw => 
        gw.type === savedGateway.type ? {
          ...gw, // Keep placeholder and defaultInstructions from UI state
          dbId: savedGateway.dbId,
          identifier: savedGateway.identifier,
          instructions: savedGateway.instructions,
          qrCodeUrl: savedGateway.qrCodeUrl,
          currentQrPath: savedGateway.currentQrPath,
          isEnabled: savedGateway.isEnabled,
          isConfigured: true, // Mark as configured
          qrCodeFile: null, // Clear file after successful upload
        } : gw
      ));
    } catch (error: any) {
      addToast(`Error saving ${gatewayToSave.type} settings: ${error.message}`, 'error');
    } finally {
      setIsSaving(prev => ({ ...prev, [gatewayToSave.type]: false }));
    }
  };


  if (isLoading) {
    return <LoadingSpinner text="Loading payment gateways..." />;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-0"> {/* Standardized Card Styling */}
      <h3 className="text-xl font-semibold text-primary-dark mb-6">Configure Payment Gateways</h3>
      <div className="space-y-8">
        {gateways.map(gw => (
          <div key={gw.type} className="p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
            <h4 className="text-lg font-semibold text-secondary flex items-center mb-1">
              <CreditCardIcon className="w-6 h-6 mr-2 text-secondary-dark"/>
              {gw.type}
            </h4>
            <p className="text-xs text-neutral-500 mb-4">
                {gw.isConfigured ? "Manage existing configuration." : "Set up this payment method."}
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor={`${gw.type}-identifier`} className="block text-sm font-medium text-neutral-dark">
                  {gw.type === 'Square' || (gw.type === 'PayPal' && gw.identifier.includes('http')) ? 'Payment Link' : `${gw.type} ID / Handle / Email`}
                </label>
                <input
                  type="text"
                  id={`${gw.type}-identifier`}
                  value={gw.identifier}
                  onChange={e => handleChange(gw.type, 'identifier', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder={gw.placeholder}
                  title={`Enter ${gw.type} identifier`}
                />
              </div>
              <div>
                <label htmlFor={`${gw.type}-instructions`} className="block text-sm font-medium text-neutral-dark">
                  Payment Instructions (Optional)
                </label>
                <textarea
                  id={`${gw.type}-instructions`}
                  value={gw.instructions || ''}
                  onChange={e => handleChange(gw.type, 'instructions', e.target.value)}
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder={`e.g., Please include booking ID in the payment note for ${gw.type}.`}
                  title={`Enter instructions for ${gw.type} payments`}
                />
              </div>

              {/* QR Code Section */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">QR Code (Optional)</label>
                <div className="flex items-center space-x-4">
                  {gw.qrCodeUrl ? (
                    <img src={gw.qrCodeUrl} alt={`${gw.type} QR Code`} className="w-24 h-24 border p-1 rounded-md object-contain bg-white" />
                  ) : (
                     <div className="w-24 h-24 border border-dashed border-slate-300 rounded-md flex items-center justify-center bg-slate-50">
                        <CloudArrowUpIcon className="w-10 h-10 text-slate-400"/>
                     </div>
                  )}
                  <div className="flex-grow">
                    <input
                      type="file"
                      id={`${gw.type}-qrCodeFile`}
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={e => handleChange(gw.type, 'qrCodeFile', e.target.files ? e.target.files[0] : null)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-primary/30"
                      title={`Upload new QR code for ${gw.type}`}
                    />
                    {gw.qrCodeUrl && (
                         <button
                            type="button"
                            onClick={() => handleRemoveQrCode(gw.type)}
                            className="mt-2 text-xs text-red-600 hover:text-red-800 hover:underline flex items-center"
                            title={`Remove QR code for ${gw.type}`}
                        >
                           <DeleteIcon className="w-3 h-3 mr-1"/> Remove QR Code
                        </button>
                    )}
                    <p className="text-xs text-slate-500 mt-1">Max 2MB. PNG, JPG, WEBP, SVG.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id={`${gw.type}-enabled`}
                  checked={gw.isEnabled}
                  onChange={e => handleChange(gw.type, 'isEnabled', e.target.checked)}
                  className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                  title={`Enable/Disable ${gw.type} payments`}
                />
                <label htmlFor={`${gw.type}-enabled`} className="ml-2 block text-sm text-neutral-dark">
                  Enable this payment method
                </label>
              </div>
              <button 
                onClick={() => handleSave(gw)}
                disabled={isSaving[gw.type] || isLoading}
                className="w-full sm:w-auto mt-3 bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-6 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-60 flex items-center justify-center"
                title={`Save settings for ${gw.type}`}
              >
                {isSaving[gw.type] ? <LoadingSpinner size="sm" /> : `Save ${gw.type} Settings`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GatewaysTab;
