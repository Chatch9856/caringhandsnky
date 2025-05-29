import React from 'react';
import Button from './Button';
import useScrollAnimation from '../hooks/useScrollAnimation';

const CallToActionFooter: React.FC = () => {
  const sectionRef = useScrollAnimation<HTMLDivElement>({ animationClass: 'animate-zoom-in', initialClass: 'opacity-0' });

  return (
    <section id="contact-cta" ref={sectionRef} className="bg-brand-purple py-16 md:py-20 text-brand-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Let’s Get You Matched
        </h2>
        <p className="text-lg sm:text-xl max-w-xl mx-auto mb-10 text-purple-100">
          Answer a few questions and get connected to the right caregiver within minutes. Your loved one's well-being is our priority.
        </p>
        <Button href="#book-care" size="large" variant="outline" className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-purple">
          Start Care Matching
        </Button>
      </div>
    </section>
  );
};

export default CallToActionFooter;
