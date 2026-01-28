'use client';

import Link from 'next/link';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const topics = [
    { name: '인물', bgColor: 'bg-blue-100/70', textColor: 'text-blue-800' },
    { name: '과학', bgColor: 'bg-teal-100/70', textColor: 'text-teal-800' },
    { name: '사회', bgColor: 'bg-amber-100/70', textColor: 'text-amber-800' },
    { name: '경제', bgColor: 'bg-purple-100/70', textColor: 'text-purple-800' },
    { name: '역사', bgColor: 'bg-rose-100/70', textColor: 'text-rose-800' },
];

export default function ReadingTopicPage() {
  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-black text-gray-800">주제 선택하기</h1>
            <p className="text-muted-foreground mt-1">관심 있는 주제를 선택하여 독해 문제를 풀어보세요!</p>
          </header>
          <main className="flex flex-grow items-center justify-center">
            <div className="grid w-full max-w-2xl grid-cols-2 gap-5 sm:grid-cols-3">
              {topics.map((topic) => (
                <Link key={topic.name} href={`/dashboard/challenge/reading/start?topic=${topic.name}`} className="block group">
                  <Card className={cn(
                      'rounded-2xl border-0 shadow-md transition-all group-hover:-translate-y-1 group-hover:shadow-xl',
                      topic.bgColor
                  )}>
                    <CardHeader className="flex h-32 flex-row items-center justify-between p-6">
                      <CardTitle className={cn("text-xl font-bold", topic.textColor)}>{topic.name}</CardTitle>
                      <ChevronRight className={cn("h-6 w-6 transition-transform group-hover:translate-x-1", topic.textColor, "opacity-70")} />
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </SidebarInset>
    </>
  );
}
