import { Message } from 'ai'
import { create } from 'zustand'

interface PearlChatStoreState {
  chatId: number | null
  messages: Message[]
  currentCode: string
  currentLanguage: string
  isSolutionUnlocked: boolean
  setChatId: (id: number) => void
  setMessages: (messages: Message[]) => void
  addMessage: (msg: Message) => void
  setCurrentCode: (code: string) => void
  setCurrentLanguage: (lang: string) => void
  setIsSolutionUnlocked: (val: boolean) => void
  reset: () => void
}

export const usePearlChatStore = create<PearlChatStoreState>((set) => ({
  chatId: null,
  messages: [],
  currentCode: '',
  currentLanguage: 'javascript',
  isSolutionUnlocked: false,
  setChatId: (id) => set({ chatId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setCurrentCode: (code) => set({ currentCode: code }),
  setCurrentLanguage: (lang) => set({ currentLanguage: lang }),
  setIsSolutionUnlocked: (val) => set({ isSolutionUnlocked: val }),
  reset: () =>
    set({
      chatId: null,
      messages: [],
      currentCode: '',
      currentLanguage: 'javascript',
      isSolutionUnlocked: false,
    }),
}))
