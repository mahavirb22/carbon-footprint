import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { QUIZ_QUESTIONS } from '../../data/carbonData';
import clsx from 'clsx';

export function QuizView() {
  const { quizScore, incrementScore, resetQuiz } = useAppStore();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [complete, setComplete] = useState(false);

  const q = QUIZ_QUESTIONS[idx];

  function handleAnswer(i: number) {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    incrementScore(i === q.correctIndex);
  }

  function handleNext() {
    if (idx < QUIZ_QUESTIONS.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setComplete(true);
    }
  }

  function handleRestart() {
    resetQuiz();
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setComplete(false);
  }

  if (complete) {
    const pct = Math.round((quizScore / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-brand-50 animate-scale-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
        <h2 className="text-lg text-gray-600 mb-8">
          {pct === 100 ? 'Carbon Expert!' : pct >= 50 ? 'Good effort!' : 'Keep learning!'}
        </h2>
        
        <div 
          role="progressbar" 
          aria-valuenow={pct} 
          aria-valuemin={0} 
          aria-valuemax={100}
          className="w-40 h-40 rounded-full border-8 border-brand-100 flex items-center justify-center relative mb-8 shadow-card bg-white"
        >
          <div className="text-4xl font-bold text-brand-600">{pct}%</div>
        </div>
        
        <p className="text-gray-700 mb-8 font-medium">You scored {quizScore} out of {QUIZ_QUESTIONS.length}</p>
        
        <button onClick={handleRestart} className="btn-primary px-8 py-3">Take again</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-brand-50">
      <header className="px-6 py-4 bg-white border-b flex-shrink-0 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Carbon Quiz</h1>
        <div 
          role="progressbar" 
          aria-valuenow={idx + 1} 
          aria-valuemin={1} 
          aria-valuemax={QUIZ_QUESTIONS.length}
          aria-label={`Question ${idx + 1} of ${QUIZ_QUESTIONS.length}`}
          className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full"
        >
          {idx + 1} / {QUIZ_QUESTIONS.length}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card animate-slide-up">
          <h2 id="quiz-q" className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
            {q.question}
          </h2>

          <div role="radiogroup" aria-labelledby="quiz-q" className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correctIndex;
              
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ";
              if (!revealed) {
                btnClass += "border-gray-200 hover:border-brand-400 hover:bg-brand-50 focus-visible:border-brand-500";
              } else if (isCorrect) {
                btnClass += "border-green-500 bg-green-50 text-green-900";
              } else if (isSelected && !isCorrect) {
                btnClass += "border-red-400 bg-red-50 text-red-900 opacity-70";
              } else {
                btnClass += "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
              }

              return (
                <button
                  key={i}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleAnswer(i)}
                  disabled={revealed}
                  className={btnClass}
                >
                  <span aria-hidden="true" className={clsx(
                    "w-6 h-6 flex items-center justify-center rounded-full border-2 text-xs font-bold shrink-0",
                    revealed && isCorrect ? "bg-green-500 border-green-500 text-white" :
                    revealed && isSelected ? "bg-red-400 border-red-400 text-white" :
                    "border-gray-300 text-gray-500"
                  )}>
                    {revealed && isCorrect ? '✓' : revealed && isSelected ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-medium text-sm md:text-base">{opt}</span>
                </button>
              );
            })}
          </div>

          {revealed && (
            <div role="alert" aria-live="polite" className="mt-8 animate-slide-up">
              <div className={clsx("p-4 rounded-xl border", selected === q.correctIndex ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200")}>
                <p className={clsx("font-bold mb-2", selected === q.correctIndex ? "text-green-800" : "text-blue-800")}>
                  {selected === q.correctIndex ? '✓ Correct!' : '💡 Here\'s why:'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
              </div>
              <button onClick={handleNext} className="btn-primary w-full py-3 mt-6 text-lg">
                {idx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
