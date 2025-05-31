
import React, { useState, useMemo } from 'react';
import { Service, ServiceCategory } from '../types';
import { SAMPLE_SERVICES } from '../constants';
import ServiceCard from '../components/ServiceCard';

const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'All'>('All');

  const services = SAMPLE_SERVICES; // In a real app, fetch from a service
  const categories = useMemo(() => ['All', ...Object.values(ServiceCategory)], []);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'All') {
      return services;
    }
    return services.filter(service => service.category === selectedCategory);
  }, [services, selectedCategory]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-primary-dark mb-4 text-center">Our Home Care Services</h1>
      <p className="text-lg text-neutral-DEFAULT mb-10 text-center max-w-2xl mx-auto">
        We offer a comprehensive range of home care services designed to meet the diverse needs of our clients. Explore our offerings below.
      </p>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as ServiceCategory | 'All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-slate-200 text-neutral-dark hover:bg-primary-light hover:text-primary-dark'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-DEFAULT py-10">
          No services found for the selected category. Please try another category or view all services.
        </p>
      )}
    </div>
  );
};

export default ServicesPage;