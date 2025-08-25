
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
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
import type { StageResult, OverallResult, RallyCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Filter, Users, Flag } from 'lucide-react';
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

export default function RallyStagePage() {
  const params = useParams();
  const rid = params.rid as string;
  const stage_no = params.stage_no as string;
  const { toast } = useToast();

  const [stageResults, setStageResults] = React.useState<StageResult[]>([]);
  const [overallResults, setOverallResults] = React.useState<OverallResult[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stageName, setStageName] = React.useState('');
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
    fetchCategories();

  }, [rid]);

  React.useEffect(() => {
    if (!rid || !stage_no) return;

    async function fetchData() {
      setLoading(true);
      // Reset summary when stage changes
      setSummary('');
      try {
        const classParam = selectedClass === 'All' ? '' : `&cls=${selectedClass}`;

        const [stageResultsResponse, overallResultsResponse, stageNameResponse] = await Promise.all([
          fetch(`https://www.rallylive.net/mobileapp/v1/json-stagetimes.php?rid=${rid}&stage_no=${stage_no}${classParam}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rid}&stage_no=${stage_no}${classParam}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/json-sonetap.php?rid=${rid}`)
        ]);

        if (!stageResultsResponse.ok) throw new Error('Failed to fetch stage results');
        if (!overallResultsResponse.ok) throw new Error('Failed to fetch overall results');
        if (!stageNameResponse.ok) throw new Error('Failed to fetch stage name');

        const stageResultsData: StageResult[] = await stageResultsResponse.json();
        const overallResultsData: OverallResult[] = await overallResultsResponse.json();
        const stageNameData = await stageNameResponse.json();
        
        if (stageNameData && stageNameData.etaplar && Array.isArray(stageNameData.etaplar)) {
            const currentStageInfo = stageNameData.etaplar.find((e: any) => e.no === stage_no);
            setStageName(currentStageInfo ? `SS${stage_no} ${currentStageInfo.name}` : `Stage ${stage_no}`);
        } else {
             setStageName(`Stage ${stage_no}`);
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


  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8">
       <div className="mb-4 relative flex justify-center items-center h-10">
        <div className="absolute left-0">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-center truncate px-16">
            {loading ? <Skeleton className="h-7 w-48" /> : stageName}
        </h2>
      </div>

       <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
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
             <Button onClick={handleGenerateSummary} disabled={isSummarizing || loading} size="sm" className="md:w-auto w-10 h-9 p-0 md:px-3">
                <Sparkles className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{isSummarizing ? 'Generating...' : 'AI Summary'}</span>
                 <span className="sr-only">AI Summary</span>
            </Button>
      </div>

      {(isSummarizing || summary) && (
        <Card className="mb-4 bg-secondary">
          <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              AI Stage Summary
            </CardTitle>
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
              return (
                <TableRow key={index}>
                    <TableCell className="p-1 text-center font-bold align-top">
                      {item.rank}
                    </TableCell>
                    <TableCell className="p-1 align-top">
                      {/* Compact view for mobile */}
                      <div className="md:hidden">
                        <div className="font-bold whitespace-nowrap">{`${item.driver_surname.toUpperCase()}`}</div>
                        <div className="text-muted-foreground/80 flex flex-col">
                           <span>#{item.door_no} {item.car_version}</span>
                           {penaltyStr && <div className="text-destructive font-bold">{penaltyStr}</div>}
                        </div>
                      </div>
                      {/* Detailed view for wider screens */}
                      <div className="hidden md:block">
                        <div className="font-bold whitespace-nowrap">{`${item.driver_name.toUpperCase()} ${item.driver_surname.toUpperCase()}`}</div>
                        <div className="text-muted-foreground/90 text-[11px] whitespace-nowrap">{`${item.codriver_name} ${item.codriver_surname}`}</div>
                        <div className="text-muted-foreground/80 text-[11px] flex flex-col">
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
