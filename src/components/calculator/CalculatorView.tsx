import { useAppStore } from '../../store/appStore';
import { CATEGORIES } from '../../data/carbonData';
import { calculateFootprint } from '../../utils/smartEngine';
import clsx from 'clsx';

export function CalculatorView() {
  const { footprintData, setFootprintActivity } = useAppStore();
  const emissions = calculateFootprint(footprintData);
  const totalEmissions = Object.values(emissions).reduce((a, b) => a + b, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-brand-50">
      <header className="px-6 py-4 bg-white border-b flex-shrink-0 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Carbon Calculator</h1>
        <p className="text-sm text-gray-600">Track your activities to estimate your footprint</p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-card text-center animate-slide-up">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Footprint</h2>
          <div className="text-4xl font-bold text-brand-600 mt-2">
            {totalEmissions.toFixed(1)} <span className="text-lg text-gray-500">kg CO₂e</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CATEGORIES.map((category, idx) => (
            <div key={category.id} className={clsx("bg-white rounded-2xl shadow-soft p-5 animate-slide-up", `[animation-delay:${idx * 100}ms]`)}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
                <span className="text-sm font-medium px-2.5 py-1 bg-brand-100 text-brand-700 rounded-full">
                  {(emissions[category.id] || 0).toFixed(1)} kg
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{category.description}</p>
              
              <div className="space-y-4">
                {category.activities.map(activity => (
                  <div key={activity.id} className="flex flex-col gap-2">
                    <label htmlFor={`act-${activity.id}`} className="text-sm font-medium text-gray-700 flex justify-between">
                      <span>{activity.title}</span>
                      <span className="text-gray-400 text-xs">({activity.unit})</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        id={`act-${activity.id}`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={footprintData[category.id]?.[activity.id] || ''}
                        onChange={(e) => setFootprintActivity(category.id, activity.id, parseFloat(e.target.value) || 0)}
                        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
