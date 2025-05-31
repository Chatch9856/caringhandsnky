
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type LayoutPreference = 'classic' | 'modern';

interface AdminLayoutContextType {
  layoutPreference: LayoutPreference;
  setLayoutPreference: (preference: LayoutPreference) => void;
  toggleLayoutPreference: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error('useAdminLayout must be used within an AdminLayoutProvider');
  }
  return context;
};

interface AdminLayoutProviderProps {
  children: ReactNode;
}

export const AdminLayoutProvider: React.FC<AdminLayoutProviderProps> = ({ children }) => {
  const [layoutPreference, setLayoutPreferenceState] = useState<LayoutPreference>(() => {
    const storedPreference = localStorage.getItem('adminLayoutPreference');
    return (storedPreference as LayoutPreference) || 'classic'; // Default to classic
  });

  useEffect(() => {
    localStorage.setItem('adminLayoutPreference', layoutPreference);
    // Optional: Add class to body or html for global styling if needed
    // document.documentElement.classList.remove('admin-classic', 'admin-modern');
    // document.documentElement.classList.add(`admin-${layoutPreference}`);
  }, [layoutPreference]);

  const setLayoutPreference = (preference: LayoutPreference) => {
    setLayoutPreferenceState(preference);
  };

  const toggleLayoutPreference = () => {
    setLayoutPreferenceState(prev => (prev === 'classic' ? 'modern' : 'classic'));
  };

  return (
    <AdminLayoutContext.Provider value={{ layoutPreference, setLayoutPreference, toggleLayoutPreference }}>
      {children}
    </AdminLayoutContext.Provider>
  );
};
