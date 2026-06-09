import { useState } from 'react';
import clsx from 'clsx';
import { CATEGORIES } from '../../data/carbonData';

export function LifecycleView() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-brand-50">
      <header className="px-6 py-4 bg-white border-b flex-shrink-0 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Carbon Lifecycle</h1>
        <p className="text-sm text-gray-600">Understand the emissions behind everyday actions</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-3xl mx-auto w-full">
        <ol aria-label="Carbon category lifecycles" className="space-y-4">
          {CATEGORIES.map((cat, idx) => {
            const isOpen = expanded === cat.id;
            return (
              <li key={cat.id} className={clsx("bg-white rounded-2xl shadow-soft overflow-hidden animate-slide-up", `[animation-delay:${idx * 100}ms]`)}>
                <button
                  onClick={() => setExpanded(isOpen ? null : cat.id)}
                  aria-expanded={isOpen}
                  aria-controls={`stage-${cat.id}`}
                  className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 focus-visible:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{cat.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                  </div>
                  <span aria-hidden="true" className={clsx('text-xl transition-transform duration-200', isOpen && 'rotate-180')}>
                    ▾
                  </span>
                </button>
                
                <div 
                  id={`stage-${cat.id}`}
                  className={clsx('px-6 transition-all duration-300 ease-in-out', isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden')}
                >
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Reduction Tips</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {cat.reductionTips.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-700">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
