import React, { useState } from 'react';
import { BookOpen, ExternalLink, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { askClinicalQuestion, ClinicalResponse } from '../services/geminiService';

const ClinicalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClinicalResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);
    try {
      const response = await askClinicalQuestion(query);
      setResult(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input Area */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <BookOpen className="h-5 w-5 text-indigo-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-32 py-4 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            placeholder="Ask a clinical question (e.g., 'Treatment guidelines for acute otitis media')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button
              type="submit"
              disabled={isLoading || !query}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all h-10 my-auto"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Ask AI'}
            </button>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-slate-400">
           Powered by Gemini 2.5 • Grounded in Medical Literature
        </div>
      </form>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto mt-12">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-20 bg-slate-100 rounded-lg"></div>
            <div className="h-20 bg-slate-100 rounded-lg"></div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-left">
          <div className="prose prose-blue max-w-none mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <div className="bg-indigo-100 p-1.5 rounded-md mr-3">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                </div>
                Clinical Answer
            </h3>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {result.answer}
            </div>
          </div>

          {result.sources.length > 0 && (
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                <ExternalLink className="w-3 h-3 mr-2" />
                Sources & Citations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col p-3 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-sm hover:border-indigo-300 hover:bg-white transition-all group"
                  >
                    <span className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 line-clamp-1 mb-0.5">
                      {source.title}
                    </span>
                    <span className="text-xs text-slate-400 truncate flex items-center">
                      {new URL(source.uri).hostname}
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1 group-hover:translate-x-0" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
            <p>
              AI-generated content. Verify with clinical guidelines.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalSearch;
