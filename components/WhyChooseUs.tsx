
import React from 'react';
import { TrustFeature } from '../types';
import TrustFeatureCard from './TrustFeatureCard';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Example Icons (Heroicons)
const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.25l-1.25-2.25L13.5 11l2.25-1.25L17 7.5l1.25 2.25L20.5 11l-2.25 1.25z" />
    </svg>
);


const trustFeatures: TrustFeature[] = [
  {
    id: 'verified',
    icon: <ShieldCheckIcon />,
    title: 'Verified Caregivers',
    description: 'All our caregivers are thoroughly vetted, background-checked, and insured for your peace of mind.',
  },
  {
    id: 'hipaa',
    icon: <LockClosedIcon />,
    title: 'HIPAA Compliant',
    description: 'We adhere to strict HIPAA guidelines to ensure your personal health information is always protected.',
  },
  {
    id: 'booking',
    icon: <ClockIcon />,
    title: '24/7 Easy Booking',
    description: 'Our online platform allows for simple and convenient booking anytime, anywhere.',
  },
   {
    id: 'personalized',
    icon: <SparklesIcon />,
    title: 'Personalized Plans',
    description: 'We work with you to create a care plan that perfectly matches your unique needs and preferences.',
  },
];

const WhyChooseUs: React.FC = () => {
  const sectionRef = useScrollAnimation<HTMLDivElement>();
  const titleRef = useScrollAnimation<HTMLHeadingElement>({ animationClass: 'animate-fade-in-up' });

  return (
    <section id="why-us" ref={sectionRef} className="py-16 md:py-24 bg-brand-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 ref={titleRef} className="text-3xl sm:text-4xl font-bold text-brand-charcoal text-center mb-12 md:mb-16">
          Why Choose <span className="text-brand-purple">CaringHandsNKY?</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFeatures.map((feature, index) => (
            <TrustFeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
