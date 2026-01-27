import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HeroPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex items-center">
         <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1.5">
            <BookOpen className="text-primary-foreground h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">문해력쑥쑥</h2>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-black text-foreground">
          매일매일 AI 챌린지로
        </h1>
        <h1 className="text-4xl md:text-6xl font-black text-primary mb-4">
          문해력이 쑥쑥!
        </h1>
        <p className="max-w-2xl text-muted-foreground md:text-xl mb-8 leading-relaxed">
          AI가 만들어주는 맞춤형 문제로 즐겁게 공부하고, 문해력 천재가 되어보세요! <br/> 매일 새로운 챌린지가 여러분을 기다립니다.
        </p>
        
        <div className="w-full max-w-sm">
            <div className="space-y-4">
                <div className="relative flex items-center">
                    <Mail className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="email" 
                        placeholder="학교 이메일 주소를 적어줘" 
                        className="h-14 pl-12 pr-4 rounded-full bg-secondary border-transparent"
                    />
                </div>
                <div className="relative flex items-center">
                    <Lock className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="password" 
                        placeholder="비밀번호를 입력해줘" 
                        className="h-14 pl-12 pr-4 rounded-full bg-secondary border-transparent"
                    />
                </div>
                <Button size="lg" className="w-full h-14 rounded-full text-lg font-bold" asChild>
                    <Link href="/dashboard">로그인하고 시작하기!</Link>
                </Button>
            </div>
            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    아직 회원이 아닌가요?{' '}
                    <Link href="#" className="font-semibold text-primary hover:underline">
                        새로운 친구로 등록하기
                    </Link>
                </p>
            </div>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © 2024 문해력쑥쑥. All rights reserved.
      </footer>
    </div>
  );
}
