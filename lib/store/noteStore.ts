import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CreateNoteParams } from '@/lib/api/clientApi';

export const initialDraft: CreateNoteParams = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteStore {
  draft: CreateNoteParams;
  setDraft: (note: Partial<CreateNoteParams>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
