
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Countdown from '@/components/Countdown';
import type { RallyFromApi, LastStageFromApi } from '@/lib/types';


export default function RallyPage() {
    const params = useParams();
    const rid = params.rid as string;
    const { toast } = useToast();
    const [rally, setRally] = React.useState<RallyFromApi | null>(null);
    const [rallyDate, setRallyDate] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchRallyInfo() {
            if (!rid) return;
            setLoading(true);
            try {
                const rallyResponse = await fetch(`https://www.rallylive.net/wp-json/rally/v1/live-results?rid=${rid}`);
                if (!rallyResponse.ok) throw new Error('Failed to fetch rally details');
                const rallyData: RallyFromApi[] = await rallyResponse.json();
                if(rallyData.length > 0) {
                    setRally(rallyData[0]);
                } else {
                    throw new Error('Rally not found');
                }

                const stageResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-sonetap.php?rid=${rid}`);
                if (stageResponse.ok) {
                    const stageData: LastStageFromApi = await stageResponse.json();
                    setRallyDate(stageData.tarih);
                }

            } catch(error) {
                console.error("Failed to fetch rally info:", error);
                toast({
                    variant: "destructive",
                    title: "Error fetching rally info",
                    description: "Could not load rally information. Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        }
        fetchRallyInfo();
    }, [rid, toast]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-4 flex justify-between items-center">
                <Link href="/">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Rallies
                </Button>
                </Link>
                <h2 className="text-xl font-bold">{loading ? <Skeleton className="h-7 w-48" /> : rally?.title}</h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Rally Not Started</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center">
                            <Skeleton className="h-24 w-1/2" />
                        </div>
                    ) : (
                        rallyDate && (
                            <div className="text-center">
                                <p className="text-lg text-muted-foreground mb-4">The rally has not started yet. The first stage is scheduled to begin on {new Date(rallyDate).toLocaleDateString()}.</p>
                                <Countdown targetDate={rallyDate} />
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
