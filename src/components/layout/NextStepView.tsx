import { useNavigate } from 'react-router-dom';
import { NEXT_STEPS } from '../../data/carbonData';
import { useAppStore } from '../../store/appStore';
import { calculateFootprint } from '../../utils/smartEngine';
import { useChat } from '../../hooks/useChat';
import clsx from 'clsx';

export function NextStepView() {
  const navigate = useNavigate();
  const { footprintData } = useAppStore();
  const { send } = useChat();
  const emissions = calculateFootprint(footprintData);
  
  let highestCat = 'general';
  let max = 0;
  Object.entries(emissions).forEach(([cat, val]) => {
    if (val > max) { max = val; highestCat = cat; }
  });

  return (
    <div className="h-full flex flex-col bg-brand-50">
      <header className="px-6 py-4 bg-white border-b flex-shrink-0 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Your Action Plan</h1>
        <p className="text-sm text-gray-600">Personalized steps to reduce your impact</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-3xl mx-auto w-full">
        {max > 0 && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl animate-slide-up text-amber-900">
            <h2 className="font-bold mb-1">Insight</h2>
            <p className="text-sm">Based on your calculator inputs, your highest emission area is <strong>{highestCat.charAt(0).toUpperCase() + highestCat.slice(1)}</strong> ({max.toFixed(1)} kg CO₂e). Consider focusing your efforts here!</p>
          </div>
        )}

        <ol aria-label="Your personalised action plan" className="space-y-4">
          {NEXT_STEPS.map((step, idx) => (
            <li key={step.id} className={clsx("bg-white rounded-2xl p-5 shadow-soft border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up", `[animation-delay:${idx * 100}ms]`)}>
              <div>
                <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">Step {idx + 1}</div>
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              </div>
              <button
                aria-label={`Ask AI: ${step.prompt}`}
                onClick={() => {
                  send(step.prompt);
                  navigate('/chat');
                }}
                className="btn-primary py-2 px-4 whitespace-nowrap text-sm mt-2 md:mt-0"
              >
                Ask Assistant →
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
