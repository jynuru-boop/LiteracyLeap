'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useUserContext } from '@/app/context/user-context';
import { generateDailyChallenge, type GenerateDailyChallengeOutput } from '@/ai/flows/generate-daily-challenge';

import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import ReadingChallenge from '../../components/reading-challenge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChallengeLoading from './loading';

type Level = 'easy' | 'medium' | 'hard';

function getLevelFromPoints(points: number): Level {
    if (points < 1000) return 'easy';
    if (points < 1500) return 'medium';
    return 'hard';
}

const levelMapping: {[key in Level]: number} = {
    easy: 1,
    medium: 5,
    hard: 10,
}

function ReadingChallengePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { user } = useUserContext();

  const [challenge, setChallenge] = useState<GenerateDailyChallengeOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedTopic = searchParams.get('topic');

  useEffect(() => {
    if (challenge) {
      setLoading(false);
      return;
    }

    if (!selectedTopic) {
        // This case is handled by the effect below after initial loading
        return;
    }
    
    if (!user) {
      return;
    }

    const getOrGenerateChallenge = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const level = getLevelFromPoints(user.points);

        const newChallenge = await generateDailyChallenge({ 
            studentLevel: levelMapping[level],
            topic: selectedTopic,
        });
        setChallenge(newChallenge);

      } catch (e: any) {
        console.error('Failed to get or generate challenge:', e);
        setError('챌린지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    getOrGenerateChallenge();
  }, [user, selectedTopic, router, challenge]);

  useEffect(() => {
      if (!loading && !selectedTopic) {
          router.replace('/dashboard/challenge/reading');
      }
  }, [loading, selectedTopic, router]);

  if (loading || !user) {
      return <ChallengeLoading />;
  }
  
  if (!selectedTopic) {
      return <ChallengeLoading />; // Show loading while redirecting
  }

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-black text-gray-800">독해력 쑥쑥: {selectedTopic}</h1>
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
            {challenge && <ReadingChallenge challenge={challenge.readingComprehension} />}
        </div>
      </SidebarInset>
    </>
  );
}

export default function ReadingChallengeStartPage() {
    return (
        <Suspense fallback={<ChallengeLoading />}>
            <ReadingChallengePageContent />
        </Suspense>
    );
}
