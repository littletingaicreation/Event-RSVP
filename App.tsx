
import React, { useState, useCallback } from 'react';
import { RSVPStatus } from './types';
import { EVENT_CONFIG } from './constants';
import EventInfo from './components/EventInfo';
import Feedback from './components/Feedback';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbz-kh3QoRHx3CnguCi4K3JkSKUh46xphAu1BkD2WR7-Kd7uGnmS8sSIGckGXx76l3mAwA/exec';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [paxCount, setPaxCount] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [feedback, setFeedback] = useState<{ isVisible: boolean; message: string; isSuccess: boolean }>({
    isVisible: false,
    message: '',
    isSuccess: false
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!userName.trim()) newErrors.userName = "Name is required";
    if (!paxCount.trim()) newErrors.paxCount = "Pax number is required";
    if (!contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRSVP = useCallback(async (status: RSVPStatus) => {
    if (!validate()) {
      const firstError = document.querySelector('.text-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // 1. Show submission feedback
    setFeedback({
      isVisible: true,
      message: 'Saving RSVP...',
      isSuccess: false
    });

    // 2. Prepare Data for Google Sheet
    const formData = {
      name: userName.trim(),
      pax: paxCount.trim(),
      contact: contactNumber.trim(),
      email: email.trim(),
      status: status,
      event: EVENT_CONFIG.name,
      timestamp: new Date().toLocaleString()
    };

    // 3. Attempt to POST to Google Sheets
    // We use a try-finally to ensure WhatsApp opens even if the sheet logging fails
    try {
      // Note: Google Apps Script Web Apps often require 'no-cors' if they don't explicitly set CORS headers.
      // However, we send it as a simple POST.
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // Common for Google Apps Script to avoid CORS errors on redirect
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
    }

    // 4. Update feedback to indicate redirection
    setFeedback({
      isVisible: true,
      message: 'Opening WhatsApp...',
      isSuccess: false
    });

    // 5. Generate WhatsApp link
    let statusText = "";
    if (status === RSVPStatus.ATTENDING) {
      statusText = `I'm attending ${EVENT_CONFIG.name} on ${EVENT_CONFIG.date} at ${EVENT_CONFIG.time}. See you there! 😊`;
    } else if (status === RSVPStatus.MAYBE) {
      statusText = `I might be able to attend ${EVENT_CONFIG.name} on ${EVENT_CONFIG.date}. Will let you know soon!`;
    } else if (status === RSVPStatus.CANT_ATTEND) {
      statusText = `Sorry, I can't attend ${EVENT_CONFIG.name} on ${EVENT_CONFIG.date}. Have a great time! 😊`;
    }

    let message = `Hey! ${statusText}\n\n`;
    message += `👤 Name: ${userName.trim()}\n`;
    message += `👥 Pax: ${paxCount.trim()}\n`;
    message += `📞 Contact: ${contactNumber.trim()}\n`;
    if (email.trim()) {
      message += `📧 Email: ${email.trim()}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/${EVENT_CONFIG.organizerPhone}?text=${encodedMessage}`;

    // Small delay for better UX before opening
    setTimeout(() => {
      window.open(link, "_blank");
      
      setFeedback({
        isVisible: true,
        message: 'Sent & Saved!',
        isSuccess: true
      });

      setTimeout(() => {
        setFeedback(prev => ({ ...prev, isVisible: false }));
      }, 3000);
    }, 500);
  }, [userName, paxCount, contactNumber, email]);

  const inputClasses = (fieldName: string) => `
    w-full h-14 px-4 rounded-xl border transition-all text-lg bg-white outline-none
    ${errors[fieldName] ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
  `;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <main className="w-full max-w-[500px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">RSVP Details</p>
        </div>

        <EventInfo />

        <hr className="border-gray-200" />

        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-1">
              <label htmlFor="userName" className="block text-sm font-semibold text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userName"
                placeholder="Enter your name"
                className={inputClasses('userName')}
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (errors.userName) setErrors(prev => ({ ...prev, userName: '' }));
                }}
              />
              {errors.userName && <p className="text-red-500 text-xs font-medium ml-1">{errors.userName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="paxCount" className="block text-sm font-semibold text-gray-700">
                  Number of Pax <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="paxCount"
                  placeholder="e.g. 2"
                  min="1"
                  className={inputClasses('paxCount')}
                  value={paxCount}
                  onChange={(e) => {
                    setPaxCount(e.target.value);
                    if (errors.paxCount) setErrors(prev => ({ ...prev, paxCount: '' }));
                  }}
                />
                {errors.paxCount && <p className="text-red-500 text-xs font-medium ml-1">{errors.paxCount}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  placeholder="Phone number"
                  className={inputClasses('contactNumber')}
                  value={contactNumber}
                  onChange={(e) => {
                    setContactNumber(e.target.value);
                    if (errors.contactNumber) setErrors(prev => ({ ...prev, contactNumber: '' }));
                  }}
                />
                {errors.contactNumber && <p className="text-red-500 text-xs font-medium ml-1">{errors.contactNumber}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address <span className="text-gray-400 font-normal text-xs">(Optional)</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className={inputClasses('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleRSVP(RSVPStatus.ATTENDING)}
              className="tap-highlight-transparent group flex items-center justify-center h-[64px] w-full bg-[#10B981] hover:bg-[#059669] active:scale-95 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-200 transition-all duration-200"
            >
              <span className="mr-2 text-xl">✓</span> I'm Attending
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRSVP(RSVPStatus.MAYBE)}
                className="tap-highlight-transparent group flex items-center justify-center h-[60px] w-full bg-[#F59E0B] hover:bg-[#D97706] active:scale-95 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-100 transition-all duration-200"
              >
                <span className="mr-2">?</span> Maybe
              </button>

              <button
                onClick={() => handleRSVP(RSVPStatus.CANT_ATTEND)}
                className="tap-highlight-transparent group flex items-center justify-center h-[60px] w-full bg-[#EF4444] hover:bg-[#DC2626] active:scale-95 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-100 transition-all duration-200"
              >
                <span className="mr-2">✗</span> Can't Attend
              </button>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-400 text-sm pb-8">
          <p>Organized by {EVENT_CONFIG.organizerName || 'the Host'}</p>
          <p className="mt-1 flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Logged to sheet & sent via WhatsApp
          </p>
        </footer>
      </main>

      <Feedback 
        isVisible={feedback.isVisible} 
        message={feedback.message} 
        isSuccess={feedback.isSuccess} 
      />
    </div>
  );
};

export default App;
