
import React from 'react';
import { Testimonial } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const QuoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.5 10.5C6.5 11.3284 5.82843 12 5 12C4.17157 12 3.5 11.3284 3.5 10.5C3.5 9.67157 4.17157 9 5 9C5.82843 9 6.5 9.67157 6.5 10.5ZM19.5 10.5C19.5 11.3284 18.8284 12 18 12C17.1716 12 16.5 11.3284 16.5 10.5C16.5 9.67157 17.1716 9 18 9C18.8284 9 19.5 9.67157 19.5 10.5ZM21 4.75542C21 3.90581 20.4439 3.19318 19.6637 3.03855C17.2949 2.57631 15.1061 4.03999 14.0103 6.29283C12.9641 8.45769 13.2173 11.0448 14.6197 12.9166L13.75 14.5H10.25L9.38031 12.9166C7.97791 11.0448 7.72471 8.45769 8.67093 6.29283C9.61716 4.12796 11.8059 2.66429 14.1747 2.20205C14.5943 2.12034 15 2.45678 15 2.8873CD15 3.31781 14.5943 3.65425 14.1747 3.73596C12.3828 4.08892 10.7827 5.15211 10.0872 6.88518C9.35614 8.70073 9.52205 10.7717 10.5613 12.3919L11.75 14.5H12.25L13.4387 12.3919C14.4779 10.7717 14.6439 8.70073 13.9128 6.88518C13.2173 5.15211 11.6172 4.08892 9.82529 3.73596C9.40575 3.65425 9 3.31781 9 2.8873C9 2.45678 9.40575 2.12034 9.82529 2.20205C12.1941 2.66429 14.3828 4.12796 15.3291 6.29283C16.2753 8.45769 16.0221 11.0448 14.6197 12.9166L15.25 14H18.75L19.3803 12.9166C20.7827 11.0448 21.0359 8.45769 20.0897 6.29283C19.5561 5.17593 18.7051 4.26403 17.6471 3.64458C17.1333 3.36073 16.9428 2.72458 17.2266 2.21073C17.5105 1.69688 18.1466 1.50639 18.6605 1.79024C20.0177 2.58043 20.9895 3.85268 21 4.75542V4.75542Z" />
  </svg>
);


const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  const cardRef = useScrollAnimation<HTMLDivElement>({ animationClass: 'animate-fade-in-up', initialClass: 'opacity-0' });
  const animationDelay = `${index * 0.15}s`;

  return (
    <div
      ref={cardRef}
      style={{ animationDelay }}
      className="bg-brand-white p-6 md:p-8 rounded-xl shadow-xl flex flex-col h-full border border-brand-lavender"
    >
      <QuoteIcon className="w-8 h-8 text-brand-purple mb-4" />
      <p className="text-brand-charcoal-light italic text-md md:text-lg leading-relaxed mb-6 flex-grow">
        "{testimonial.quote}"
      </p>
      <div className="mt-auto">
        <p className="font-semibold text-brand-charcoal">{testimonial.author}</p>
        {testimonial.location && <p className="text-sm text-gray-500">{testimonial.location}</p>}
      </div>
    </div>
  );
};

export default TestimonialCard;
