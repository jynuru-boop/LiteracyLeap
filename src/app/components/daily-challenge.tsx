'use client';

import { useState, useEffect } from 'react';
import { generateDailyChallenge } from '@/ai/flows/generate-daily-challenge';
import type { Challenge, Badge } from '@/app/types';
import { BADGE_RANKS } from '@/app/data';

import AppHeader from './app-header';
import ChallengeCard from './challenge-card';
import { BadgeNotification } from './badge-notification';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

import { BookOpen, Sparkles, SpellCheck, ThumbsUp, PartyPopper } from 'lucide-react';

const todayDateString = () => new Date().toISOString().split('T')[0];

const getCurrentBadge = (score: number): Badge => {
  return BADGE_RANKS.slice().reverse().find(badge => score >= badge.minPoints) || BADGE_RANKS[0];
};

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [score, setScore] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<Badge | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedScore = localStorage.getItem('literacyLeapScore');
      const savedDate = localStorage.getItem('literacyLeapLastCompleted');
      if (savedScore) setScore(parseInt(savedScore, 10));
      if (savedDate) setLastCompletedDate(savedDate);
    } catch (e) {
      console.error("Could not access localStorage. Progress will not be saved.");
    }
  }, []);
  
  useEffect(() => {
    const fetchChallenge = async () => {
      if (lastCompletedDate === todayDateString()) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const studentLevel = Math.floor(score / 500) + 1;
        const newChallenge = await generateDailyChallenge({ studentLevel });
        setChallenge(newChallenge);
      } catch (e) {
        setError('Failed to generate a new challenge. Please try refreshing the page.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [lastCompletedDate, score]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const oldBadge = getCurrentBadge(score);
    const newScore = score + 120;
    const newBadge = getCurrentBadge(newScore);

    setScore(newScore);
    const today = todayDateString();
    setLastCompletedDate(today);

    try {
      localStorage.setItem('literacyLeapScore', newScore.toString());
      localStorage.setItem('literacyLeapLastCompleted', today);
    } catch (e) {
      console.error("Could not access localStorage. Progress will not be saved.");
    }

    toast({
      title: 'Challenge Complete!',
      description: 'You earned 120 points. Great job!',
    });

    if (newBadge && oldBadge.name !== newBadge.name) {
      setTimeout(() => setNewBadgeUnlocked(newBadge), 500);
    }

    setIsSubmitting(false);
  };
  
  const currentBadge = getCurrentBadge(score);
  const challengeCompletedToday = lastCompletedDate === todayDateString();

  const renderLoading = () => (
    <div className="w-full max-w-2xl space-y-6 p-4">
       <Skeleton className="h-40 w-full" />
       <Skeleton className="h-64 w-full" />
       <Skeleton className="h-64 w-full" />
       <Skeleton className="h-64 w-full" />
    </div>
  );

  const renderCompleted = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 mt-10 bg-card rounded-lg shadow-xl">
      <ThumbsUp className="h-16 w-16 text-accent mb-4" />
      <h2 className="text-2xl font-bold font-headline">오늘의 챌린지 완료!</h2>
      <p className="text-muted-foreground mt-2">Great work today! Come back tomorrow for a new challenge.</p>
    </div>
  );
  
  const renderError = () => (
    <Alert variant="destructive" className="mt-10 max-w-2xl">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <div className="container mx-auto max-w-2xl min-h-screen py-4 sm:py-8">
      <AppHeader score={score} badge={currentBadge} />
      
      <main className="w-full mt-8">
        {loading && renderLoading()}
        {error && renderError()}
        {!loading && !error && (
          challengeCompletedToday ? renderCompleted() : (
            challenge && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <ChallengeCard icon={BookOpen} title="읽기 연습">
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed bg-secondary/50 p-4 rounded-md">{challenge.readingComprehension.text}</p>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rc-q1" className="font-semibold">{challenge.readingComprehension.questions[0]}</Label>
                      <Textarea id="rc-q1" placeholder="답변을 입력하세요..." className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="rc-q2" className="font-semibold">{challenge.readingComprehension.questions[1]}</Label>
                      <Textarea id="rc-q2" placeholder="답변을 입력하세요..." className="mt-1" />
                    </div>
                  </div>
                </ChallengeCard>

                <ChallengeCard icon={Sparkles} title="어휘 퀴즈">
                  <div className="bg-secondary/50 p-4 rounded-md space-y-2">
                    <p><strong className="text-accent">{challenge.vocabulary.idiom}</strong></p>
                    <p><strong>정의:</strong> {challenge.vocabulary.definition}</p>
                    <p><strong>예시:</strong> "{challenge.vocabulary.example}"</p>
                  </div>
                   <div className="space-y-4">
                    <div>
                      <Label htmlFor="vocab-q1" className="font-semibold">1. 이 관용구를 자신의 말로 설명해보세요.</Label>
                      <Textarea id="vocab-q1" placeholder="답변을 입력하세요..." className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="vocab-q2" className="font-semibold">2. 이 관용구를 사용하여 새로운 문장을 만들어보세요.</Label>
                      <Textarea id="vocab-q2" placeholder="답변을 입력하세요..." className="mt-1" />
                    </div>
                  </div>
                </ChallengeCard>
                
                <ChallengeCard icon={SpellCheck} title="맞춤법 및 문법">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="spelling-q1" className="font-semibold">{challenge.spelling.question1}</Label>
                      <Textarea id="spelling-q1" placeholder="답변을 입력하세요..." className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="spelling-q2" className="font-semibold">{challenge.spelling.question2}</Label>
                      <Textarea id="spelling-q2" placeholder="답변을 입력하세요..." className="mt-1" />
                    </div>
                  </div>
                </ChallengeCard>
                
                <Button type="submit" size="lg" className="w-full text-lg" disabled={isSubmitting}>
                  <PartyPopper className="mr-2 h-5 w-5" />
                  {isSubmitting ? 'Submitting...' : 'Submit & Get 120 Points'}
                </Button>
              </form>
            )
          )
        )}
      </main>

      <BadgeNotification 
        badge={newBadgeUnlocked} 
        open={!!newBadgeUnlocked}
        onOpenChange={() => setNewBadgeUnlocked(null)} 
      />
    </div>
  );
}
