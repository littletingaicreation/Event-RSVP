
import React from 'react';
import { EVENT_CONFIG } from '../constants';

const EventInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          🎊 {EVENT_CONFIG.name}
        </h1>
        <p className="text-gray-600 text-lg">{EVENT_CONFIG.description}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-start gap-4">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Date</p>
            <p className="text-gray-900 font-medium text-lg">{EVENT_CONFIG.date}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Time</p>
            <p className="text-gray-900 font-medium text-lg">{EVENT_CONFIG.time}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Venue</p>
            <p className="text-gray-900 font-medium text-lg">{EVENT_CONFIG.venue}</p>
            <p className="text-gray-500 text-sm">{EVENT_CONFIG.address}</p>
            <a 
              href={EVENT_CONFIG.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group"
            >
              View on Google Maps
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
