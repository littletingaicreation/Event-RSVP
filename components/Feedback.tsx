
import React from 'react';

interface FeedbackProps {
  isVisible: boolean;
  message: string;
  isSuccess: boolean;
}

const Feedback: React.FC<FeedbackProps> = ({ isVisible, message, isSuccess }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-xs w-full text-center animate-in fade-in zoom-in duration-300">
        {isSuccess ? (
          <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        ) : (
          <div className="animate-spin text-blue-600 mb-4 mx-auto w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full"></div>
        )}
        <p className="text-xl font-bold text-gray-900 mb-1">{message}</p>
        {!isSuccess && <p className="text-gray-500 text-sm">Redirecting you now...</p>}
      </div>
    </div>
  );
};

export default Feedback;
