
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
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Clock, Route, Sparkles } from 'lucide-react';
import type { Rally, RallyFromApi, LastStageFromApi, StageWinnerInfo, OverallLeaderFromApi, OverallResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';
import Countdown from './Countdown';
import { Button } from './ui/button';
import { summarizeRally } from '@/ai/flows/summarize-rally';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const CheckeredFlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
);

const SummaryDialog = ({ rally, onGenerate, summary, isSummarizing }: { rally: Rally; onGenerate: (rally: Rally) => void; summary: string; isSummarizing: boolean; }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="secondary"
          onClick={() => {
            if (!summary && !isSummarizing) {
              onGenerate(rally);
            }
          }}
          disabled={isSummarizing}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isSummarizing ? 'Generating...' : (summary ? 'View Summary' : 'Generate AI Summary')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
             <Sparkles className="mr-2 h-5 w-5 text-primary" />
            AI Summary: {rally.name}
          </DialogTitle>
        </DialogHeader>
        {isSummarizing ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-secondary-foreground">{summary || 'Click "Generate AI Summary" to start.'}</p>
        )}
      </DialogContent>
    </Dialog>
  );
};


export default function RallySlider() {
  const [rallies, setRallies] = React.useState<Rally[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const [summaries, setSummaries] = React.useState<{[key: string]: string}>({});
  const [summarizing, setSummarizing] = React.useState<{[key: string]: boolean}>({});

  const handleGenerateSummary = async (rally: Rally) => {
    if (!rally.id || rally.lastStage.number === '0') {
        toast({
            variant: "destructive",
            title: "Cannot generate summary",
            description: "Summary can only be generated for active or finished rallies.",
        });
        return;
    }
    
    setSummarizing(prev => ({...prev, [rally.id]: true}));
    
    try {
        const overallResultsResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rally.id}&stage_no=${rally.lastStage.number}`);
        if (!overallResultsResponse.ok) throw new Error('Failed to fetch overall results');
        const overallResultsData: OverallResult[] = await overallResultsResponse.json();

        const resultsString = overallResultsData.slice(0, 10).map(r => 
            `${r.rank}. ${r.driver_surname} (${r.car_brand}) - Total Time: ${r.total_time}, Diff: ${r.diff_to_leader}`
        ).join('\n');
        
        const response = await summarizeRally({
            rallyName: rally.name,
            overallResults: resultsString,
        });

        if (response.summary) {
            setSummaries(prev => ({...prev, [rally.id]: response.summary}));
        } else {
            throw new Error("Failed to generate summary.");
        }
    } catch (error) {
        console.error("Failed to generate summary:", error);
        toast({
            variant: "destructive",
            title: "AI Summary Error",
            description: "Could not generate the rally summary. Please try again.",
        });
    } finally {
        setSummarizing(prev => ({...prev, [rally.id]: false}));
    }
  };


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
                number: '0',
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

                    if (stageData && stageData.sonEtap && stageData.sonEtap !== '0') {
                        let overallLeaderData: OverallLeaderFromApi[] = [];
                        const overallLeaderResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rally.rid}&stage_no=${stageData.sonEtap}`)
                        if (overallLeaderResponse.ok) {
                            const overallLeaderJson = await overallLeaderResponse.json();
                            if(overallLeaderJson) {
                                overallLeaderData = overallLeaderJson;
                            }
                        }
                        
                        let stageWinnerData: StageWinnerInfo | null = null;
                        const stageWinnerResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-besttime.php?rid=${rally.rid}&stage=${stageData.sonEtap}`);
                        if (stageWinnerResponse.ok) {
                            const stageWinnerJson = await stageWinnerResponse.json();
                            if (stageWinnerJson) {
                                stageWinnerData = stageWinnerJson;
                            }
                        }

                        const leader = overallLeaderData.find(d => d.rank === 1);
                        const stageName = stageData.name || 'TBA';
                            
                        lastStageData = {
                            name: `SS${stageData.sonEtap} ${stageName}`,
                            distance: `${stageData.km || '0.00'} km`,
                            winner: stageWinnerData ? `${stageWinnerData.dname} ${stageWinnerData.dsurname} / ${stageWinnerData.cname} ${stageWinnerData.csurname}` : 'TBA',
                            leader: leader ? `${leader.driver_name} ${leader.driver_surname} / ${leader.codriver_name} ${leader.codriver_surname}` : 'TBA',
                            number: stageData.sonEtap || '0',
                        };
                    } else if (stageData) {
                        lastStageData.number = '0';
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
          const resultsLink = rally.lastStage.number !== '0' 
            ? `/rally/${rally.id}/${rally.lastStage.number}` 
            : `/rally/${rally.id}`;
          const isUpcoming = rally.lastStage.number === '0';

          return (
            <CarouselItem key={rally.id}>
              <div className="p-1">
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 flex flex-col h-full">
                  <div className="relative aspect-[720/380]">
                    <Link href={resultsLink} aria-label={`View details for ${rally.name}`}>
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
                    {!isOldRally && !isUpcoming && (
                      <Badge variant="destructive" className="absolute top-4 right-4 text-base shadow-lg">LIVE</Badge>
                    )}
                  </div>
                  <CardContent className="p-6 flex-grow">
                    {isUpcoming ? (
                        <div className="text-center">
                            <h4 className="font-bold font-headline text-xl mb-4">Rally starts in:</h4>
                            <Countdown targetDate={rally.date} />
                        </div>
                    ) : (
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
                    )}
                  </CardContent>
                   <CardFooter className="p-6 pt-0 border-t mt-auto">
                        <div className="flex justify-between items-center w-full">
                           <Button asChild>
                               <Link href={resultsLink}>View Results</Link>
                           </Button>
                           {!isUpcoming && (
                                <SummaryDialog 
                                  rally={rally}
                                  onGenerate={handleGenerateSummary}
                                  summary={summaries[rally.id]}
                                  isSummarizing={!!summarizing[rally.id]}
                                />
                           )}
                        </div>
                    </CardFooter>
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
