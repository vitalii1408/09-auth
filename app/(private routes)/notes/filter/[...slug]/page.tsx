import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import { OG_IMAGE, SITE_URL } from '@/lib/seo';
import type { NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

export const dynamic = 'force-dynamic';

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug[0];
  const label = filter === 'all' ? 'All notes' : `${filter} notes`;
  const description =
    filter === 'all'
      ? 'Browse all notes in NoteHub.'
      : `Browse notes tagged "${filter}" in NoteHub.`;

  return {
    title: `${label} | NoteHub`,
    description,
    openGraph: {
      title: `${label} | NoteHub`,
      description,
      url: `${SITE_URL}/notes/filter/${filter}`,
      images: [OG_IMAGE],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const filter = slug[0];

  if (filter !== 'all' && !tags.includes(filter as NoteTag)) {
    notFound();
  }

  const tag = filter === 'all' ? undefined : (filter as NoteTag);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
