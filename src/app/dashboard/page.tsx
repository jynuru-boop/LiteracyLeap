import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import DailyChallenge from '@/app/components/daily-challenge';

export default function DashboardPage() {
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
