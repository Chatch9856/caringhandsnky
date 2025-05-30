
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_SERVICES, ROUTE_BOOK_CARE, ROUTE_WHY_US } from '../constants';
import { SiteContentType } from '../types'; // Corrected import
import { SAMPLE_SERVICES, HeartIcon } from '../constants'; 
import ServiceCard from '../components/ServiceCard';
import { getSiteContent } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const featuredServices = SAMPLE_SERVICES.slice(0, 3); // Services remain static for now, can be made dynamic
  const [heroTitle, setHeroTitle] = useState("Compassionate Home Care in NKY");
  const [heroSubtitle, setHeroSubtitle] = useState("Providing personalized, respectful, and reliable care services to support your loved ones in the comfort of their home.");
  // ... add more state for other editable sections
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoadingContent(true);
      try {
        const titleData = await getSiteContent(SiteContentType.HOME_HERO_TITLE);
        if (titleData?.contentHtml) setHeroTitle(titleData.contentHtml);

        const subtitleData = await getSiteContent(SiteContentType.HOME_HERO_SUBTITLE);
        if (subtitleData?.contentHtml) setHeroSubtitle(subtitleData.contentHtml);
        
        // Fetch other content sections...
      } catch (error) {
        console.error("Error fetching homepage content:", error);
      } finally {
        setIsLoadingContent(false);
      }
    };
    fetchContent();
  }, []);

  if (isLoadingContent) {
    return <LoadingSpinner text="Loading content..." />;
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-12 sm:py-20 px-4 sm:px-6 rounded-lg shadow-xl">
        <div className="container mx-auto text-center">
          <HeartIcon className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 text-white opacity-80" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: heroTitle }} />
          <p className="text-md sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: heroSubtitle }} />
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to={ROUTE_BOOK_CARE} 
              className="w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors shadow-md"
            >
              Book Care Now
            </Link>
            <Link 
              to={ROUTE_SERVICES} 
              className="w-full sm:w-auto bg-white text-primary hover:bg-primary-light font-semibold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors shadow-md"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Snippet - This section would also become editable */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto text-center px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-8">Why Choose CaringHandsNKY?</h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 text-left">
            {/* These would be dynamically rendered based on fetched content */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary mb-2">Experienced Caregivers</h3>
              <p className="text-neutral-DEFAULT text-sm sm:text-base">Our team is composed of trained, vetted, and compassionate professionals dedicated to providing the highest quality care.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary mb-2">Personalized Care Plans</h3>
              <p className="text-neutral-DEFAULT text-sm sm:text-base">We work closely with you to create a customized care plan that meets the unique needs and preferences of your loved one.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary mb-2">Peace of Mind</h3>
              <p className="text-neutral-DEFAULT text-sm sm:text-base">We offer reliable and flexible services, giving you confidence that your family member is in good hands.</p>
            </div>
          </div>
          <Link to={ROUTE_WHY_US} className="mt-8 inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors text-sm sm:text-base">
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-8 sm:py-12 bg-slate-100 rounded-lg">
        <div className="container mx-auto px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-8 sm:mb-10 text-center">Our Popular Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-10">
            <Link 
              to={ROUTE_SERVICES} 
              className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 text-center px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-4">Ready to Get Started?</h2>
        <p className="text-md sm:text-lg text-neutral-DEFAULT mb-8 max-w-xl mx-auto">
          Let us help you find the perfect care solution. Contact us today for a free consultation.
        </p>        
        <Link 
          to={ROUTE_BOOK_CARE} 
          className="bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-8 sm:px-10 rounded-lg text-lg sm:text-xl transition-colors shadow-lg"
        >
          Request a Consultation
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
