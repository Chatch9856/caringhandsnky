
import React from 'react';
import Button from './Button';
import useScrollAnimation from '../hooks/useScrollAnimation';

const HeroSection: React.FC = () => {
  const sectionRef = useScrollAnimation<HTMLDivElement>({ animationClass: 'animate-fade-in', initialClass: 'opacity-0' });
  const headlineRef = useScrollAnimation<HTMLHeadingElement>({ animationClass: 'animate-fade-in-up', initialClass: 'opacity-0' });
  const subheadlineRef = useScrollAnimation<HTMLParagraphElement>({ animationClass: 'animate-fade-in-up', initialClass: 'opacity-0' });
  const ctaRef = useScrollAnimation<HTMLDivElement>({ animationClass: 'animate-fade-in-up', initialClass: 'opacity-0' });


  return (
    <section id="hero" ref={sectionRef} className="bg-brand-slate-light py-12"> {/* Updated background and padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 
          ref={headlineRef}
          style={{ animationDelay: '0.2s' }}
          className="text-4xl font-extrabold text-brand-blue-dark mb-4" // Updated size, color, margin
        >
          Care That Comes to You
        </h1>
        <p 
          ref={subheadlineRef}
          style={{ animationDelay: '0.4s' }}
          className="text-xl text-brand-gray-medium max-w-xl mx-auto mb-8" // Updated size, color, max-width, margin and text
        >
          Trusted in-home caregivers and medical support for families across Northern Kentucky. Dignified. Compassionate. On demand.
        </p>
        <div ref={ctaRef} style={{ animationDelay: '0.6s' }}>
          <Button 
            href="#book-care" // Updated href
            variant="customBlue" // New variant for snippet's button style
            size="large" // Keeps padding similar to snippet's (px-8 py-3 is 2rem 0.75rem, snippet was 0.8rem 2rem)
            className="text-base shadow-lg" // text-base for 1rem font size, overriding size="large"'s text-lg
          >
            Book Care Now 
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
