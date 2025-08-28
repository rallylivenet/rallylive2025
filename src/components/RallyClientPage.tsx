
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Countdown from '@/components/Countdown';
import type { RallyFromApi } from '@/lib/types';

export default function RallyClientPage({ initialRally, initialRallyDate }: { initialRally: RallyFromApi | null, initialRallyDate: string | null }) {
    const { toast } = useToast();
    const [rally, setRally] = React.useState<RallyFromApi | null>(initialRally);
    const [rallyDate, setRallyDate] = React.useState<string | null>(initialRallyDate);
    const [loading, setLoading] = React.useState(!initialRally);


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
                        rallyDate ? (
                            <div className="text-center">
                                <p className="text-lg text-muted-foreground mb-4">The rally has not started yet. The first stage is scheduled to begin on {new Date(rallyDate).toLocaleDateString()}.</p>
                                <Countdown targetDate={rallyDate} />
                            </div>
                        ) : (
                            <p className="text-lg text-muted-foreground text-center">Rally information could not be loaded.</p>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
