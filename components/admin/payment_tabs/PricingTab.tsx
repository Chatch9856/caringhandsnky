
import React, { useState, useEffect } from 'react';
import { Service, ServicePriceInfo } from '../../../types';
import { useToast } from '../../ToastContext';
import { CurrencyDollarIcon } from '../../../constants';
import LoadingSpinner from '../../LoadingSpinner';

interface PricingTabProps {
  services: Service[]; // Base services from SAMPLE_SERVICES
  // onUpdateServicePricing: (updatedPrices: ServicePriceInfo[]) => Promise<void>; // Placeholder for future API call
}

const PricingTab: React.FC<PricingTabProps> = ({ services }) => {
  const { addToast } = useToast();
  const [servicePrices, setServicePrices] = useState<ServicePriceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Initialize servicePrices from the base services data
    // In a real app, this would come from a database or separate pricing config
    setIsLoading(true);
    const initialPrices: ServicePriceInfo[] = services.map(service => ({
      id: service.id, // This id is from SAMPLE_SERVICES, will be service_pricing.id later
      serviceName: service.name,
      price: service.pricePerHour || 0, 
      taxable: false, 
      description: service.description,
    }));
    setServicePrices(initialPrices);
    setIsLoading(false);
  }, [services]);

  const handlePriceChange = (id: string, newPrice: string) => {
    const priceValue = parseFloat(newPrice);
    if (!isNaN(priceValue) && priceValue >= 0) {
      setServicePrices(prevPrices =>
        prevPrices.map(p => (p.id === id ? { ...p, price: priceValue } : p))
      );
    } else if (newPrice === '') { 
        setServicePrices(prevPrices =>
            prevPrices.map(p => (p.id === id ? { ...p, price: 0 } : p)) 
        );
    }
  };

  const handleTaxableChange = (id: string, taxable: boolean) => {
    setServicePrices(prevPrices =>
      prevPrices.map(p => (p.id === id ? { ...p, taxable } : p))
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true); 
    console.log("Saving pricing changes:", servicePrices);
    // Placeholder for API call: await onUpdateServicePricing(servicePrices);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    addToast('Service pricing updated successfully!', 'success');
    setIsSaving(false);
  };

  if (isLoading) { 
    return (
      <div className="p-6 rounded-xl shadow-sm bg-white mt-0 flex flex-col items-center justify-center min-h-[300px]">
        <LoadingSpinner text="Loading service pricing..."/>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-0"> {/* Standardized Card Styling */}
      <h3 className="text-xl font-semibold text-primary-dark mb-6">Manage Service Pricing</h3>
      <div className="space-y-6">
        {servicePrices.map(sp => (
          <div key={sp.id} className="p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-slate-50/50"> {/* Inner card styling */}
            <h4 className="text-lg font-medium text-secondary mb-1">{sp.serviceName}</h4>
            <p className="text-xs text-neutral-500 mb-3">{sp.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor={`price-${sp.id}`} className="block text-sm font-medium text-neutral-dark">
                  Price (per hour or unit)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-500 sm:text-sm">$</span>
                    </div>
                    <input
                    type="number"
                    id={`price-${sp.id}`}
                    name={`price-${sp.id}`}
                    value={sp.price}
                    onChange={e => handlePriceChange(sp.id, e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-slate-300 rounded-md py-2"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    />
                </div>
              </div>
              <div className="flex items-center self-center mt-4 md:mt-0 md:pb-1"> {/* Alignment for checkbox */}
                <input
                  type="checkbox"
                  id={`taxable-${sp.id}`}
                  checked={sp.taxable}
                  onChange={e => handleTaxableChange(sp.id, e.target.checked)}
                  className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                />
                <label htmlFor={`taxable-${sp.id}`} className="ml-2 block text-sm font-medium text-neutral-dark">
                  Taxable
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSaveChanges}
        disabled={isSaving}
        className="mt-8 w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center"
      >
        {isSaving ? <LoadingSpinner size="sm"/> : 'Save Pricing Changes'}
      </button>
    </div>
  );
};

export default PricingTab;
