import React from 'react';
import { TrustFeature } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface TrustFeatureCardProps {
  feature: TrustFeature;
  index: number;
}

const TrustFeatureCard: React.FC<TrustFeatureCardProps> = ({ feature, index }) => {
  const cardRef = useScrollAnimation<HTMLDivElement>({ 
    animationClass: 'animate-fade-in-up', 
    initialClass: 'opacity-0' 
  });
  
  const animationDelay = `${index * 0.15}s`;

  return (
    <div 
      ref={cardRef} 
      style={{ animationDelay }}
      className="bg-brand-lavender-light p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
    >
      <div className="mb-4 text-brand-purple">
        {feature.icon && React.isValidElement(feature.icon) && React.cloneElement(feature.icon as React.ReactElement<{ className?: string }>, { className: "h-10 w-10" })}
      </div>
      <h3 className="text-lg font-semibold text-brand-charcoal mb-2">{feature.title}</h3>
      <p className="text-brand-charcoal-light text-sm">{feature.description}</p>
    </div>
  );
};

export default TrustFeatureCard;