
import React from 'react';
import { ExclamationTriangleIcon } from '../constants';

const UrgentHelpPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-red-500">
        <div className="flex items-center mb-6">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mr-4" />
          <h1 className="text-3xl font-bold text-red-600">Urgent Help & Emergency Information</h1>
        </div>
        
        <p className="text-lg text-neutral-DEFAULT mb-6">
          At CaringHandsNKY, the safety and well-being of our clients are our top priorities. 
          This page provides guidance for urgent situations.
        </p>

        <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-2xl font-semibold text-red-700 mb-3">Medical Emergencies: Call 911 Immediately</h2>
          <p className="text-neutral-dark">
            If you or your loved one is experiencing a life-threatening medical emergency (e.g., difficulty breathing, chest pain, uncontrolled bleeding, severe injury, stroke symptoms), 
            <strong>please call 911 or your local emergency services number without delay.</strong>
          </p>
          <p className="mt-2 text-sm text-red-600">
            Do not rely on contacting CaringHandsNKY first in a critical medical situation.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-primary-dark mb-3">Urgent (Non-Medical Emergency) Contact with CaringHandsNKY</h2>
          <p className="text-neutral-DEFAULT mb-2">
            For urgent matters related to your care services that are not immediate medical emergencies, such as:
          </p>
          <ul className="list-disc list-inside text-neutral-DEFAULT space-y-1 mb-3 pl-4">
            <li>Unexpected caregiver delay or absence.</li>
            <li>Sudden change in client condition requiring immediate advice (non-life-threatening).</li>
            <li>Urgent scheduling changes required within the next few hours.</li>
          </ul>
          <p className="text-neutral-DEFAULT">
            Please contact us at our <strong>Urgent Support Line: <a href="tel:555-000-1111" className="font-bold text-primary hover:underline">(555) 000-1111</a></strong>.
          </p>
          <p className="text-sm text-neutral-DEFAULT mt-1">
            This line is monitored for urgent issues. For non-urgent inquiries, please use our regular contact methods.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-primary-dark mb-3">General Safety Reminders</h2>
           <ul className="list-disc list-inside text-neutral-DEFAULT space-y-1 pl-4">
            <li>Keep emergency contact numbers easily accessible.</li>
            <li>Ensure a clear path for movement within the home to prevent falls.</li>
            <li>If there are specific emergency protocols for a client's condition, ensure they are known by all caregivers and family.</li>
          </ul>
        </div>
         <p className="mt-8 text-sm text-center text-neutral-DEFAULT">
          Your peace of mind is important to us. We are here to support you.
        </p>
      </div>
    </div>
  );
};

export default UrgentHelpPage;