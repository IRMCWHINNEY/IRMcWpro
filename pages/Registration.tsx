import React, { useState } from 'react';
import { UserPlus, Sparkles, Loader2 } from 'lucide-react';
import { generateDoctorBio } from '../services/geminiService';
import { Specialty, Doctor } from '../types';

interface RegistrationProps {
  onRegister: (doctor: Doctor) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: Specialty.GENERAL_PRACTITIONER,
    yearsExperience: 0,
    location: '',
    keywords: '',
    bio: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBio = async () => {
    if (!formData.keywords || !formData.name) return;
    
    setIsGenerating(true);
    try {
      const bio = await generateDoctorBio(
        formData.name,
        formData.specialty,
        formData.yearsExperience,
        formData.keywords
      );
      setFormData(prev => ({ ...prev, bio }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoctor: Doctor = {
      id: crypto.randomUUID(),
      name: formData.name,
      specialty: formData.specialty,
      bio: formData.bio,
      location: formData.location,
      yearsExperience: formData.yearsExperience,
      rating: 5.0, // Start with 5 stars
      imageUrl: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`,
      availability: [], // Empty initially
      calendarSynced: false
    };
    onRegister(newDoctor);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Join MediSync</h1>
        <p className="mt-2 text-slate-500">Connect with patients and manage your practice intelligently.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Dr. Jane Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
                value={formData.specialty}
                onChange={e => setFormData({...formData, specialty: e.target.value as Specialty})}
              >
                {Object.values(Specialty).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="City, State"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Years Experience</label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.yearsExperience}
                onChange={e => setFormData({...formData, yearsExperience: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700">Professional Bio</label>
              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-medium">AI-Powered</span>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
               <label className="block text-xs font-medium text-slate-500 mb-2">
                 Bio Helper: Enter a few keywords about your focus (e.g., "holistic, sports injuries, kids")
               </label>
               <div className="flex gap-2">
                 <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Keywords for AI generation..."
                  value={formData.keywords}
                  onChange={e => setFormData({...formData, keywords: e.target.value})}
                 />
                 <button
                  type="button"
                  onClick={handleGenerateBio}
                  disabled={isGenerating || !formData.keywords}
                  className="bg-white border border-indigo-200 text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 disabled:opacity-50 flex items-center shadow-sm"
                 >
                   {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4 mr-1" />}
                   Generate
                 </button>
               </div>
            </div>

            <textarea
              required
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Your professional biography..."
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-sky-600 transition-colors shadow-md shadow-primary/20 flex items-center justify-center"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
