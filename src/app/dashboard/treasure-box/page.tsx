'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/context/user-context';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import TreasureBoxLoading from './loading';

export default function TreasureBoxPage() {
  const router = useRouter();
  const { user, loading, claimDailyTreasure } = useUserContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [wonPoints, setWonPoints] = useState<number | null>(null);

  if (loading) {
    return <TreasureBoxLoading />;
  }
  
  const today = new Date().toISOString().split('T')[0];
  const hasClaimedToday = user?.lastTreasureDraw === today;

  const handleDraw = () => {
    if (hasClaimedToday || !user) return;

    setIsDrawing(true);
    const possiblePoints = [10, 20, 30, 50, 100];
    const randomPoints = possiblePoints[Math.floor(Math.random() * possiblePoints.length)];

    setTimeout(() => {
      claimDailyTreasure(randomPoints);
      setWonPoints(randomPoints);
      setIsDrawing(false);
    }, 1500); // Simulate drawing animation time
  };
  
  const TreasureChest = ({ isDrawing, wonPoints }: { isDrawing: boolean, wonPoints: number | null }) => (
    <div className="relative flex items-center justify-center w-64 h-64">
      <Gift 
        className={cn(
          "h-48 w-48 text-yellow-400 transition-all duration-500",
          isDrawing && "animate-bounce",
          wonPoints !== null && "scale-110"
          )}
      />
      {wonPoints !== null && (
         <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="absolute h-64 w-64 text-yellow-300 animate-ping opacity-50" />
            <Sparkles className="absolute h-48 w-48 text-amber-400 animate-ping delay-200 opacity-60" />
         </div>
      )}
    </div>
  );


  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full items-center justify-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-lg text-center shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-black text-primary">오늘의 행운 추첨</CardTitle>
                    <CardDescription className="text-base">매일 한 번, 보물 상자를 열어 랜덤 포인트를 받으세요!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <TreasureChest isDrawing={isDrawing} wonPoints={wonPoints} />
                    
                    {wonPoints !== null && (
                        <div className="flex flex-col items-center gap-2 animate-in fade-in">
                            <p className="text-xl font-semibold">축하합니다!</p>
                            <p className="text-4xl font-bold text-amber-500">
                                {wonPoints} 포인트
                            </p>
                            <p className="text-lg">를 획득했어요! 🎉</p>
                        </div>
                    )}

                    {hasClaimedToday || wonPoints !== null ? (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in">
                            {wonPoints === null && <p className="text-lg font-semibold text-muted-foreground">오늘은 이미 참여했어요. 내일 다시 만나요!</p>}
                             <Button onClick={() => router.push('/dashboard')}>
                                <Home className="mr-2" />
                                메인으로 돌아가기
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            onClick={handleDraw} 
                            disabled={isDrawing} 
                            size="lg" 
                            className="h-14 rounded-full text-lg font-bold"
                        >
                            {isDrawing ? "두근두근..." : "🎁 행운 뽑기!"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
      </SidebarInset>
    </>
  );
}
