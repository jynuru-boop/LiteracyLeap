import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BarChart, Trophy } from 'lucide-react';

export default function MyRecordsLoading() {
  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <header className="mb-6">
            <h1 className="text-3xl font-black text-gray-800">나의 학습 기록</h1>
            <p className="text-muted-foreground mt-1">나의 성장 과정을 한눈에 확인해보세요!</p>
          </header>
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-48 rounded-md" />
              </CardHeader>
              <CardContent className="min-h-[200px] w-full">
                <div className="flex justify-around items-end h-48">
                    <Skeleton className="w-16 h-24 rounded-t-lg" />
                    <Skeleton className="w-16 h-36 rounded-t-lg" />
                    <Skeleton className="w-16 h-28 rounded-t-lg" />
                </div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500"/>
                    <Skeleton className="h-7 w-32 rounded-md" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
