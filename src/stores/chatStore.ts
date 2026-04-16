import { create } from 'zustand';
import { ChatMessage } from '../types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  setIsLoading: (loading: boolean) => void;
}

const welcomeMessage = '您好！我是星卷(AstroScroll) AI助手，可以帮您分析历史文献、解答历史问题、梳理人物关系。请选择一篇文献或直接向我提问。';

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    }
  ],
  isLoading: false,

  addMessage: (role, content) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: Date.now().toString(),
        role,
        content,
        timestamp: new Date()
      }
    ]
  })),

  clearMessages: () => set({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }
    ]
  }),

  setIsLoading: (loading) => set({ isLoading: loading })
}));
