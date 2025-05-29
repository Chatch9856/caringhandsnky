
import React from 'react';
import { Testimonial } from '../types';
import { StarIcon } from '../constants';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < testimonial.rating} className="w-5 h-5" />
        ))}
      </div>
      <p className="text-neutral-DEFAULT italic mb-4">"{testimonial.text}"</p>
      <div className="text-right">
        <p className="font-semibold text-primary">{testimonial.author}</p>
        <p className="text-sm text-neutral-DEFAULT">{new Date(testimonial.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
