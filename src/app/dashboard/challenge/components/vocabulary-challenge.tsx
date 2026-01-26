'use client';

import ChallengeCard from '@/app/components/challenge-card';
import { Languages } from 'lucide-react';
import type { Challenge } from '@/app/types';
import { Card, CardContent } from '@/components/ui/card';

type VocabularyChallengeProps = {
  challenge: Challenge['vocabulary'];
};

export default function VocabularyChallenge({ challenge }: VocabularyChallengeProps) {
  return (
    <div className="space-y-6">
      <ChallengeCard icon={Languages} title="오늘의 사자성어/속담" className="bg-orange-100/60">
        <p className="text-4xl font-bold text-center py-8 text-foreground">{challenge.idiom}</p>
      </ChallengeCard>
      <Card>
          <CardContent className="pt-6 space-y-6">
              <div>
                  <h3 className="font-bold text-base text-muted-foreground">뜻풀이</h3>
                  <p className="text-xl mt-1 leading-relaxed">{challenge.definition}</p>
              </div>
               <hr/>
              <div>
                  <h3 className="font-bold text-base text-muted-foreground">예문</h3>
                  <p className="text-xl mt-1 italic leading-relaxed">"{challenge.example}"</p>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
