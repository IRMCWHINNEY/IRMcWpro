import React, { useState, useEffect } from 'react';
import SmartSearch from '../components/SmartSearch';
import ClinicalSearch from '../components/ClinicalSearch';
import DoctorCard from '../components/DoctorCard';
import { Doctor, AiMatchResult } from '../types';

interface HomeProps {
  doctors: Doctor[];
  onBook: (doctor: Doctor) => void;
}

const Home: React.FC<HomeProps> = ({ doctors, onBook }) => {
  const [mode, setMode] = useState<'doctor' | 'evidence'>('doctor');
  const [displayedDoctors, setDisplayedDoctors] = useState<Doctor[]>(doctors);
  const [matchResults, setMatchResults] = useState<AiMatchResult[] | null>(null);

  useEffect(() => {
    if (matchResults) {
      // Filter and sort doctors based on AI match results
      const matchedIds = matchResults.map(m => m.id);
      const filtered = doctors.filter(d => matchedIds.includes(d.id));
      
      // Sort to match the AI ranking order
      filtered.sort((a, b) => matchedIds.indexOf(a.id) - matchedIds.indexOf(b.id));
      setDisplayedDoctors(filtered);
    } else {
      setDisplayedDoctors(doctors);
    }
  }, [matchResults, doctors]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-10 py-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 transition-all duration-300">
          {mode === 'doctor' ? (
            <>Find the right <span className="text-primary">specialist</span>, right now.</>
          ) : (
            <>Clinical answers, <span className="text-indigo-600">backed by evidence</span>.</>
          )}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto h-12">
          {mode === 'doctor' 
            ? "Use our AI-powered search to describe your symptoms and find top-rated medical professionals synced with your schedule."
            : "Ask complex clinical questions and get instant answers grounded in the latest medical literature."
          }
        </p>

        {/* Mode Toggle */}
        <div className="flex justify-center mt-8">
            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 inline-flex">
                <button
                onClick={() => setMode('doctor')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mode === 'doctor' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                >
                Find a Specialist
                </button>
                <button
                onClick={() => setMode('evidence')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mode === 'evidence' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                >
                Clinical Evidence
                </button>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="transition-all duration-300 ease-in-out">
        {mode === 'doctor' ? (
            <>
                <SmartSearch 
                    doctors={doctors}
                    onResultsFound={setMatchResults}
                />

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    {matchResults ? `Top Matched Specialists (${displayedDoctors.length})` : 'Available Professionals'}
                    </h2>
                    
                    {displayedDoctors.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500">No doctors found matching your criteria.</p>
                    </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedDoctors.map(doc => {
                        const match = matchResults?.find(m => m.id === doc.id);
                        return (
                            <DoctorCard 
                            key={doc.id} 
                            doctor={doc} 
                            matchReason={match?.matchReason}
                            onBook={onBook}
                            />
                        );
                        })}
                    </div>
                    )}
                </div>
            </>
        ) : (
            <ClinicalSearch />
        )}
      </div>
    </div>
  );
};

export default Home;
