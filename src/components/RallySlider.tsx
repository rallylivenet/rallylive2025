
"use client";

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Route } from 'lucide-react';
import type { Rally, RallyFromApi, LastStageFromApi, StageWinnerInfo, ItineraryItem, OverallLeaderFromApi } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';

const CheckeredFlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
);


export default function RallySlider() {
  const [rallies, setRallies] = React.useState<Rally[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchRallies() {
      try {
        const response = await fetch(`https://www.rallylive.net/wp-json/rally/v1/live-results?limit=10`);
        if (!response.ok) {
            throw new Error('Failed to fetch rallies');
        }
        const data: RallyFromApi[] = await response.json();
        
        const mappedRallies = await Promise.all(data.map(async (rally) => {
            let lastStageData: Rally['lastStage'] = {
                name: 'TBA',
                distance: 'TBA',
                winner: 'TBA',
                leader: 'TBA',
            };
            let rallyDate: string | null = null;


            if(rally.rid && rally.rid.trim() !== '') {
                try {
                    const stageResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-sonetap.php?rid=${rally.rid}`);
                    
                    let stageData: LastStageFromApi | null = null;
                    if (stageResponse.ok) {
                       const stageJson = await stageResponse.json();
                       if (stageJson) {
                           stageData = stageJson;
                           rallyDate = stageData.tarih;
                       }
                    }

                    let overallLeaderData: OverallLeaderFromApi[] = [];
                    if (stageData && stageData.sonEtap) {
                        const overallLeaderResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rally.rid}&stage_no=${stageData.sonEtap}`)
                        if (overallLeaderResponse.ok) {
                            const overallLeaderJson = await overallLeaderResponse.json();
                            if(overallLeaderJson) {
                                overallLeaderData = overallLeaderJson;
                            }
                        }
                    }
                    
                    let stageWinnerData: StageWinnerInfo | null = null;
                    if (stageData && stageData.sonEtap) {
                        const stageWinnerResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-besttime.php?rid=${rally.rid}&stage=${stageData.sonEtap}`);
                        if (stageWinnerResponse.ok) {
                            const stageWinnerJson = await stageWinnerResponse.json();
                            if (stageWinnerJson) {
                                stageWinnerData = stageWinnerJson;
                            }
                        }
                    }

                    const leader = overallLeaderData.find(d => d.rank === 1);

                    if (stageData) {
                        const stageName = stageData.name || 'TBA';
                        
                        lastStageData = {
                            name: `SS${stageData.sonEtap} ${stageName}`,
                            distance: `${stageData.km || '0.00'} km`,
                            winner: stageWinnerData ? `${stageWinnerData.dname} ${stageWinnerData.dsurname} / ${stageWinnerData.cname} ${stageWinnerData.csurname}` : 'TBA',
                            leader: leader ? `${leader.driver_name} ${leader.driver_surname} / ${leader.codriver_name} ${leader.codriver_surname}` : 'TBA',
                        };
                    }
                } catch (e) {
                    console.error(`Failed to fetch stage or itinerary data for rally ${rally.rid}`, e);
                }
            }

            return {
                id: rally.rid,
                name: rally.title,
                image: rally.thumbnail,
                imageHint: 'rally car action',
                lastStage: lastStageData,
                date: rallyDate || rally.date,
            };
        }));

        setRallies(mappedRallies);
      } catch (error) {
        console.error("Failed to fetch rallies:", error);
        toast({
            variant: "destructive",
            title: "Error fetching rallies",
            description: "Could not load live rally data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchRallies();
  }, [toast]);


  if (loading) {
    return (
        <div className="w-full max-w-5xl mx-auto p-1">
            <Card className="overflow-hidden shadow-lg border-2">
                <Skeleton className="relative aspect-[720/380] w-full" />
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-5/6" />
                        <Skeleton className="h-5 w-5/6" />
                        <Skeleton className="h-5 w-5/6" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (rallies.length === 0) {
      return (
          <div className="w-full max-w-5xl mx-auto p-1 text-center">
              <Card className="p-10">
                  <p className="text-lg text-muted-foreground">No live rallies found.</p>
              </Card>
          </div>
      )
  }

  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
  const lastMonday = new Date(today);
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  lastMonday.setDate(today.getDate() - daysToSubtract);
  lastMonday.setHours(0, 0, 0, 0);

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: rallies.length > 1,
      }}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent>
        {rallies.map((rally, index) => {
          const rallyDate = new Date(rally.date);
          rallyDate.setHours(0, 0, 0, 0);
          const isOldRally = rallyDate < lastMonday;

          return (
            <CarouselItem key={rally.id}>
              <div className="p-1">
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-2">
                  <div className="relative aspect-[720/380]">
                    <Link href={`/rally/${rally.id}`} aria-label={`View details for ${rally.name}`}>
                      <Image
                        src={rally.image || 'https://placehold.co/720x380.png'}
                        alt={rally.name}
                        fill
                        className="object-cover"
                        data-ai-hint={rally.imageHint}
                        priority={index === 0}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white font-headline">{rally.name}</h3>
                      </div>
                    </Link>
                    {!isOldRally && (
                      <Badge variant="destructive" className="absolute top-4 right-4 text-base shadow-lg">LIVE</Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div>
                      <h4 className="font-bold font-headline text-xl mb-4">Latest Stage: {rally.lastStage.name}</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <Route className="h-5 w-5 mr-3 text-primary shrink-0" />
                          <span>Distance: <span className="font-semibold">{rally.lastStage.distance}</span></span>
                        </li>
                        <li className="flex items-center">
                          <CheckeredFlagIcon className="h-5 w-5 mr-3 text-primary shrink-0" />
                          <span>Stage Winner: <span className="font-semibold text-accent">{rally.lastStage.winner}</span></span>
                        </li>
                        <li className="flex items-center">
                          <Clock className="h-5 w-5 mr-3 text-primary shrink-0" />
                          <span>Overall Leader: <span className="font-semibold text-accent">{rally.lastStage.leader}</span></span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      {rallies.length > 1 && (
        <>
          <CarouselPrevious className="hidden sm:flex left-[-50px]" />
          <CarouselNext className="hidden sm:flex right-[-50px]" />
        </>
      )}
    </Carousel>
  );
}
