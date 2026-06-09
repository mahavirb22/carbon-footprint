import { TIMELINE } from '../../data/carbonData';
import clsx from 'clsx';

export function TimelineView() {
  return (
    <div className="h-full flex flex-col bg-brand-50">
      <header className="px-6 py-4 bg-white border-b flex-shrink-0 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Climate Timeline</h1>
        <p className="text-sm text-gray-600">Key milestones in global climate action</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-2xl mx-auto w-full">
        <ol aria-label="Climate action timeline" className="relative border-l-2 border-brand-200 ml-4 space-y-8">
          {TIMELINE.map((event, idx) => (
            <li key={event.id} className={clsx("mb-8 pl-8 relative animate-slide-up", `[animation-delay:${idx * 150}ms]`)}>
              <div 
                className={clsx(
                  'absolute w-4 h-4 rounded-full -left-[9px] top-1.5 border-2 border-white shadow-sm',
                  event.status === 'done' ? 'bg-brand-500' : 
                  event.status === 'active' ? 'bg-amber-500' : 'bg-gray-300'
                )}
                aria-hidden="true"
              />
              <time dateTime={event.date} className="block mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
                {event.date}
              </time>
              <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                {event.title}
                <span className={clsx(
                  'text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase',
                  event.status === 'done' ? 'bg-green-50 text-green-700 border-green-200' :
                  event.status === 'active' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-gray-50 text-gray-600 border-gray-200'
                )}>
                  {event.status}
                </span>
              </h2>
              <p className="text-sm text-gray-600 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-2">
                {event.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
