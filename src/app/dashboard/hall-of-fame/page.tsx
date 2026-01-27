'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useUserContext } from '@/app/context/user-context';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/app/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import HallOfFameLoading from './loading';
import type { LeaderboardEntry } from '@/app/types';


const medalColors = {
  1: 'text-yellow-400',
  2: 'text-slate-400',
  3: 'text-amber-600',
};

const medalBgColors = {
    1: 'bg-yellow-100/60 border-yellow-200/80',
    2: 'bg-slate-100/80 border-slate-200/80',
    3: 'bg-amber-100/60 border-amber-200/80',
}

export default function HallOfFamePage() {
    const { user, loading: userLoading } = useUserContext();
    const firestore = useFirestore();

    const leaderboardQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'leaderboard');
    }, [firestore]);

    const { data: leaderboardData, loading: leaderboardLoading } = useCollection<LeaderboardEntry>(leaderboardQuery);

    const { sortedLeaderboard, userRank, userEntry } = useMemo(() => {
        if (!leaderboardData) return { sortedLeaderboard: [], userRank: null, userEntry: null };
        const sorted = [...leaderboardData].sort((a, b) => b.points - a.points);
        const rankIndex = user ? sorted.findIndex(p => p.id === user.id) : -1;
        
        return {
            sortedLeaderboard: sorted,
            userRank: rankIndex !== -1 ? rankIndex + 1 : null,
            userEntry: rankIndex !== -1 ? sorted[rankIndex] : null,
        };
    }, [leaderboardData, user]);

    const loading = userLoading || leaderboardLoading;

    if (loading) {
        return <HallOfFameLoading />;
    }

    return (
        <>
            <Sidebar side="left" variant="sidebar" collapsible="icon">
                <AppHeader />
            </Sidebar>
            <SidebarInset>
                <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                    <header className="mb-6">
                        <h1 className="text-3xl font-black text-gray-800">명예의 전당 🏆</h1>
                        <p className="text-muted-foreground mt-1">가장 높은 점수를 얻은 친구들을 확인해보세요!</p>
                    </header>

                    <div className="space-y-6">
                        {userRank && userEntry && (
                            <Card className="animate-in fade-in-50">
                                <CardHeader>
                                    <CardTitle className="text-lg">나의 현재 순위</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
                                        <div className="text-2xl font-bold w-10 text-center text-primary">{userRank}위</div>
                                        <div className="flex items-center gap-3 flex-grow">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                                                <span className="text-2xl">{userEntry.emoji}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold">{userEntry.name}</p>
                                                <p className="text-sm text-muted-foreground font-semibold">⭐ {userEntry.points}점</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        <Card className="animate-in fade-in-50 delay-100">
                             <CardHeader>
                                <CardTitle className="text-lg">전체 랭킹</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {sortedLeaderboard.map((entry, index) => {
                                        const rank = index + 1;
                                        const isCurrentUser = user?.id === entry.id;

                                        return (
                                             <div key={entry.id} className={cn(
                                                "flex items-center gap-4 p-3 rounded-lg transition-all",
                                                rank <= 3 && medalBgColors[rank as keyof typeof medalBgColors],
                                                isCurrentUser && 'ring-2 ring-primary'
                                             )}>
                                                <div className="flex items-center justify-center gap-2 w-12 text-lg font-bold">
                                                    {rank <= 3 ? <Medal className={cn('h-6 w-6', medalColors[rank as keyof typeof medalColors])} /> : <span>{rank}</span>}
                                                </div>
                                                <div className="flex items-center gap-3 flex-grow">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                                                        <span className="text-2xl">{entry.emoji}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm sm:text-base">{entry.name}</p>
                                                    </div>
                                                </div>
                                                <div className="font-bold text-sm sm:text-base text-muted-foreground">⭐ {entry.points}점</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </SidebarInset>
        </>
    );
}
