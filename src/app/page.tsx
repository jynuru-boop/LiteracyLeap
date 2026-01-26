import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import DailyChallenge from '@/app/components/daily-challenge';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col text-foreground">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <DailyChallenge />
      </SidebarInset>
    </div>
  );
}
