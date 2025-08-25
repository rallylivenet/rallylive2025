
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { StageResult, OverallResult, RallyCategory, ItineraryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Filter, Users, Flag, Share2, X, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { summarizeStageResults } from '@/ai/flows/summarize-stage-results';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ItinerarySheet from '@/components/ItinerarySheet';
import NavigationMenu from '@/components/NavigationMenu';
import AskAiAboutRallyDialog from '@/components/AskAiAboutRallyDialog';

export default function RallyStagePage() {
  const params = useParams();
  const rid = params.rid as string;
  const stage_no = params.stage_no as string;
  const { toast } = useToast();

  const [stageResults, setStageResults] = React.useState<StageResult[]>([]);
  const [overallResults, setOverallResults] = React.useState<OverallResult[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stageName, setStageName] = React.useState('');
  const [rallyName, setRallyName] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [categories, setCategories] = React.useState<RallyCategory[]>([]);
  const [selectedClass, setSelectedClass] = React.useState<string>('All');


  React.useEffect(() => {
    if (!rid) return;

    async function fetchCategories() {
        try {
            const response = await fetch(`https://www.rallylive.net/mobileapp/v1/json-categories.php?rid=${rid}`);
            if(response.ok) {
                const data: RallyCategory[] = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            // Non-critical, so we don't show a toast
        }
    }
    async function fetchRallyName() {
      try {
        const response = await fetch(`https://www.rallylive.net/wp-json/rally/v1/live-results?rid=${rid}`);
        if(response.ok) {
            const data = await response.json();
            if (data.length > 0) {
              setRallyName(data[0].title);
            }
        }
      } catch(e) {
        console.error('Could not fetch rally name');
      }
    }
    fetchCategories();
    fetchRallyName();

  }, [rid]);

  React.useEffect(() => {
    if (!rid || !stage_no) return;

    async function fetchData() {
      setLoading(true);
      // Reset summary when stage changes
      setSummary('');
      try {
        const classParam = selectedClass === 'All' ? '' : `&cls=${selectedClass}`;

        const [stageResultsResponse, overallResultsResponse, itineraryResponse] = await Promise.all([
          fetch(`https://www.rallylive.net/mobileapp/v1/json-stagetimes.php?rid=${rid}&stage_no=${stage_no}${classParam}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rid}&stage_no=${stage_no}${classParam}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/rally-itinerary.php?rid=${rid}`)
        ]);

        if (!stageResultsResponse.ok) throw new Error('Failed to fetch stage results');
        if (!overallResultsResponse.ok) throw new Error('Failed to fetch overall results');
        if (!itineraryResponse.ok) throw new Error('Failed to fetch itinerary');

        const stageResultsData: StageResult[] = await stageResultsResponse.json();
        const overallResultsData: OverallResult[] = await overallResultsResponse.json();
        const itineraryData: ItineraryItem[] = await itineraryResponse.json();
        
        const currentStageInfo = itineraryData.find((e) => e.no === stage_no);
        if (currentStageInfo) {
          setStageName(`SS${stage_no} ${currentStageInfo.name}`);
        } else {
          setStageName(`SS${stage_no}`);
        }
        
        setStageResults(stageResultsData);
        setOverallResults(overallResultsData);

      } catch (error) {
        console.error("Failed to fetch rally data:", error);
        toast({
            variant: "destructive",
            title: "Error fetching rally data",
            description: "Could not load rally results. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [rid, stage_no, toast, selectedClass]);

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    setSummary('');
    try {
        const resultsString = stageResults.map(r => 
            `${r.rank}. ${r.driver_surname} (${r.car_brand}) - Time: ${r.stage_time}, Diff: ${r.diff_to_leader}`
        ).join('\n');
        
        const response = await summarizeStageResults({
            stageName: stageName,
            stageResults: resultsString,
        });

        if (response.summary) {
            setSummary(response.summary);
        } else {
            throw new Error("Failed to generate summary.");
        }
    } catch (error) {
        console.error("Failed to generate summary:", error);
        toast({
            variant: "destructive",
            title: "AI Summary Error",
            description: "Could not generate the stage summary. Please try again.",
        });
    } finally {
        setIsSummarizing(false);
    }
  };

  const handleShareSummary = async () => {
    if (!summary) return;

    const shareData = {
      title: `Rally Report: ${stageName}`,
      text: summary,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(summary);
        toast({
          title: "Copied to clipboard!",
          description: "The summary has been copied to your clipboard.",
        });
      }
    } catch (error) {
       if (error instanceof DOMException && error.name === 'AbortError') {
        // Silently ignore if the user cancels the share dialog
        console.log('Share canceled by user.');
      } else {
        console.error("Failed to share:", error);
        toast({
          variant: "destructive",
          title: "Sharing Failed",
          description: "Could not share the summary.",
        });
      }
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                src="https://rallylive.net/wp-content/uploads/cropped-rallylive-logo-64-ico.png"
                alt="RallyLive Net Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </Link>
            <Link href="/">
              <h1 className="text-2xl font-bold font-headline text-foreground">
                RallyLive
              </h1>
            </Link>
          </div>
          <NavigationMenu />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8">
        <div className="mb-4 relative flex justify-between items-center h-10">
          <Link href="/calendar">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Calendar
            </Button>
          </Link>
          <h2 className="text-lg md:text-xl font-bold text-center truncate px-4">
              {loading ? <Skeleton className="h-7 w-48" /> : stageName}
          </h2>
          <div className="w-[150px]"></div> {/* Spacer to balance the back button */}
        </div>

        <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex items-center gap-2">
                  <ItinerarySheet />
                  {categories.length > 0 && (
                      <div className="flex items-center gap-2">
                          <Filter className="h-5 w-5 text-muted-foreground" />
                          <Select value={selectedClass} onValueChange={setSelectedClass}>
                              <SelectTrigger className="w-[150px] h-9">
                                  <SelectValue placeholder="Filter by class" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="All">All Classes</SelectItem>
                                  {categories.map((cat) => (
                                      <SelectItem key={cat.category} value={cat.category}>
                                          {cat.category} ({cat.occurrence})
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                  )}
              </div>
              <div className="flex items-center gap-2">
                <AskAiAboutRallyDialog 
                  rid={rid}
                  stage_no={stage_no}
                  rallyName={rallyName}
                  stageName={stageName}
                />
                <Button onClick={handleGenerateSummary} disabled={isSummarizing || loading} size="sm" className="h-9 px-3">
                    <Sparkles className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">{isSummarizing ? 'Generating...' : 'AI Summary'}</span>
                </Button>
              </div>
        </div>

        {(isSummarizing || summary) && (
          <Card className="mb-4 bg-secondary">
            <CardHeader className="p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                AI Stage Summary
              </CardTitle>
               {!isSummarizing && summary && (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShareSummary}>
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share summary</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSummary('')}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close summary</span>
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {isSummarizing ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <p className="text-sm text-secondary-foreground">{summary}</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <Card>
              <CardHeader className="p-2 md:p-4 text-center">
                  <CardTitle className="flex items-center justify-center text-sm md:text-base">
                      <Flag className="mr-2 h-4 w-4" />
                      Stage {selectedClass !== 'All' && `(${selectedClass})`}
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  {loading ? (
                      <ResultsTableSkeleton />
                  ) : (
                      <ResultsTable data={stageResults} type="stage" />
                  )}
              </CardContent>
          </Card>

          <Card>
              <CardHeader className="p-2 md:p-4 text-center">
                  <CardTitle className="flex items-center justify-center text-sm md:text-base">
                      <Users className="mr-2 h-4 w-4" />
                      Overall {selectedClass !== 'All' && `(${selectedClass})`}
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  {loading ? (
                      <ResultsTableSkeleton />
                  ) : (
                      <ResultsTable data={overallResults} type="overall" />
                  )}
              </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-6 border-t mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RallyLive Net. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const ResultsTable = ({ data, type }: { data: (StageResult[] | OverallResult[]), type: 'stage' | 'overall' }) => {
    if (!data || data.length === 0) {
        return <p className="p-4 text-center text-muted-foreground text-sm">No results available.</p>;
    }
  
    const formatPenalty = (penalty: string): string => {
        if (!penalty || penalty === '00:00.0' || penalty === '0' || penalty === '') return '';
        
        const parts = penalty.split(':');
        if (parts.length < 2) return '';

        const minutes = parseInt(parts[0], 10);
        const seconds = parseFloat(parts[1]);
        const totalSeconds = minutes * 60 + seconds;

        if (totalSeconds === 0) return '';

        return `+${totalSeconds.toFixed(1)}s`;
    }

  return (
    <div className="overflow-x-auto">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25px] p-1 text-center">No</TableHead>
              <TableHead className="p-1">Driver</TableHead>
              <TableHead className="w-[70px] text-right p-1">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const penaltyStr = type === 'overall' ? formatPenalty((item as OverallResult).penalty_time) : '';
              const flagUrl = item.driver_flag ? `https://rallylive.net/images/flags/16/${item.driver_flag}.png` : null;
              return (
                <TableRow key={index}>
                    <TableCell className="p-1 text-center font-bold align-top">
                      {item.rank}
                    </TableCell>
                    <TableCell className="p-1 align-top">
                      {/* Compact view for mobile */}
                      <div className="flex items-start gap-1.5 md:hidden">
                        <div className="w-4 flex-shrink-0 text-center">
                          {flagUrl && <Image src={flagUrl} alt={item.driver_flag} width={16} height={11} />}
                          <div className="text-[10px] font-bold text-muted-foreground">{item.door_no}</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold whitespace-nowrap">
                            {`${item.driver_surname.toUpperCase()}`}
                          </div>
                          <div className="text-muted-foreground/80 flex flex-col">
                             <span>{item.car_version}</span>
                             {penaltyStr && <div className="text-destructive font-bold">{penaltyStr}</div>}
                          </div>
                        </div>
                      </div>
                      {/* Detailed view for wider screens */}
                      <div className="hidden md:block">
                        <div className="font-bold whitespace-nowrap flex items-center">
                          {flagUrl && <Image src={flagUrl} alt={item.driver_flag} width={16} height={11} className="mr-1.5" />}
                          {`${item.driver_name.toUpperCase()} ${item.driver_surname.toUpperCase()}`}
                        </div>
                        <div className="text-muted-foreground/90 text-[11px] whitespace-nowrap pl-[22px]">{`${item.codriver_name} ${item.codriver_surname}`}</div>
                        <div className="text-muted-foreground/80 text-[11px] flex flex-col pl-[22px]">
                          <span>
                            #{item.door_no} {item.car_brand} {item.car_version}
                            {penaltyStr && <span className="text-destructive font-bold ml-2">{penaltyStr}</span>}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-1 text-right align-top">
                        <div>{type === 'stage' ? (item as StageResult).stage_time : (item as OverallResult).total_time}</div>
                        <div className="text-muted-foreground">{item.diff_to_previous}</div>
                        <div className="text-muted-foreground">{item.diff_to_leader}</div>
                    </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
        </Table>
    </div>
  );
};

const ResultsTableSkeleton = () => {
    return (
        <div className="p-2 space-y-2">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-start space-x-2">
                    <Skeleton className="h-8 w-6" />
                    <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                     <div className="space-y-1 text-right">
                        <Skeleton className="h-4 w-12 ml-auto" />
                        <Skeleton className="h-3 w-10 ml-auto" />
                    </div>
                </div>
            ))}
        </div>
    )
}
