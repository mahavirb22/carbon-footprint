import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { getSmartResponse, calculateFootprint } from '../utils/smartEngine';
import { ChatView } from '../components/chat/ChatView';
import { CalculatorView } from '../components/calculator/CalculatorView';
import { QuizView } from '../components/quiz/QuizView';

// ─── Environment Mocks ────────────────────────────────────────────────────────
beforeAll(() => {
  vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
});

afterAll(() => {
  vi.unstubAllEnvs();
});

// ─── Mock Zustand store ───────────────────────────────────────────────────────
vi.mock('../store/appStore', () => ({
  useAppStore: (sel: (s: unknown) => unknown) => {
    const state = {
      region: 'global',
      language: 'en',
      messages: [],
      isTyping: false,
      addUserMessage: vi.fn(),
      addAssistantMessage: vi.fn(),
      setTyping: vi.fn(),
      clearMessages: vi.fn(),
      activeView: 'chat',
      setActiveView: vi.fn(),
      quizScore: 0,
      quizTotal: 0,
      incrementScore: vi.fn(),
      resetQuiz: vi.fn(),
      setRegion: vi.fn(),
      setLanguage: vi.fn(),
      footprintData: { transport: { drive_gas_car: 10 }, food: {}, energy: {}, shopping: {} },
      setFootprintActivity: vi.fn(),
    };
    return sel ? sel(state) : state;
  },
}));

vi.mock('../hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    isTyping: false,
    send: vi.fn(),
    clearMessages: vi.fn(),
  }),
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: async () => ({
        response: { text: () => 'Mocked Gemini response' }
      })
    })
  }))
}));

// ─── Smart Engine Tests ───────────────────────────────────────────────────────
describe('smartEngine — logic & intent detection', () => {
  it('calculates footprint correctly from user data', () => {
    const footprintData = {
      transport: { drive_gas_car: 100 }, // 100 * 0.192 = 19.2
      food: {},
      energy: {},
      shopping: {}
    };
    const emissions = calculateFootprint(footprintData);
    expect(emissions.transport).toBeCloseTo(19.2);
  });

  it('responds to greeting locally (fast path)', async () => {
    const r = await getSmartResponse('hello there', 'global', { transport: {}, food: {}, energy: {}, shopping: {} });
    expect(r.toLowerCase()).toContain('hello');
  });

  it('responds to thanks locally (fast path)', async () => {
    const r = await getSmartResponse('thanks a lot', 'global', { transport: {}, food: {}, energy: {}, shopping: {} });
    expect(r.toLowerCase()).toContain('welcome');
  });

  it('calls Gemini for complex queries', async () => {
    const r = await getSmartResponse('how to reduce meat consumption?', 'global', { transport: {}, food: {}, energy: {}, shopping: {} });
    expect(r).toBe('Mocked Gemini response');
  });
});

// ─── ChatView Component Tests ─────────────────────────────────────────────────
describe('ChatView', () => {
  it('renders heading', () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /ask the carbon assistant/i })).toBeInTheDocument();
  });

  it('renders suggestion chips', () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    expect(screen.getByRole('group', { name: /suggested questions/i })).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('send button enables when user types', async () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    await userEvent.type(screen.getByLabelText(/your question/i), 'how to reduce impact?');
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('has accessible chat log region', () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    expect(screen.getByRole('log', { name: /chat conversation/i })).toBeInTheDocument();
  });
});

// ─── CalculatorView Component Tests ───────────────────────────────────────────
describe('CalculatorView', () => {
  it('renders heading', () => {
    render(<MemoryRouter><CalculatorView /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /carbon calculator/i })).toBeInTheDocument();
  });

  it('calculates total footprint correctly from mock store data', () => {
    render(<MemoryRouter><CalculatorView /></MemoryRouter>);
    // mock state: transport.drive_gas_car = 10 -> 10 * 0.192 = 1.92
    // Output text is "1.9 kg CO₂e"
    expect(screen.getAllByText(/1.9/)[0]).toBeInTheDocument();
  });
});

// ─── QuizView Component Tests ─────────────────────────────────────────────────
describe('QuizView', () => {
  it('renders heading', () => {
    render(<MemoryRouter><QuizView /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /carbon quiz/i })).toBeInTheDocument();
  });

  it('has accessible radio group for answers', () => {
    render(<MemoryRouter><QuizView /></MemoryRouter>);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });
});
