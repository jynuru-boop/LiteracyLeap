import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { notFound } from 'next/navigation';
import { generateDailyChallenge } from '@/ai/flows/generate-daily-challenge';
import ReadingChallenge from '../components/reading-challenge';
import VocabularyChallenge from '../components/vocabulary-challenge';
import SpellingChallenge from '../components/spelling-challenge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ChallengeCategoryPage({ params }: { params: { category: string } }) {
  const categoryNames: { [key: string]: string } = {
    reading: '독해력 쑥쑥',
    vocabulary: '사자성어와 속담',
    spelling: '우리말 맞춤법'
  };

  const title = categoryNames[params.category];

  if (!title) {
    notFound();
  }

  let challenge;
  let error = null;

  try {
    // Generate challenge on every request for now.
    // In a real app, this should be generated once a day and stored.
    challenge = await generateDailyChallenge({ studentLevel: 1 });
  } catch (e) {
     console.error('Failed to generate challenge:', e);
     error = '챌린지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  let challengeComponent;
  if (challenge) {
    switch (params.category) {
      case 'reading':
        challengeComponent = <ReadingChallenge challenge={challenge.readingComprehension} />;
        break;
      case 'vocabulary':
        challengeComponent = <VocabularyChallenge challenge={challenge.vocabulary} />;
        break;
      case 'spelling':
        challengeComponent = <SpellingChallenge challenge={challenge.spelling} />;
        break;
      default:
        notFound();
    }
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
            {error && (
              <Card className="mt-6">
                  <CardHeader>
                      <CardTitle>오류 발생 😢</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground">{error}</p>
                  </CardContent>
              </Card>
            )}
            {challengeComponent}
        </div>
      </SidebarInset>
    </>
  );
}
