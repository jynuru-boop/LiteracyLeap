'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { BookOpen, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function HeroPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    if (!email || !password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === 'teacher') {
          router.push('/dashboard/teacher');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Default to student dashboard if profile doesn't exist
        console.warn("User document not found, defaulting to student dashboard.");
        router.push('/dashboard');
      }

    } catch (err: any) {
      console.error(err);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative flex items-center">
            <Mail className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input 
                type="email" 
                placeholder="학교 이메일 주소를 적어줘" 
                className="h-14 pl-12 pr-4 rounded-full bg-secondary border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
            />
        </div>
        <div className="relative flex items-center">
            <Lock className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input 
                type="password" 
                placeholder="비밀번호를 입력해줘" 
                className="h-14 pl-12 pr-4 rounded-full bg-secondary border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
            />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg font-bold" disabled={loading}>
            {loading ? '로그인 중...' : '로그인하고 시작하기!'}
        </Button>
    </form>
  );


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
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">학생 로그인</TabsTrigger>
              <TabsTrigger value="teacher">선생님 로그인</TabsTrigger>
            </TabsList>
            <TabsContent value="student" className="pt-4">
              {loginForm}
            </TabsContent>
            <TabsContent value="teacher" className="pt-4">
              {loginForm}
            </TabsContent>
          </Tabs>

            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    아직 회원이 아닌가요?{' '}
                    <Link href="/signup" className="font-semibold text-primary hover:underline">
                        새로운 친구로 등록하기
                    </Link>
                </p>
            </div>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © 2026 문해력쑥쑥. All rights reserved.
      </footer>
    </div>
  );
}
