import DailyChallenge from '@/app/components/daily-challenge';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background text-foreground">
      <DailyChallenge />
    </div>
  );
}
