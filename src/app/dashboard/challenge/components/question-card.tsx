'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

type QuestionCardProps = {
  questionIndex: number;
  question: string;
  options: string[];
  answer: string;
  userAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult: boolean;
  example?: string;
};

export default function QuestionCard({ questionIndex, question, options, answer, userAnswer, onAnswerSelect, showResult, example }: QuestionCardProps) {
  const isCorrect = userAnswer === answer;

  return (
    <Card className={cn(
        'transition-all',
        showResult && !isCorrect && 'border-red-400 bg-red-50/60',
        showResult && isCorrect && 'border-green-400 bg-green-50/60'
        )}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>문제 {questionIndex + 1}</span>
          {showResult && (
            isCorrect ? <CheckCircle2 className="text-green-600" /> : <XCircle className="text-red-600" />
          )}
        </CardTitle>
        <CardDescription className="text-lg pt-2 text-foreground/90">{question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={onAnswerSelect} value={userAnswer || ''} disabled={showResult}>
          <div className="space-y-3">
            {options.map((option, index) => {
               const isCorrectOption = option === answer;
               const isSelected = userAnswer === option;
              
              return (
              <Label
                key={index}
                htmlFor={`option-${questionIndex}-${index}`}
                className={cn(
                  'flex items-center gap-4 rounded-lg border p-4 text-base cursor-pointer transition-colors bg-background',
                  !showResult && 'hover:bg-accent/50',
                  showResult && isCorrectOption && 'border-green-500 bg-green-100/80 ring-2 ring-green-300',
                  showResult && isSelected && !isCorrectOption && 'border-red-500 bg-red-100/80 line-through',
                  showResult && 'cursor-not-allowed opacity-80'
                )}
              >
                <RadioGroupItem value={option} id={`option-${questionIndex}-${index}`} className="h-5 w-5" />
                <span className="flex-1">{option}</span>
                {showResult && isCorrectOption && <CheckCircle2 className="text-green-600" />}
              </Label>
            )})}
          </div>
        </RadioGroup>
        {showResult && example && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-bold text-sm text-muted-foreground">예문</h4>
            <p className="text-base mt-1 italic text-foreground/90">"{example}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
