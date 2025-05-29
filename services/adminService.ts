
import { PaymentMethod } from '../types';
import { INITIAL_PAYMENT_METHODS } from '../constants';

const PAYMENT_SETTINGS_STORAGE_KEY = 'caringHandsNKYPaymentSettings_v1';

export const getPaymentSettings = (): PaymentMethod[] => {
  try {
    const storedSettings = localStorage.getItem(PAYMENT_SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      const parsedSettings: PaymentMethod[] = JSON.parse(storedSettings);
      // Ensure all initial methods are present, adding new ones if app updated
      const currentInitialIds = INITIAL_PAYMENT_METHODS.map(p => p.id);
      const storedIds = parsedSettings.map(p => p.id);
      
      const mergedSettings = INITIAL_PAYMENT_METHODS.map(initialMethod => {
        const storedVersion = parsedSettings.find(p => p.id === initialMethod.id);
        return storedVersion ? storedVersion : initialMethod;
      });
      
      // Add any purely new methods from storage not in initial (less likely)
      // This logic ensures that settings from INITIAL_PAYMENT_METHODS are always considered,
      // and existing user settings are preserved.
      return mergedSettings;
    }
  } catch (error) {
    console.error("Error reading payment settings from localStorage:", error);
  }
  // Return a deep copy of initial settings if nothing stored or error
  return INITIAL_PAYMENT_METHODS.map(p => ({...p}));
};

export const savePaymentSettings = (settings: PaymentMethod[]): void => {
  try {
    localStorage.setItem(PAYMENT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    console.log("Payment settings saved to localStorage:", settings);
  } catch (error) {
    console.error("Error saving payment settings to localStorage:", error);
  }
};
