import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default function ChallengeCategoryPage({ params }: { params: { category: string } }) {
  const categoryNames: { [key: string]: string } = {
    reading: '독해력 쑥쑥',
    vocabulary: '사자성어와 속담',
    spelling: '우리말 맞춤법'
  };

  const title = categoryNames[params.category];

  if (!title) {
    notFound();
  }

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-black text-gray-800">{title}</h1>
                <p className="text-muted-foreground mt-1">오늘의 챌린지에 오신 것을 환영합니다!</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>준비 중 🚧</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">이 챌린지는 현재 준비 중입니다. 곧 멋진 모습으로 만나요!</p>
                </CardContent>
            </Card>
        </div>
      </SidebarInset>
    </>
  );
}
