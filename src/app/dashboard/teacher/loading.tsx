import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function TeacherDashboardLoading() {
  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <header>
            <Skeleton className="h-9 w-48 rounded-md" />
            <Skeleton className="h-5 w-72 mt-2 rounded-md" />
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <Skeleton className="h-7 w-24 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <Skeleton className="h-7 w-36 rounded-md" />
              </CardHeader>
              <CardContent>
                 <Skeleton className="h-24 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
