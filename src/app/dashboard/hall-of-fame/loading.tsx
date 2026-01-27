import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function HallOfFameLoading() {
  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <header className="mb-6">
            <h1 className="text-3xl font-black text-gray-800">명예의 전당 🏆</h1>
            <p className="text-muted-foreground mt-1">가장 높은 점수를 얻은 친구들을 확인해보세요!</p>
          </header>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-36 rounded-md" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full rounded-lg" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-32 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
