'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useUserContext, type UserProfile } from '@/app/context/user-context';
import AppHeader from '@/app/components/app-header';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import TeacherDashboardLoading from './loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { QuizLog } from '@/app/types';

function StudentQuizLogs({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    
    const quizLogsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, `users/${studentId}/quizLogs`),
            orderBy('date', 'desc')
        );
    }, [firestore, studentId]);

    const { data: quizLogs, loading: quizLogsLoading } = useCollection<QuizLog>(quizLogsQuery);

    if (quizLogsLoading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        )
    }

    if (!quizLogs || quizLogs.length === 0) {
        return <p className="text-sm text-muted-foreground">아직 퀴즈 기록이 없습니다.</p>;
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {quizLogs.map(log => (
                <AccordionItem value={log.id} key={log.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4">
                            <span>{log.date} - {log.category}</span>
                            <span className="font-bold">{log.score}점</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        {log.wrongAnswers.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                {log.wrongAnswers.map((wa, index) => (
                                    <li key={index}>
                                        <p className="font-semibold">{wa.question}</p>
                                        <p>제출 답안: <span className="text-red-600">{wa.userAnswer}</span></p>
                                        <p>정답: <span className="text-green-600">{wa.correctAnswer}</span></p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-green-600">모든 문제를 맞혔습니다! 🎉</p>
                        )}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )

}

function StudentDetails({ student }: { student: UserProfile }) {
    const firestore = useFirestore();
    const today = new Date().toISOString().split('T')[0];
    const categoryNames: { [key: string]: string } = {
        reading: '독해력',
        vocabulary: '사자성어/속담',
        spelling: '맞춤법',
    };

    const todayLogsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, `users/${student.id}/quizLogs`),
            where('date', '==', today)
        );
    }, [firestore, student.id, today]);

    const { data: todayLogs, loading: todayLogsLoading } = useCollection<QuizLog>(todayLogsQuery);
    
    const allLogsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, `users/${student.id}/quizLogs`),
            orderBy('date', 'desc'),
            limit(1)
        );
    }, [firestore, student.id]);

    const { data: lastLogs, loading: lastLogsLoading } = useCollection<QuizLog>(allLogsQuery);

    const { todayScore, completedCategories, isCompletedToday } = useMemo(() => {
        if (!todayLogs) {
            return { todayScore: 0, completedCategories: [], isCompletedToday: false };
        }
        const score = todayLogs.reduce((acc, log) => acc + log.score, 0);
        const categories = [...new Set(todayLogs.map(log => log.category))] as ('reading' | 'vocabulary' | 'spelling')[];
        
        const requiredCategories: ('reading' | 'vocabulary' | 'spelling')[] = ['reading', 'vocabulary', 'spelling'];
        const completed = requiredCategories.every(c => categories.includes(c));

        return {
            todayScore: score,
            completedCategories: categories,
            isCompletedToday: completed,
        };
    }, [todayLogs]);

    const lastPlayedDate = lastLogs && lastLogs.length > 0 ? lastLogs[0].date : '기록 없음';

    const loading = todayLogsLoading || lastLogsLoading;

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }
    
    const completedCategoryNames = completedCategories.length > 0 
        ? completedCategories.map(c => categoryNames[c] || c).join(', ')
        : '없음';

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>학습 현황 요약</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <p className="font-semibold">최근 학습일</p>
                        <p className="font-bold">{lastPlayedDate}</p>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <p className="font-semibold">오늘 획득 점수</p>
                        <p className="font-bold text-primary">+{todayScore}점</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <p className="font-semibold">오늘 완료 영역</p>
                        <p className="font-medium">{completedCategoryNames}</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <p className="font-semibold">오늘 챌린지 완료 여부</p>
                         <p className={cn("font-bold", isCompletedToday ? 'text-green-600' : 'text-red-600')}>{isCompletedToday ? '✅ 완료' : '❌ 미완료'}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>상세 퀴즈 기록</CardTitle></CardHeader>
                <CardContent>
                    <StudentQuizLogs studentId={student.id} />
                </CardContent>
            </Card>
        </div>
    )
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUserContext();
  const firestore = useFirestore();
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!userLoading && user?.role !== 'teacher') {
      router.replace('/dashboard');
    }
  }, [user, userLoading, router]);

  const studentsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.classId) return null;
    return query(
      collection(firestore, 'users'),
      where('classId', '==', user.classId),
      where('role', '==', 'student'),
      orderBy('name', 'asc')
    );
  }, [firestore, user]);

  const { data: students, loading: studentsLoading } = useCollection<UserProfile>(studentsQuery);
  
  useEffect(() => {
    if (!selectedStudent && students && students.length > 0) {
        setSelectedStudent(students[0]);
    }
  }, [students, selectedStudent]);


  if (userLoading || studentsLoading || user?.role !== 'teacher') {
    return <TeacherDashboardLoading />;
  }

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppHeader />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <header>
                <h1 className="text-3xl font-black text-gray-800">교사용 대시보드</h1>
                <p className="text-muted-foreground mt-1">{user?.classId}반 학생들의 학습 현황을 확인하세요.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle>학생 목록</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {students && students.map(student => (
                            <button key={student.id} onClick={() => setSelectedStudent(student)} className={cn(
                                "w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors",
                                selectedStudent?.id === student.id ? "bg-primary/10" : "hover:bg-muted"
                            )}>
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                                    <span className="text-xl">{student.emoji}</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{student.name}</p>
                                    <p className="text-xs text-muted-foreground">⭐ {student.points}점</p>
                                </div>
                            </button>
                        ))}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        {selectedStudent ? (
                            <CardTitle className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                                    <span className="text-2xl">{selectedStudent.emoji}</span>
                                </div>
                                <div>
                                    {selectedStudent.name}
                                    <p className="text-sm font-normal text-muted-foreground">학습 상세 기록</p>
                                </div>
                            </CardTitle>
                        ) : (
                             <CardTitle>학생 상세 정보</CardTitle>
                        )}
                    </CardHeader>
                    <CardContent>
                       {selectedStudent ? (
                           <StudentDetails student={selectedStudent} />
                       ) : (
                           <div className="text-center text-muted-foreground py-10">
                               <p>왼쪽 목록에서 학생을 선택하여 상세 기록을 확인하세요.</p>
                           </div>
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </SidebarInset>
    </>
  );
}
