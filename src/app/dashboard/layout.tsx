import { SidebarProvider } from '@/components/ui/sidebar';
import { UserProvider } from '@/app/context/user-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <UserProvider>{children}</UserProvider>
    </SidebarProvider>
  );
}
