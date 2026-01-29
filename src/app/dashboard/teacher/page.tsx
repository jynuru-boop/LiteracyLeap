'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useUserContext, type UserProfile } from '@/app/context/user-context';
import AppHeader from '@/app/components/app-header';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import TeacherDashboardLoading from './loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { QuizLog, ChallengeAttempt } from '@/app/types';
import StatsChart from '@/app/dashboard/my-records/components/stats-chart';
import { User, Trophy, BarChart2, Users, Percent, Star } from 'lucide-react';


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

function DailyStatus({ student }: { student: UserProfile }) {
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
                         <p className={cn("font-bold", isCompletedToday ? 'text-green-600' : 'text-red-500')}>{isCompletedToday ? '✅ 완료' : '❌ 미완료'}</p>
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

function PerformanceAnalysis({ student }: { student: UserProfile }) {
    const firestore = useFirestore();

    const attemptsQuery = useMemoFirebase(() => {
        if (!firestore || !student) return null;
        return collection(firestore, 'users', student.id, 'attempts');
    }, [firestore, student]);

    const { data: attempts, loading: attemptsLoading } = useCollection<ChallengeAttempt>(attemptsQuery);
    
    const { stats, chartData, weakestCategory } = useMemo(() => {
        const initialStats = {
            reading: { correct: 0, total: 0, accuracy: 0 },
            vocabulary: { correct: 0, total: 0, accuracy: 0 },
            spelling: { correct: 0, total: 0, accuracy: 0 },
        };
        
        if (!attempts) return { stats: initialStats, chartData: [], weakestCategory: '없음' };

        const calculatedStats = attempts.reduce((acc, attempt) => {
            if (acc[attempt.category]) {
                acc[attempt.category].total++;
                if (attempt.isCorrect) {
                    acc[attempt.category].correct++;
                }
            }
            return acc;
        }, JSON.parse(JSON.stringify(initialStats)));

        const categoryNames: {[key: string]: string} = { reading: '독해', vocabulary: '사자성어/속담', spelling: '맞춤법' };
        let minAccuracy = 101;
        let weakest = '없음';

        const finalChartData = Object.keys(calculatedStats).map(key => {
            const { correct, total } = calculatedStats[key];
            const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
            calculatedStats[key].accuracy = accuracy;
            if (total > 0 && accuracy < minAccuracy) {
                minAccuracy = accuracy;
                weakest = categoryNames[key];
            }
            return { name: categoryNames[key], accuracy };
        });

        return { stats: calculatedStats, chartData: finalChartData, weakestCategory: weakest };
    }, [attempts]);
    
    if (attemptsLoading) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <StatsChart data={chartData} />
            <Card>
                <CardHeader><CardTitle>종합 성과</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <p className="font-semibold">총 푼 문제</p>
                        <p className="font-bold">{attempts?.length ?? 0}개</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <p className="font-semibold">총 맞힌 문제</p>
                        <p className="font-bold text-green-600">{attempts?.filter(a => a.isCorrect).length ?? 0}개</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <p className="font-semibold">취약 영역</p>
                        <p className="font-bold text-red-600">{weakestCategory}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ClassStatistics({ students }: { students: UserProfile[] }) {
    const firestore = useFirestore();
    const [participationRate, setParticipationRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const { classAverage, topScorer } = useMemo(() => {
        if (!students || students.length === 0) return { classAverage: 0, topScorer: null };
        const totalPoints = students.reduce((acc, s) => acc + s.points, 0);
        const classAverage = students.length > 0 ? totalPoints / students.length : 0;
        const sortedStudents = [...students].sort((a, b) => b.points - a.points);
        return { classAverage: Math.round(classAverage), topScorer: sortedStudents[0] };
    }, [students]);

    useEffect(() => {
        if (!firestore || !students || students.length === 0) {
            setLoading(false);
            return;
        }

        const fetchParticipation = async () => {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];
            let participants = 0;
            const promises = students.map(student => {
                const logsQuery = query(
                    collection(firestore, `users/${student.id}/quizLogs`),
                    where('date', '==', today),
                    limit(1)
                );
                return getDocs(logsQuery);
            });

            try {
                const results = await Promise.all(promises);
                results.forEach(snapshot => {
                    if (!snapshot.empty) {
                        participants++;
                    }
                });
                setParticipationRate(Math.round((participants / students.length) * 100));
            } catch (error) {
                console.error("Error fetching participation data:", error);
                setParticipationRate(0);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipation();
    }, [firestore, students]);

    return (
        <Card>
            <CardHeader><CardTitle>우리 반 전체 통계</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <Card className="p-4 bg-blue-50">
                    <CardHeader className="p-2">
                        <Users className="h-8 w-8 mx-auto text-blue-500" />
                        <CardTitle className="text-base mt-2">학급 평균 점수</CardTitle>
                    </CardHeader>
                    <CardContent className="p-1">
                        <p className="text-2xl font-bold text-blue-600">{classAverage}점</p>
                    </CardContent>
                </Card>
                 <Card className="p-4 bg-green-50">
                    <CardHeader className="p-2">
                        <Percent className="h-8 w-8 mx-auto text-green-500" />
                        <CardTitle className="text-base mt-2">오늘의 참여율</CardTitle>
                    </CardHeader>
                    <CardContent className="p-1">
                         {loading ? <Skeleton className="h-8 w-20 mx-auto" /> : <p className="text-2xl font-bold text-green-600">{participationRate ?? 0}%</p>}
                    </CardContent>
                </Card>
                <Card className="p-4 bg-yellow-50">
                    <CardHeader className="p-2">
                        <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
                        <CardTitle className="text-base mt-2">최고 득점자</CardTitle>
                    </CardHeader>
                    <CardContent className="p-1">
                        {topScorer ? <p className="text-xl font-bold text-yellow-600 truncate">{topScorer.name}</p> : <p>-</p>}
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}

const NoStudentSelected = () => (
    <Card>
        <CardContent className="h-96 flex flex-col items-center justify-center text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">왼쪽 목록에서 학생을 선택하여<br/>상세 기록을 확인하세요.</p>
        </CardContent>
    </Card>
);

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
                        {students && students.length > 0 ? (
                            students.map(student => (
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
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center p-4">
                                아직 등록된 학생이 없습니다.
                            </p>
                        )}
                    </CardContent>
                </Card>
                <div className="lg:col-span-2">
                     <Tabs defaultValue="daily-status" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="daily-status" disabled={!selectedStudent}>일일 학습 현황</TabsTrigger>
                            <TabsTrigger value="performance-analysis" disabled={!selectedStudent}>학습 성과 분석</TabsTrigger>
                            <TabsTrigger value="class-stats">학급 전체 통계</TabsTrigger>
                        </TabsList>
                        <TabsContent value="daily-status" className="mt-4">
                            {selectedStudent ? <DailyStatus student={selectedStudent} /> : <NoStudentSelected />}
                        </TabsContent>
                        <TabsContent value="performance-analysis" className="mt-4">
                             {selectedStudent ? <PerformanceAnalysis student={selectedStudent} /> : <NoStudentSelected />}
                        </TabsContent>
                        <TabsContent value="class-stats" className="mt-4">
                           {students ? <ClassStatistics students={students} /> : <Skeleton className="h-48 w-full" />}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
      </SidebarInset>
    </>
  );
}
