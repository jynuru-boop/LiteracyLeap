'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy } from 'firebase/firestore';
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
                                    <p className="text-sm font-normal text-muted-foreground">학습 기록</p>
                                </div>
                            </CardTitle>
                        ) : (
                             <CardTitle>학생 상세 정보</CardTitle>
                        )}
                    </CardHeader>
                    <CardContent>
                       {selectedStudent ? (
                           <StudentQuizLogs studentId={selectedStudent.id} />
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
