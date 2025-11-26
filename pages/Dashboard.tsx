import React, { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Plus, Check, AlertCircle } from 'lucide-react';
import { Doctor, AvailabilitySlot } from '../types';
import { DAYS_OF_WEEK } from '../constants';

interface DashboardProps {
  // In a real app, this would come from auth context
  doctor: Doctor; 
  onUpdateProfile: (updated: Partial<Doctor>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ doctor, onUpdateProfile }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleGoogleSync = () => {
    setIsSyncing(true);
    // Simulate API delay for OAuth/API handshake
    setTimeout(() => {
      onUpdateProfile({ calendarSynced: !doctor.calendarSynced });
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Provider Dashboard</h1>
        <p className="text-slate-500">Manage your availability and integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <img src={doctor.imageUrl} alt={doctor.name} className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="font-semibold text-slate-900">{doctor.name}</h2>
                <p className="text-sm text-slate-500">{doctor.specialty}</p>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-medium text-slate-900 mb-4">Integrations</h3>
              
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="GCal" className="w-6 h-6 mr-2" />
                    <span className="text-sm font-medium text-slate-700">Google Calendar</span>
                  </div>
                  {doctor.calendarSynced ? (
                     <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  ) : (
                    <span className="flex h-2 w-2 rounded-full bg-slate-300"></span>
                  )}
                </div>
                
                <p className="text-xs text-slate-500 mb-4">
                  {doctor.calendarSynced 
                    ? "Your availability is automatically synced from your primary calendar." 
                    : "Connect to prevent double bookings and manage availability."}
                </p>

                <button
                  onClick={handleGoogleSync}
                  disabled={isSyncing}
                  className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    doctor.calendarSynced
                      ? "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {isSyncing ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : doctor.calendarSynced ? (
                    "Disconnect Calendar"
                  ) : (
                    "Connect Account"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-900 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                Weekly Availability
              </h3>
              <button className="text-sm text-primary font-medium flex items-center hover:text-sky-600">
                <Plus className="w-4 h-4 mr-1" />
                Add Slot
              </button>
            </div>

            {doctor.calendarSynced && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
                <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">Synced with Google Calendar.</span> Any events in your "Medical Practice" calendar will block slots here automatically.
                </div>
              </div>
            )}

            <div className="space-y-4">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="flex items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="w-16 font-medium text-slate-500 pt-2">{day}</div>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {doctor.availability.filter(slot => slot.day === day).map((slot, idx) => (
                      <div 
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg text-sm border ${
                          slot.isBooked 
                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" 
                            : "bg-sky-50 border-sky-100 text-primary cursor-pointer hover:bg-sky-100"
                        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                        {slot.isBooked && <span className="ml-2 text-xs">(Booked)</span>}
                      </div>
                    ))}
                    {doctor.availability.filter(slot => slot.day === day).length === 0 && (
                      <div className="text-sm text-slate-400 py-1.5 italic">No slots available</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
