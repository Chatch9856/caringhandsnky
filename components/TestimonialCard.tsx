
import React from 'react';
import { Testimonial } from '../types';
import { StarIconLucide as StarIcon } from '../constants'; // Using Lucide version

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col"> {/* Updated card style */}
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < testimonial.rating} className="w-5 h-5" />
        ))}
      </div>
      <p className="text-neutral-DEFAULT italic mb-4 flex-grow">"{testimonial.text}"</p>
      <div className="text-right pt-3 border-t border-slate-100">
        <p className="font-semibold text-primary">{testimonial.author}</p>
        <p className="text-sm text-neutral-DEFAULT">{new Date(testimonial.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;