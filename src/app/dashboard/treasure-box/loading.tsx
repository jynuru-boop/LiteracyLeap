import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function TreasureBoxLoading() {
  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full items-center justify-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <Skeleton className="h-9 w-48 mx-auto rounded-md" />
                    <Skeleton className="h-5 w-72 mt-2 mx-auto rounded-md" />
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <Skeleton className="h-64 w-64 rounded-full" />
                    <Skeleton className="h-14 w-40 rounded-full" />
                </CardContent>
            </Card>
        </div>
      </SidebarInset>
    </>
  );
}
