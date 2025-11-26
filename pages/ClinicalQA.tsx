import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, AlertCircle, ArrowRight } from 'lucide-react';
import { askClinicalQuestion, ClinicalResponse } from '../services/geminiService';

const ClinicalQA: React.FC = () => {
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

  const exampleQueries = [
    "What are the latest guidelines for treating hypertension in elderly patients?",
    "Efficacy of JAK inhibitors in atopic dermatitis",
    "Differential diagnosis for acute right upper quadrant pain"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
          <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-sm font-semibold text-blue-800">MediSync Clinical Evidence</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Evidence-based answers for professionals
        </h1>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto">
          Ask complex clinical questions and get answers grounded in the latest medical literature and web sources.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8">
        <form onSubmit={handleSearch} className="p-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 text-slate-900 placeholder-slate-400"
              placeholder="Ask a clinical question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Ask'}
            </button>
          </div>
        </form>
        
        {!result && !isLoading && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Try asking about:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(q)}
                  className="text-sm text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-slate-100 rounded-lg"></div>
            <div className="h-24 bg-slate-100 rounded-lg"></div>
          </div>
        </div>
      )}

      {result && (
        <div className="animate-fade-in">
          <div className="prose prose-blue max-w-none mb-10">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Answer</h3>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {result.answer}
            </div>
          </div>

          {result.sources.length > 0 && (
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Sources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all group"
                  >
                    <span className="font-medium text-slate-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                      {source.title}
                    </span>
                    <span className="text-xs text-slate-400 truncate flex items-center">
                      {new URL(source.uri).hostname}
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start text-sm text-amber-800">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <p>
              This content is generated by AI using search grounding. It is intended for informational purposes for medical professionals and should not replace clinical judgment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalQA;