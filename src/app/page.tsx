import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HeroPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex items-center">
         <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1.5">
            <BookOpen className="text-primary-foreground h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">문해력쑥쑥</h2>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-black text-gray-800">
          매일매일 AI 챌린지로
        </h1>
        <h1 className="text-4xl md:text-6xl font-black text-primary mb-4">
          문해력이 쑥쑥!
        </h1>
        <p className="max-w-2xl text-muted-foreground md:text-xl mb-8 leading-relaxed">
          AI가 만들어주는 맞춤형 문제로 즐겁게 공부하고, 문해력 천재가 되어보세요! <br/> 매일 새로운 챌린지가 여러분을 기다립니다.
        </p>
        
        <div className="w-full max-w-md">
            <div className="relative p-6 pt-8 border-4 border-foreground rounded-2xl">
                <div className="space-y-4 mb-10">
                    <Input 
                        type="text" 
                        placeholder="학생 아이디" 
                        className="w-full h-12 text-center text-lg border-x-0 border-t-0 rounded-none border-b-2 border-foreground/20 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-foreground/50"
                    />
                    <Input 
                        type="password" 
                        placeholder="비밀번호" 
                        className="w-full h-12 text-center text-lg border-x-0 border-t-0 rounded-none border-b-2 border-foreground/20 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-foreground/50"
                    />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <Button size="lg" asChild>
                        <Link href="/dashboard">오늘의 챌린지 시작하기</Link>
                    </Button>
                </div>
            </div>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © 2024 문해력쑥쑥. All rights reserved.
      </footer>
    </div>
  );
}
