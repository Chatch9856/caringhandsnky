
import React, { useState, useEffect, useCallback } from 'react';
import { SiteContent, SiteContentType, Service, Testimonial } from '../../types';
import { SAMPLE_SERVICES, SAMPLE_TESTIMONIALS } from '../../constants'; // For default structure/keys
import { supabase as supabaseClient } from '../../services/supabaseClient'; 
import { getAllSiteContent, saveSiteContent } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DocumentTextIcon } from '../../constants';

// Define which sections are editable
const editableSections: { key: SiteContentType | string, label: string, type: 'html' | 'text' }[] = [
  { key: SiteContentType.HOME_HERO_TITLE, label: "Home: Hero Title", type: 'text' },
  { key: SiteContentType.HOME_HERO_SUBTITLE, label: "Home: Hero Subtitle", type: 'html' },
  { key: SiteContentType.PAY_ONLINE_INTRO, label: "Pay Online: Intro Text", type: 'html' },
  { key: SiteContentType.URGENT_HELP_MAIN_TEXT, label: "Urgent Help: Main Text", type: 'html' },
  // Add more static sections here
];

// For services and testimonials, their content keys are defined in constants.tsx with the items
// We will generate editable fields for them dynamically.

const AdminContentPage: React.FC = () => {
  const [siteContents, setSiteContents] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('general'); // 'general', 'services', 'testimonials'

  const fetchAllContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const contents = await getAllSiteContent();
      const contentMap: Record<string, string> = {};
      contents.forEach(c => {
        contentMap[c.sectionKey] = c.contentHtml;
      });
      setSiteContents(contentMap);
    } catch (err: any) {
      setError(`Failed to load site content: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  const handleContentChange = (key: string, value: string) => {
    setSiteContents(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveContent = async (key: string) => {
    setIsLoading(true);
    try {
      const contentToSave: SiteContent = {
        sectionKey: key,
        contentHtml: siteContents[key] || '', // Ensure it's not undefined
      };
      await saveSiteContent(contentToSave);
      alert(`Content for "${key}" saved successfully!`);
    } catch (err: any) {
      alert(`Error saving content for "${key}": ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditableField = (key: string, label: string, type: 'html' | 'text' = 'html') => (
    <div key={key} className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-slate-200">
      <label htmlFor={key} className="block text-sm sm:text-base font-semibold text-slate-700 mb-2">{label}</label>
      {type === 'html' ? (
        <textarea
          id={key}
          value={siteContents[key] || ''}
          onChange={(e) => handleContentChange(key, e.target.value)}
          rows={6}
          className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-sm"
          placeholder={`Enter HTML content for ${label}...`}
        />
      ) : (
         <input
          type="text"
          id={key}
          value={siteContents[key] || ''}
          onChange={(e) => handleContentChange(key, e.target.value)}
          className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-sm"
          placeholder={`Enter text for ${label}...`}
        />
      )}
      <div className="mt-3 text-xs text-slate-500">Key: <code>{key}</code></div>
      {type === 'html' && (
         <div className="mt-2 p-3 border border-dashed border-slate-300 rounded-md bg-slate-50 max-h-48 overflow-y-auto">
            <h4 className="text-xs font-semibold text-slate-600 mb-1">Live HTML Preview:</h4>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: siteContents[key] || '<p class="italic text-slate-400">Preview will appear here...</p>' }} />
        </div>
      )}
      <button
        onClick={() => handleSaveContent(key)}
        disabled={isLoading}
        className="mt-4 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
  
  const dynamicSectionTabs = [
    { key: 'general', label: 'General Site Sections' },
    { key: 'services', label: 'Services Content' },
    { key: 'testimonials', label: 'Testimonials Content' },
  ];


  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center">
        <DocumentTextIcon className="w-8 h-8 mr-3 text-primary" />
        Content Management
      </h1>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert"><p>{error}</p></div>}
      
      <div className="mb-4 sm:mb-6 border-b border-slate-200">
        <nav className="flex flex-wrap -mb-px" aria-label="Content sections">
          {dynamicSectionTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm focus:outline-none transition-colors
                ${activeSection === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {isLoading && activeSection === 'general' && <LoadingSpinner text="Loading content sections..." />}

      {activeSection === 'general' && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {editableSections.map(section => renderEditableField(section.key, section.label, section.type))}
        </div>
      )}

      {activeSection === 'services' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-700 mt-4">Edit Service Details</h2>
          {SAMPLE_SERVICES.map((service: Service) => (
            <div key={service.id} className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-primary mb-3">{service.name} (Original)</h3>
              {service.contentKeyName && renderEditableField(service.contentKeyName, "Service Name", "text")}
              {service.contentKeyDescription && renderEditableField(service.contentKeyDescription, "Service Description", "html")}
              {service.contentKeyDetails && renderEditableField(service.contentKeyDetails, "Service Details (HTML list recommended)", "html")}
              {/* Add price editing if needed, might need a different table/structure if not just text */}
            </div>
          ))}
        </div>
      )}
      
      {activeSection === 'testimonials' && (
         <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-700 mt-4">Edit Testimonials</h2>
          {SAMPLE_TESTIMONIALS.map((testimonial: Testimonial) => (
            <div key={testimonial.id} className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-primary mb-1">{testimonial.author} (Original)</h3>
              <p className="text-xs text-slate-500 mb-3">ID: {testimonial.id}</p>
              {renderEditableField(`testimonial_${testimonial.id}_author`, "Author Name", "text")}
              {testimonial.contentKey && renderEditableField(testimonial.contentKey, "Testimonial Text", "html")}
              {/* Rating and Date could be separate fields too */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContentPage;
