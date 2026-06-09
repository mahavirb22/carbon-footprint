import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewId, RegionCode, ChatMessage } from '../types';

function uid(): string {
  return Math.random().toString(36).slice(2, 11);
}

export interface UserFootprintData {
  transport: Record<string, number>;
  food: Record<string, number>;
  energy: Record<string, number>;
  shopping: Record<string, number>;
}

interface AppState {
  activeView: ViewId;
  setActiveView: (v: ViewId) => void;

  region: RegionCode;
  setRegion: (r: RegionCode) => void;
  language: string;
  setLanguage: (l: string) => void;

  messages: ChatMessage[];
  isTyping: boolean;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  setTyping: (v: boolean) => void;
  clearMessages: () => void;

  quizScore: number;
  quizTotal: number;
  incrementScore: (correct: boolean) => void;
  resetQuiz: () => void;

  footprintData: UserFootprintData;
  setFootprintActivity: (category: keyof UserFootprintData, activityId: string, value: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeView: 'chat',
      setActiveView: (activeView) => set({ activeView }),

      region: 'global',
      setRegion: (region) => set({ region }),

      language: 'en',
      setLanguage: (language) => set({ language }),

      messages: [],
      isTyping: false,
      addUserMessage: (content) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { id: uid(), role: 'user', content, timestamp: new Date() },
          ],
        })),
      addAssistantMessage: (content) =>
        set((s) => ({
          isTyping: false,
          messages: [
            ...s.messages,
            { id: uid(), role: 'assistant', content, timestamp: new Date() },
          ],
        })),
      setTyping: (isTyping) => set({ isTyping }),
      clearMessages: () => set({ messages: [] }),

      quizScore: 0,
      quizTotal: 0,
      incrementScore: (correct) =>
        set((s) => ({
          quizScore: s.quizScore + (correct ? 1 : 0),
          quizTotal: s.quizTotal + 1,
        })),
      resetQuiz: () => set({ quizScore: 0, quizTotal: 0 }),

      footprintData: {
        transport: {},
        food: {},
        energy: {},
        shopping: {},
      },
      setFootprintActivity: (category, activityId, value) =>
        set((s) => ({
          footprintData: {
            ...s.footprintData,
            [category]: {
              ...s.footprintData[category],
              [activityId]: value,
            },
          },
        })),
    }),
    {
      name: 'carbon-iq-v1',
      partialize: (s) => ({
        region: s.region,
        language: s.language,
        quizScore: s.quizScore,
        quizTotal: s.quizTotal,
        footprintData: s.footprintData,
      }),
    },
  ),
);
