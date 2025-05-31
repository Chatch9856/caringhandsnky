
import React from 'react';
import { SAMPLE_TESTIMONIALS } from '../constants';
import TestimonialCard from '../components/TestimonialCard';

const TestimonialsPage: React.FC = () => {
  const testimonials = SAMPLE_TESTIMONIALS; // In a real app, fetch from a service

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-primary-dark mb-10 text-center">What Our Clients Say</h1>
      {testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-DEFAULT">No testimonials available at the moment.</p>
      )}
       <div className="mt-12 text-center bg-slate-100 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-primary mb-4">Share Your Experience</h2>
        <p className="text-neutral-DEFAULT mb-6">
          We value your feedback! If you've used our services, we'd love to hear about your experience. 
          Your testimonials help us improve and assist other families in making informed decisions.
        </p>
        <a 
          href="mailto:feedback@caringhandsnky.com?subject=Testimonial for CaringHandsNKY" 
          className="bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Submit Your Testimonial
        </a>
      </div>
    </div>
  );
};

export default TestimonialsPage;
