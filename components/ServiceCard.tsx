
import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { ROUTE_BOOK_CARE } from '../constants';


interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col border border-slate-200">
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4">
          {service.icon && <div className="mr-4 p-3 bg-primary-light rounded-full">{React.cloneElement(service.icon, { className: "w-8 h-8 text-primary-dark" })}</div>}
          <h3 className="text-xl font-semibold text-primary-dark">{service.name}</h3>
        </div>
        <p className="text-neutral-DEFAULT text-sm mb-3">{service.description}</p>
        {service.pricePerHour && (
          <p className="text-lg font-bold text-secondary mb-3">${service.pricePerHour}/hour</p>
        )}
        {service.details && service.details.length > 0 && (
          <ul className="list-disc list-inside text-sm text-neutral-DEFAULT space-y-1 mb-4 pl-2">
            {service.details.slice(0, 3).map((detail, index) => ( 
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-6 bg-slate-50 border-t border-slate-100">
         <Link 
            to={ROUTE_BOOK_CARE} 
            state={{ selectedServiceId: service.id }}
            className="w-full block text-center bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-150 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 focus:scale-105"
          >
            Book This Service
          </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
