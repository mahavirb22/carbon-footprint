import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { useChat } from '../../hooks/useChat';
import type { ChatMessage } from '../../types';

const SUGGESTIONS = [
  'How do I calculate my footprint?',
  'What are some simple reduction tips?',
  'Is an electric car worth it?',
  'How does a vegan diet help?'
];

export function ChatView() {
  const { messages, isTyping, send, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    send(input);
    setInput('');
  }

  return (
    <div className="flex flex-col h-full bg-brand-50 bg-mesh relative">
      <header className="flex-shrink-0 px-6 py-4 bg-white/80 backdrop-blur-md border-b flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-sm font-bold text-gray-900">Ask the Carbon Assistant</h1>
          <p className="text-xs text-gray-500">Your personalized AI footprint guide</p>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={clearMessages}
            aria-label="Clear chat history"
            className="text-xs text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        )}
      </header>

      <div 
        role="log" 
        aria-live="polite" 
        aria-label="Chat conversation" 
        aria-relevant="additions"
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
      >
        {messages.length === 0 && (
          <div className="text-center mt-10 animate-slide-up">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Hello! I'm your free carbon guide 👋</h2>
            <p className="text-gray-600 mb-8">Ask me anything about calculating or reducing your footprint.</p>
            
            <div role="group" aria-label="Suggested questions" className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  aria-label={`Ask: ${s}`}
                  onClick={() => { send(s); inputRef.current?.focus(); }}
                  className="px-4 py-2 bg-white border border-brand-200 text-brand-700 rounded-full text-sm font-medium hover:bg-brand-50 transition-colors shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="flex-shrink-0 p-4 bg-white border-t">
        <form onSubmit={handleSubmit} aria-label="Send a message" className="max-w-4xl mx-auto flex gap-3">
          <label htmlFor="chat-input" className="sr-only">Type your question</label>
          <textarea
            id="chat-input"
            ref={inputRef}
            aria-label="Your question"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask about your footprint..."
            className="flex-1 min-h-[44px] max-h-32 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="btn-primary flex-shrink-0 h-11 px-5 flex items-center justify-center min-w-[80px]"
          >
            <span>Send</span>
            <span aria-hidden="true" className="ml-1">↑</span>
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div 
      role="article" 
      aria-label={isUser ? 'Your message' : 'Assistant response'}
      className={clsx('flex w-full animate-slide-up', isUser ? 'justify-end' : 'justify-start')}
    >
      <div 
        className={clsx(
          'max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm text-sm',
          isUser ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-white border text-gray-800 rounded-tl-sm'
        )}
      >
        <div className={clsx('prose prose-sm max-w-none', isUser ? 'prose-invert text-white' : 'text-gray-800')}>
          {isUser ? <p className="m-0 whitespace-pre-wrap">{msg.content}</p> : <ReactMarkdown>{msg.content}</ReactMarkdown>}
        </div>
        <time dateTime={msg.timestamp.toISOString()} className={clsx('block mt-2 text-[10px] opacity-70', isUser ? 'text-right' : 'text-left')}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-slide-up" role="status" aria-label="Assistant is typing">
      <span className="sr-only">Assistant is typing</span>
      <div className="bg-white border rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0ms]" />
        <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:150ms]" />
        <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
