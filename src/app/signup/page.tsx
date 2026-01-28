'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, User, Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    if (!name || !email || !password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        name: name,
        email: user.email,
        points: 0,
        badge: '씨앗',
        role: 'student',
        classId: 'class-1a',
      });
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일 주소입니다.');
      } else if (err.code === 'auth/weak-password') {
        setError('비밀번호는 6자 이상이어야 합니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1.5">
            <BookOpen className="text-primary-foreground h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">문해력쑥쑥</h2>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">새로운 친구로 등록하기</CardTitle>
            <CardDescription>AI와 함께 매일매일 문해력을 키워봐요!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
               <div className="relative flex items-center">
                    <User className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="text" 
                        placeholder="이름을 알려주세요" 
                        className="h-14 pl-12 pr-4 rounded-full bg-secondary border-transparent"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>
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
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg font-bold" disabled={loading}>
                {loading ? '등록 중...' : '등록하고 시작하기!'}
              </Button>
            </form>
            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    이미 친구인가요?{' '}
                    <Link href="/" className="font-semibold text-primary hover:underline">
                        로그인하기
                    </Link>
                </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
