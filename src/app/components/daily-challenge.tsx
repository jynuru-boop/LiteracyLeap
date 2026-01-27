'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FileText, Languages, Pencil, Trophy, Gift } from 'lucide-react';
import { useUserContext } from '@/app/context/user-context';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityCard = ({ icon: Icon, title, description, remaining, bgColor, iconTextColor, link }: { icon: React.ElementType, title: string, description: string, remaining: number, bgColor: string, iconTextColor: string, link: string }) => (
  <Link href={link} className="block group">
    <Card className={`${bgColor} border-0 shadow-md hover:shadow-xl transition-all duration-200 rounded-2xl h-full group-hover:scale-105`}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center h-full">
          <div className="mb-4 rounded-full p-3 bg-white shadow-sm">
            <Icon className={`h-6 w-6 ${iconTextColor}`} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-4 px-2 flex-grow">{description}</p>
          <div className="rounded-full bg-white text-xs h-7 font-semibold text-gray-600 flex items-center px-3 shadow-sm">
            <span className="mr-1.5 text-base">🍬</span> {remaining}문제 남았어요
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const RankingItem = ({ rank, name, time, score }: { rank: number, name: string, time: string, score: string }) => (
  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
    <div className="w-8 text-center text-base font-bold text-yellow-500">{rank}</div>
    <div className="flex-grow ml-3">
      <p className="font-semibold text-sm">{name}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
    <div className="font-bold text-sm text-yellow-600">⭐ {score}</div>
  </div>
);

const BadgeItem = ({ name, imageId, imageHint }: { name: string, imageId: string, imageHint: string }) => {
  const badgeImage = PlaceHolderImages.find((img) => img.id === imageId);
  return (
    <div className="flex flex-col items-center gap-2">
      {badgeImage && (
        <Image src={badgeImage.imageUrl} alt={name} width={64} height={64} data-ai-hint={imageHint} className="rounded-full shadow-md" />
      )}
      <p className="text-sm font-semibold">{name}</p>
    </div>
  );
};


export default function DailyChallenge() {
  const { user, loading } = useUserContext();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 min-h-full">
      <header>
          {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-9 w-48 rounded-md" />
                <Skeleton className="h-5 w-72 rounded-md" />
              </div>
          ) : (
             <>
                <h1 className="text-3xl font-black text-gray-800">안녕, {user?.name ?? '학생'}! 👋</h1>
                <p className="text-muted-foreground mt-1">오늘은 어떤 지혜를 모아볼까?</p>
            </>
          )}
      </header>
      
      <main className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActivityCard 
            icon={FileText}
            title="독해력 쑥쑥"
            description="글을 읽고 내용을 파악해요"
            remaining={2}
            bgColor="bg-blue-100/60"
            iconTextColor="text-blue-500"
            link="/dashboard/challenge/reading"
          />
          <ActivityCard 
            icon={Languages}
            title="사자성어와 속담"
            description="지혜가 담긴 말을 배워요"
            remaining={2}
            bgColor="bg-orange-100/60"
            iconTextColor="text-orange-500"
            link="/dashboard/challenge/vocabulary"
          />
          <ActivityCard 
            icon={Pencil}
            title="우리말 맞춤법"
            description="바른 우리말을 익혀요"
            remaining={2}
            bgColor="bg-violet-100/60"
            iconTextColor="text-violet-500"
            link="/dashboard/challenge/spelling"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3 bg-white rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold text-base"><Trophy className="text-yellow-400" /> 문해력 랭킹 친구들</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <RankingItem rank={1} name="똑똑한 다람쥐 1" time="최근 학습 1시간 전" score="1850점" />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-white rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold text-base"><Gift className="text-red-400" /> 뱃지 컬렉션</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-6 justify-center pt-2">
              <BadgeItem name="씨앗" imageId="badge-seedling" imageHint="seedling" />
              <BadgeItem name="새싹" imageId="badge-sprout" imageHint="sprout" />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
