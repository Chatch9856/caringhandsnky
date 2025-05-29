import React, { useState, FormEvent } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import Button from './Button';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Ensure API_KEY is accessed correctly via process.env
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY for GoogleGenAI is not set. Urgent Assistance form will not function.");
}
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const UrgentAssistance: React.FC = () => {
  const sectionRef = useScrollAnimation<HTMLElement>({ animationClass: 'animate-fade-in-up' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ai) {
      setError("Service is temporarily unavailable. API key not configured.");
      return;
    }
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    setIsLoading(true);
    setApiResponse(null);
    setError(null);

    const prompt = `You are an AI assistant for CaringHandsNKY, an in-home healthcare provider. A user has sent an urgent message. Their message is: "${message}". 
    Please analyze this message and provide a brief, empathetic acknowledgment. 
    If the message clearly indicates a medical emergency (e.g., mentions severe pain, difficulty breathing, unconsciousness, stroke symptoms, heart attack symptoms), strongly advise them to call 911 or local emergency services immediately. 
    Otherwise, reassure them that their message has been received and the CaringHandsNKY team will be in touch as soon as possible. 
    Keep your response concise (2-3 sentences), empathetic, and professional. Do not ask follow-up questions in this initial response. Do not offer medical advice beyond recommending emergency services if applicable.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17", // Correct model
        contents: prompt,
      });
      
      setApiResponse(response.text);
      setMessage(''); // Clear message input on success
    } catch (err) {
      console.error("Error sending urgent message:", err);
      setError("Sorry, we couldn't process your message at this time. Please try calling us directly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="bg-brand-blue-lightest py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-blue-dark mb-4">
          Need Help Right Away?
        </h2>
        <p className="text-base sm:text-lg text-brand-charcoal-light mb-6">
          Our team is available to assist with urgent care coordination. You can call us directly or leave a secure message below.
        </p>

        <p className="text-lg sm:text-xl text-brand-charcoal font-semibold mb-8">
          <a href="tel:+18595551212" className="hover:text-brand-purple">📞 (859) 555-1212</a>
          <span className="mx-2">|</span>
          <a href="mailto:urgent@caringhandsnky.com" className="hover:text-brand-purple">📧 urgent@caringhandsnky.com</a>
        </p>

        {apiResponse && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-left">
            <p className="font-semibold">Message Acknowledgment:</p>
            <p>{apiResponse}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-left" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {!API_KEY && (
           <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg text-left" role="alert">
            <p>The secure messaging form is currently unavailable. Please call or email us for urgent assistance.</p>
          </div>
        )}

        {API_KEY && (
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Your message (max 500 characters)"
              maxLength={500}
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple text-base transition-colors"
              aria-label="Urgent message"
            />
            <Button 
              type="submit" 
              variant="customBlue" 
              size="medium"
              className="mt-4 text-base"
              disabled={isLoading || !API_KEY}
            >
              {isLoading ? 'Sending...' : 'Send Secure Message'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default UrgentAssistance;