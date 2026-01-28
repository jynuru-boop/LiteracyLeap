'use client';

import Link from 'next/link';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

const topics = ['인물', '과학', '사회', '경제', '역사'];

export default function ReadingTopicPage() {
  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
          <header className="mb-6">
            <h1 className="text-3xl font-black text-gray-800">주제 선택하기</h1>
            <p className="text-muted-foreground mt-1">관심 있는 주제를 선택하여 독해 문제를 풀어보세요!</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <Link key={topic} href={`/dashboard/challenge/reading/start?topic=${topic}`} className="block group">
                <Card className="hover:bg-primary/5 hover:shadow-lg transition-all h-full">
                  <CardHeader className="flex flex-row items-center justify-between p-6">
                    <CardTitle className="text-xl font-bold">{topic}</CardTitle>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
