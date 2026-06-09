export type RegionCode = 'global' | 'us' | 'eu' | 'uk' | 'au';
export type ViewId = 'dashboard' | 'calculator' | 'timeline' | 'quiz' | 'chat' | 'next-step' | 'lifecycle';
export type FootprintCategory = 'transport' | 'food' | 'energy' | 'shopping';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  emissionFactor: number;
  unit: string;
  tips: string[];
}

export interface CategoryData {
  id: FootprintCategory;
  title: string;
  description: string;
  activities: Activity[];
  reductionTips: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'done' | 'active' | 'upcoming';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NextStepAction {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface CarbonData {
  region: RegionCode;
  categories: CategoryData[];
  timeline: TimelineEvent[];
  quiz: QuizQuestion[];
  nextSteps: NextStepAction[];
}
