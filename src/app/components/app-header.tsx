'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const user = {
    name: '즐거운 학생',
    badge: '씨앗',
    points: 0,
    badgeImageId: 'badge-seedling',
  };

  const badgeImage = PlaceHolderImages.find((img) => img.id === user.badgeImageId);
  
  const handleLogout = () => {
    router.push('/');
  };

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
