import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ChatView } from './components/chat/ChatView';
import { CalculatorView } from './components/calculator/CalculatorView';
import { TimelineView } from './components/timeline/TimelineView';
import { QuizView } from './components/quiz/QuizView';
import { NextStepView } from './components/layout/NextStepView';
import { LifecycleView } from './components/lifecycle/LifecycleView';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/chat" replace />} />
        <Route path="chat" element={<ChatView />} />
        <Route path="calculator" element={<CalculatorView />} />
        <Route path="timeline" element={<TimelineView />} />
        <Route path="quiz" element={<QuizView />} />
        <Route path="next-step" element={<NextStepView />} />
        <Route path="lifecycle" element={<LifecycleView />} />
      </Route>
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}
