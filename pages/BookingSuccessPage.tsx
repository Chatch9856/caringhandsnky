import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_HOME, CheckCircleIcon } from '../constants';

const BookingSuccessPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 text-center flex flex-col items-center justify-center min-h-[70vh]">
      <CheckCircleIcon className="w-24 h-24 text-green-500 mb-8" />
      <h1 className="text-4xl font-bold text-primary-dark mb-4">Booking Request Submitted!</h1>
      <p className="text-lg text-neutral-DEFAULT mb-6 max-w-lg">
        Thank you! Your care request has been successfully submitted. We will review your information and contact you shortly to confirm the details and next steps.
      </p>
      <Link
        to={ROUTE_HOME}
        className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-md"
      >
        Return to Homepage
      </Link>
    </div>
  );
};

export default BookingSuccessPage;
