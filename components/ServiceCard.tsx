import React from 'react';
import { Service } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const cardRef = useScrollAnimation<HTMLDivElement>({ 
    animationClass: 'animate-fade-in-up', 
    initialClass: 'opacity-0'
  });
  
  // Stagger animation delay
  const animationDelay = `${index * 0.15}s`;

  return (
    <div 
      ref={cardRef}
      style={{ animationDelay }}
      className="bg-brand-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center h-full"
    >
      {service.icon && React.isValidElement(service.icon) && (
        <div className="mb-4 text-brand-purple">
          {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "h-12 w-12" })}
        </div>
      )}
      <h3 className="text-xl font-semibold text-brand-charcoal mb-3">{service.title}</h3>
      <p className="text-brand-charcoal-light text-sm leading-relaxed flex-grow">{service.description}</p>
    </div>
  );
};

export default ServiceCard;