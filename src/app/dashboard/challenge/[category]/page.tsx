'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';

import { useUserContext } from '@/app/context/user-context';
import { generateDailyChallenge, type GenerateDailyChallengeOutput } from '@/ai/flows/generate-daily-challenge';

import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import VocabularyChallenge from '../components/vocabulary-challenge';
import SpellingChallenge from '../components/spelling-challenge';
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

export default function ChallengeCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  
  const { user } = useUserContext();

  const [challenge, setChallenge] = useState<GenerateDailyChallengeOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryNames: { [key: string]: string } = {
    vocabulary: '사자성어와 속담',
    spelling: '우리말 맞춤법'
  };
  const title = categoryNames[category];

  useEffect(() => {
    // If challenge is already loaded, do not refetch. This prevents a full
    // page reload when user points are updated after completing a challenge.
    if (challenge) {
      setLoading(false);
      return;
    }

    if (!user) {
      return;
    }

    const generateNewChallenge = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const level = getLevelFromPoints(user.points);
        const newChallenge = await generateDailyChallenge({ 
            studentLevel: levelMapping[level]
        });
        setChallenge(newChallenge);
      } catch (e: any) {
        console.error('Failed to generate challenge:', e);
        setError('챌린지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    generateNewChallenge();
  }, [user, category, challenge]);

  if (!title) {
    notFound();
  }

  let challengeComponent;
  if (challenge) {
    switch (category) {
      case 'vocabulary':
        challengeComponent = <VocabularyChallenge challenge={challenge.vocabulary} />;
        break;
      case 'spelling':
        challengeComponent = <SpellingChallenge challenge={challenge.spelling} />;
        break;
      default:
        // will be caught by notFound() earlier
        break;
    }
  }

  if (loading) {
      return <ChallengeLoading />;
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
