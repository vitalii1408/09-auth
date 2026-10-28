import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { api } from './api';
import type { FetchNotesParams, FetchNotesResponse } from './clientApi';

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async ({
  page,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search.trim() && { search: search.trim() }),
      ...(tag && { tag }),
    },
    headers: await getCookieHeader(),
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: await getCookieHeader(),
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me', {
    headers: await getCookieHeader(),
  });
  return data;
};

// Returns the full response so proxy can forward refreshed Set-Cookie headers.
export const checkSession = async (): Promise<AxiosResponse> => {
  return api.get('/auth/session', {
    headers: await getCookieHeader(),
  });
};
