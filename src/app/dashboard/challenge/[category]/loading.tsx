import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ChallengeLoading() {
  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <header className="mb-6">
            <Skeleton className="h-9 w-48 rounded-md" />
            <Skeleton className="h-5 w-72 mt-2 rounded-md" />
          </header>
          <div className="space-y-4">
             <Card>
              <CardHeader>
                 <Skeleton className="h-6 w-24 rounded-md" />
                 <Skeleton className="h-5 w-full mt-2 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                 <Skeleton className="h-6 w-24 rounded-md" />
                 <Skeleton className="h-5 w-full mt-2 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
