
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_SERVICES, ROUTE_BOOK_CARE, ROUTE_WHY_US } from '../constants';
import { SAMPLE_SERVICES, HeartIcon } from '../constants'; // Assuming SAMPLE_SERVICES is in constants.tsx
import ServiceCard from '../components/ServiceCard';


const HomePage: React.FC = () => {
  const featuredServices = SAMPLE_SERVICES.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-6 rounded-lg shadow-xl">
        <div className="container mx-auto text-center">
          <HeartIcon className="w-24 h-24 mx-auto mb-6 text-white opacity-80" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Compassionate Home Care in NKY</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Providing personalized, respectful, and reliable care services to support your loved ones in the comfort of their home.
          </p>
          <div className="space-x-4">
            <Link 
              to={ROUTE_BOOK_CARE} 
              className="bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-md"
            >
              Book Care Now
            </Link>
            <Link 
              to={ROUTE_SERVICES} 
              className="bg-white text-primary hover:bg-primary-light font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-md"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Snippet */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-dark mb-8">Why Choose CaringHandsNKY?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-secondary mb-2">Experienced Caregivers</h3>
              <p className="text-neutral-DEFAULT">Our team is composed of trained, vetted, and compassionate professionals dedicated to providing the highest quality care.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-secondary mb-2">Personalized Care Plans</h3>
              <p className="text-neutral-DEFAULT">We work closely with you to create a customized care plan that meets the unique needs and preferences of your loved one.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-secondary mb-2">Peace of Mind</h3>
              <p className="text-neutral-DEFAULT">We offer reliable and flexible services, giving you confidence that your family member is in good hands.</p>
            </div>
          </div>
          <Link to={ROUTE_WHY_US} className="mt-8 inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-12 bg-slate-100 rounded-lg">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-primary-dark mb-10 text-center">Our Popular Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              to={ROUTE_SERVICES} 
              className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-primary-dark mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-neutral-DEFAULT mb-8 max-w-xl mx-auto">
          Let us help you find the perfect care solution. Contact us today for a free consultation.
        </p>        
        <Link 
          to={ROUTE_BOOK_CARE} 
          className="bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-10 rounded-lg text-xl transition-colors shadow-lg"
        >
          Request a Consultation
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
