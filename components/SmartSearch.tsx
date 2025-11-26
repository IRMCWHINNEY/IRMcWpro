import React, { useState } from 'react';
import { Search, Sparkles, Loader2, X } from 'lucide-react';
import { Doctor, AiMatchResult } from '../types';
import { findSpecialist } from '../services/geminiService';

interface SmartSearchProps {
  doctors: Doctor[];
  onResultsFound: (results: AiMatchResult[] | null) => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ doctors, onResultsFound }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await findSpecialist(query, doctors);
      onResultsFound(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    onResultsFound(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-24 py-4 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            placeholder="Describe your symptoms (e.g., 'Sharp pain in my left knee when running')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            {query && (
                <button
                type="button"
                onClick={clearSearch}
                className="p-2 text-slate-400 hover:text-slate-600 mr-1"
                >
                <X className="h-5 w-5" />
                </button>
            )}
            <button
              type="submit"
              disabled={isSearching || !query}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all"
            >
              {isSearching ? <Loader2 className="animate-spin h-5 w-5" /> : 'Find Match'}
            </button>
          </div>
        </div>
      </form>
      <div className="mt-2 text-center text-xs text-slate-400">
        Powered by Gemini AI • Describes symptoms in natural language
      </div>
    </div>
  );
};

export default SmartSearch;
