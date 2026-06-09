import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { getSmartResponse, getTypingDelay } from '../utils/smartEngine';

export function useChat() {
  const {
    messages, isTyping, region, footprintData,
    addUserMessage, addAssistantMessage, setTyping, clearMessages,
  } = useAppStore();

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isTyping) return;

      addUserMessage(trimmed);
      setTyping(true);

      const response = await getSmartResponse(trimmed, region, footprintData);
      const delay = getTypingDelay(response);

      setTimeout(() => {
        addAssistantMessage(response);
      }, delay);
    },
    [isTyping, region, footprintData, addUserMessage, addAssistantMessage, setTyping],
  );

  return { messages, isTyping, send, clearMessages };
}
