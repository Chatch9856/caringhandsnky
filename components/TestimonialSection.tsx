
import React from 'react';
import { Testimonial } from '../types';
import TestimonialCard from './TestimonialCard';
import useScrollAnimation from '../hooks/useScrollAnimation';

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'CaringHandsNKY cared for my father like he was family. Their compassion and professionalism were outstanding. We felt so supported.',
    author: 'Sarah M.',
    location: 'Florence, KY',
  },
  {
    id: '2',
    quote: 'The booking process was surprisingly easy, and the care my mother received was perfect. The caregiver was skilled and incredibly kind.',
    author: 'John B.',
    location: 'Covington, KY',
  },
  {
    id: '3',
    quote: 'After my surgery, I needed specialized help at home. CaringHandsNKY provided a wonderful nurse who made my recovery smooth and comfortable.',
    author: 'Linda P.',
    location: 'Newport, KY',
  },
];

const TestimonialSection: React.FC = () => {
  const sectionRef = useScrollAnimation<HTMLDivElement>();
  const titleRef = useScrollAnimation<HTMLHeadingElement>({ animationClass: 'animate-fade-in-up' });
  
  return (
    <section id="testimonials" ref={sectionRef} className="py-16 md:py-24 bg-brand-lavender-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 ref={titleRef} className="text-3xl sm:text-4xl font-bold text-brand-charcoal text-center mb-12 md:mb-16">
          Words From Our <span className="text-brand-purple">Families</span>
        </h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
