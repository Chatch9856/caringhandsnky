
import React from 'react';
import { Service } from '../types';
import ServiceCard from './ServiceCard';
import useScrollAnimation from '../hooks/useScrollAnimation';

const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 3h13.5c.138 0 .273.012.404.035M5.25 3A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H5.25z" />
  </svg>
);

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
</svg>
);

const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.247-4.065A9.06 9.06 0 0018 15.75M16.023 16.023A9.082 9.082 0 0118 18.75m-1.548-4.062a3 3 0 014.682 2.72 8.982 8.982 0 01-3.741.479m-1.205-5.202A9.042 9.042 0 0018 11.25M15 9.75a3 3 0 11-6 0 3 3 0 016 0zm1.914 6.75a8.962 8.962 0 00-3.828-2.25 3 3 0 00-3.514 0A8.961 8.961 0 004.086 16.5M4.086 16.5A8.962 8.962 0 007.5 18.75m1.414-2.25A3 3 0 017.5 15m0 0a3 3 0 013.472-2.984m-3.472 2.984A9.015 9.015 0 003 11.25m0 0a3 3 0 016 0m0 0a3 3 0 01-6 0zm0-3.75a3 3 0 01-6 0m6 0a3 3 0 016 0zm2.25 6A3 3 0 0115 9.75m0 0a3 3 0 013-3m-3 3a3 3 0 00-3 3m3-3a3 3 0 003-3m-3 3a3 3 0 01-3 3" />
</svg>
);

const EndLifeCareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a4.5 4.5 0 00-9 0 4.5 4.5 0 009 0zM3.75 9a4.5 4.5 0 014.5-4.5h7.5a4.5 4.5 0 014.5 4.5v9a4.5 4.5 0 01-4.5 4.5h-7.5a4.5 4.5 0 01-4.5-4.5v-9z" />
  </svg>
);


const services: Service[] = [
  {
    id: 'hourly',
    title: 'Hourly Caregiving',
    description: 'Flexible light assistance, companionship, medication reminders, and ensuring a safe home environment for your loved ones.',
    icon: <UserGroupIcon />,
  },
  {
    id: 'skilled',
    title: 'Skilled Medical Support',
    description: 'Professional nurse-led in-home visits for medical treatments, post-operative care, wound management, and health monitoring.',
    icon: <HeartIcon />,
  },
  {
    id: 'specialty',
    title: 'Specialty Care Plans',
    description: 'Tailored care programs for specific needs including post-surgery recovery, chronic illness management, and dementia/Alzheimer\'s support.',
    icon: <BriefcaseIcon />,
  },
  {
    id: 'end-of-life',
    title: "End-of-Life Care",
    description: "Compassionate support for patients and families during life’s final stages—dignity, comfort, and peace when it matters most.",
    icon: <EndLifeCareIcon />,
  }
];

const ServiceHighlights: React.FC = () => {
  const sectionRef = useScrollAnimation<HTMLDivElement>();
  const titleRef = useScrollAnimation<HTMLHeadingElement>({ animationClass: 'animate-fade-in-up' });
  
  return (
    <section id="services" ref={sectionRef} className="py-16 md:py-24 bg-brand-lavender-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 ref={titleRef} className="text-3xl sm:text-4xl font-bold text-brand-charcoal text-center mb-12 md:mb-16">
          What We <span className="text-brand-purple">Offer</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;