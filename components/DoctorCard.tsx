import React from 'react';
import { Star, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  matchReason?: string;
  onBook: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, matchReason, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <img 
              src={doctor.imageUrl} 
              alt={doctor.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{doctor.name}</h3>
              <p className="text-primary font-medium text-sm">{doctor.specialty}</p>
              <div className="flex items-center mt-1 text-slate-500 text-sm">
                <MapPin className="w-3 h-3 mr-1" />
                {doctor.location}
              </div>
              <div className="flex items-center mt-1 text-amber-500 text-sm">
                <Star className="w-3 h-3 mr-1 fill-current" />
                <span className="font-medium">{doctor.rating}</span>
                <span className="text-slate-400 ml-1">({doctor.yearsExperience} yrs exp)</span>
              </div>
            </div>
          </div>
          {doctor.calendarSynced && (
            <div className="hidden sm:flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3 mr-1" />
              G-Cal Sync
            </div>
          )}
        </div>

        <div className="mt-4">
          {matchReason && (
            <div className="mb-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800">
              <span className="font-semibold">AI Match: </span>{matchReason}
            </div>
          )}
          <p className="text-slate-600 text-sm line-clamp-2">{doctor.bio}</p>
        </div>
      </div>
      
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          Next available: <span className="font-medium text-slate-900">Today</span>
        </div>
        <button 
          onClick={() => onBook(doctor)}
          className="flex items-center text-sm font-medium text-primary hover:text-sky-700 transition-colors"
        >
          <Calendar className="w-4 h-4 mr-1" />
          View Schedule
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
