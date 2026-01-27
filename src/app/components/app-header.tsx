'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Home, Award, Gift, LogOut } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUserContext } from '@/app/context/user-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppHeader() {
  const router = useRouter();
  const auth = useAuth();
  const pathname = usePathname();
  const { user, loading } = useUserContext();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  const badgeImage = user ? PlaceHolderImages.find((img) => img.id === user.badgeImageId) : null;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1.5">
            <Book className="text-primary-foreground h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">문해력쑥쑥</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
              <Link href="/dashboard">
                <Home />
                <span>메인 화면</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Book />
              <span>나의 기록</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Award />
              <span>명예 전당</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Gift />
              <span>보물 창고</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <Card className="bg-sidebar-accent/50 border-0">
          <CardContent className="p-3">
             {loading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="text-sm space-y-1">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {badgeImage && (
                  <Image
                    src={badgeImage.imageUrl}
                    alt={`${user.badge} Badge`}
                    width={40}
                    height={40}
                    data-ai-hint={badgeImage.imageHint}
                    className="rounded-full"
                  />
                )}
                <div className="text-sm">
                  <p className="font-bold text-sidebar-accent-foreground">{user.badge}</p>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground font-semibold">⭐ {user.points}점</p>
                </div>
              </div>
            ) : (
                <div className="text-sm text-center text-muted-foreground">
                    로그인 정보 없음
                </div>
            )}
          </CardContent>
        </Card>
        <Button variant="ghost" className="justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>로그아웃 할래요</span>
        </Button>
      </SidebarFooter>
    </>
  );
}
