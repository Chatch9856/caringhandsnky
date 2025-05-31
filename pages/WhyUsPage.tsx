
import React from 'react';
import { HeartIconLucide, PersonIcon, CheckCircleIcon } from '../constants'; // Assuming these are in constants.tsx

const WhyUsPage: React.FC = () => {
  const reasons = [
    {
      icon: <HeartIconLucide className="w-12 h-12 text-primary" />,
      title: "Compassionate & Personalized Care",
      description: "We believe in treating every client with the utmost respect, dignity, and compassion. Our care plans are tailored to individual needs, ensuring a personal touch that makes a real difference in their lives and promotes independence."
    },
    {
      icon: <PersonIcon className="w-12 h-12 text-secondary" />,
      title: "Qualified & Trustworthy Caregivers",
      description: "Our caregivers are meticulously screened, extensively trained, and deeply committed to providing high-quality care. We ensure they are not only skilled but also share our values of empathy and reliability."
    },
    {
      icon: <CheckCircleIcon className="w-12 h-12 text-accent" />,
      title: "Commitment to Excellence & Safety",
      description: "We adhere to the highest standards of care and safety protocols. Continuous training, regular assessments, and open communication ensure we consistently deliver exceptional service and a safe environment for our clients."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary-dark"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0zM10.5 20.25H5.625c-.621 0-1.125-.504-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H18.375c.621 0 1.125.504 1.125 1.125v4.5M10.5 20.25V16.5m0 3.75V12m0 4.5h4.5m-4.5 0H7.5m6-12H5.25m13.5 0H12m0 0V2.25" /></svg>,
      title: "Flexible & Reliable Services",
      description: "We understand that needs can change. We offer flexible scheduling and a range of services to adapt to your evolving requirements, ensuring consistent and reliable support when you need it most."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-secondary-dark"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-6.75 3h9m-9 3h9M3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v14.25c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 19.125V4.875C1.5 3.84 2.34 3 3.375 3z" /></svg>,
      title: "Transparent Communication",
      description: "We believe in open and honest communication with our clients and their families. Regular updates and accessible support staff ensure you are always informed and involved in the care process."
    },
     {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-accent-dark"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
      title: "Community Focused",
      description: "As a local NKY provider, we are deeply rooted in our community. We strive to not only serve our clients but also to contribute positively to the well-being of the neighborhoods we operate in."
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-dark mb-4">Why Choose CaringHandsNKY?</h1>
        <p className="text-lg text-neutral-DEFAULT max-w-2xl mx-auto">
          Discover the CaringHandsNKY difference. We are dedicated to providing exceptional home care services 
          with a focus on compassion, professionalism, and the well-being of your loved ones.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reasons.map((reason, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            <div className="mb-4 p-3 bg-slate-100 rounded-full">
              {reason.icon}
            </div>
            <h3 className="text-xl font-semibold text-primary-dark mb-2">{reason.title}</h3>
            <p className="text-neutral-DEFAULT text-sm">{reason.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center bg-gradient-to-r from-primary to-secondary text-white py-12 px-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Ready for Peace of Mind?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Let us provide the support your family needs. Contact us today for a free, no-obligation consultation.
        </p>
        <a 
          href={`mailto:consult@caringhandsnky.com?subject=Care Consultation Request`}
          className="bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-md"
        >
          Request a Free Consultation
        </a>
      </div>
    </div>
  );
};

export default WhyUsPage;