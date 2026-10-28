'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  // Refresh so the proxy re-checks cookies when user lands on auth pages.
  useEffect(() => {
    router.refresh();
  }, [router]);

  return children;
}
