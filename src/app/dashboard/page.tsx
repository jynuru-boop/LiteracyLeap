'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/context/user-context';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import DailyChallenge from '@/app/components/daily-challenge';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role === 'teacher') {
      router.replace('/dashboard/teacher');
    }
  }, [user, loading, router]);

  if (loading || (!loading && user?.role === 'teacher')) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <DailyChallenge />
      </SidebarInset>
    </>
  );
}
