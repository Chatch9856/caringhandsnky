
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_HOME } from '../constants';
import { ExclamationTriangleIcon } from '../constants';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto py-16 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <ExclamationTriangleIcon className="w-24 h-24 text-amber-400 mb-8" />
      <h1 className="text-6xl font-bold text-primary-dark mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-neutral-dark mb-6">Page Not Found</h2>
      <p className="text-lg text-neutral-DEFAULT mb-8 max-w-md">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link 
        to={ROUTE_HOME} 
        className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors shadow-md"
      >
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;