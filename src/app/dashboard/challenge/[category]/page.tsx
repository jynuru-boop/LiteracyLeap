'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { useUserContext } from '@/app/context/user-context';
import { generateDailyChallenge, type GenerateDailyChallengeOutput } from '@/ai/flows/generate-daily-challenge';

import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import ReadingChallenge from '../components/reading-challenge';
import VocabularyChallenge from '../components/vocabulary-challenge';
import SpellingChallenge from '../components/spelling-challenge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChallengeLoading from './loading';

type Level = 'easy' | 'medium' | 'hard';
type DailyChallenges = {
  date: string;
  easy: GenerateDailyChallengeOutput;
  medium: GenerateDailyChallengeOutput;
  hard: GenerateDailyChallengeOutput;
};

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
  
  const firestore = useFirestore();
  const { user } = useUserContext();

  const [challenge, setChallenge] = useState<GenerateDailyChallengeOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryNames: { [key: string]: string } = {
    reading: '독해력 쑥쑥',
    vocabulary: '사자성어와 속담',
    spelling: '우리말 맞춤법'
  };
  const title = categoryNames[category];

  useEffect(() => {
    if (!firestore || !user) return;

    const getOrGenerateChallenge = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const today = new Date().toISOString().split('T')[0];
        const challengeDocRef = doc(firestore, 'daily-challenges', today);
        const level = getLevelFromPoints(user.points);

        const docSnap = await getDoc(challengeDocRef);

        let challengesForToday: DailyChallenges | null = null;
        if (docSnap.exists()) {
            challengesForToday = docSnap.data() as DailyChallenges;
        }

        // Check if the vocabulary challenge format is outdated.
        const isStale = challengesForToday && 
                        challengesForToday[level] && 
                        (!challengesForToday[level].vocabulary.options || !Array.isArray(challengesForToday[level].vocabulary.options));

        if (challengesForToday && challengesForToday[level] && !isStale) {
            setChallenge(challengesForToday[level]);
        } else {
            // Data is stale, or no challenges for today, or no challenge for this level
            // Generate for all levels and store
            const [easy, medium, hard] = await Promise.all([
                generateDailyChallenge({ studentLevel: levelMapping['easy'] }),
                generateDailyChallenge({ studentLevel: levelMapping['medium'] }),
                generateDailyChallenge({ studentLevel: levelMapping['hard'] }),
            ]);
            
            const newChallenges: DailyChallenges = {
                date: today,
                easy,
                medium,
                hard
            };

            await setDoc(challengeDocRef, newChallenges, { merge: true });
            setChallenge(newChallenges[level]);
        }
      } catch (e: any) {
        console.error('Failed to get or generate challenge:', e);
        setError('챌린지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    getOrGenerateChallenge();
  }, [firestore, user, category]);

  if (!title) {
    notFound();
  }

  let challengeComponent;
  if (challenge) {
    switch (category) {
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
