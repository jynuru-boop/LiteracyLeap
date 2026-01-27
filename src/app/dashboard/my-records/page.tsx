'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useUserContext } from '@/app/context/user-context';
import AppHeader from '@/app/components/app-header';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

import MyRecordsLoading from './loading';
import StatsChart from './components/stats-chart';
import type { ChallengeAttempt } from '@/app/types';

export default function MyRecordsPage() {
    const { user, loading: userLoading } = useUserContext();
    const firestore = useFirestore();

    const attemptsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'users', user.id, 'attempts');
    }, [firestore, user]);

    const { data: attempts, loading: attemptsLoading } = useCollection<ChallengeAttempt>(attemptsQuery);
    
    const loading = userLoading || attemptsLoading;

    const stats = useMemo(() => {
        const initialStats = {
            reading: { correct: 0, total: 0 },
            vocabulary: { correct: 0, total: 0 },
            spelling: { correct: 0, total: 0 },
        };

        if (!attempts) return initialStats;

        return attempts.reduce((acc, attempt) => {
            if (acc[attempt.category]) {
                acc[attempt.category].total++;
                if (attempt.isCorrect) {
                    acc[attempt.category].correct++;
                }
            }
            return acc;
        }, initialStats);
    }, [attempts]);

    const chartData = useMemo(() => {
        const getAccuracy = (correct: number, total: number) => {
            return total > 0 ? Math.round((correct / total) * 100) : 0;
        };

        return [
            { name: '독해', accuracy: getAccuracy(stats.reading.correct, stats.reading.total) },
            { name: '사자성어/속담', accuracy: getAccuracy(stats.vocabulary.correct, stats.vocabulary.total) },
            { name: '맞춤법', accuracy: getAccuracy(stats.spelling.correct, stats.spelling.total) },
        ];
    }, [stats]);
    
    if (loading) {
        return <MyRecordsLoading />;
    }

    return (
        <>
            <Sidebar side="left" variant="sidebar" collapsible="icon">
                <AppHeader />
            </Sidebar>
            <SidebarInset>
                <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                    <header className="mb-6">
                        <h1 className="text-3xl font-black text-gray-800">나의 학습 기록</h1>
                        <p className="text-muted-foreground mt-1">나의 성장 과정을 한눈에 확인해보세요!</p>
                    </header>
                    <div className="grid grid-cols-1 gap-6">
                        <StatsChart data={chartData} />

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                    <span>종합 기록</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-base">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <p className="font-semibold">총 푼 문제</p>
                                    <p className="font-bold">{attempts?.length ?? 0}개</p>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <p className="font-semibold">총 맞힌 문제</p>
                                    <p className="font-bold text-green-600">{attempts?.filter(a => a.isCorrect).length ?? 0}개</p>
                                </div>
                                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <p className="font-semibold">전체 정답률</p>
                                    <p className="font-bold text-primary">
                                        {attempts && attempts.length > 0 ? 
                                            `${Math.round((attempts.filter(a => a.isCorrect).length / attempts.length) * 100)}%`
                                            : '0%'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </>
    );
}
