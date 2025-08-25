
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-4 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <ItinerarySheet />
        </div>
        <h2 className="text-xl font-bold text-right">{loading ? <Skeleton className="h-7 w-48" /> : stageName}</h2>
      </div>

       <div className="mb-6 flex flex-wrap gap-4 items-center">
        <Button onClick={handleGenerateSummary} disabled={isSummarizing || loading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isSummarizing ? 'Generating...' : 'Generate AI Summary'}
        </Button>
        {categories.length > 0 && (
            <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[180px]">
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

      {(isSummarizing || summary) && (
        <Card className="mb-6 bg-secondary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              AI Stage Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSummarizing ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-secondary-foreground">{summary}</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-center text-lg">
                    <Flag className="mr-2 h-5 w-5" />
                    Stage Results {selectedClass !== 'All' && `(${selectedClass})`}
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
            <CardHeader>
                <CardTitle className="flex items-center justify-center text-lg">
                    <Users className="mr-2 h-5 w-5" />
                    Overall Standings {selectedClass !== 'All' && `(${selectedClass})`}
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
        return <p className="p-4 text-center text-muted-foreground">No results available for this class.</p>;
    }

  return (
    <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] p-2 text-center">No</TableHead>
              <TableHead className="p-2">Driver</TableHead>
              <TableHead className="w-[100px] text-right p-2">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
            <TableRow key={index}>
                <TableCell className="p-2 text-center font-bold text-lg align-top">
                  {item.rank}
                </TableCell>
                <TableCell className="p-2 align-top">
                  <div className="font-bold">{`${item.driver_surname.toUpperCase()}`}</div>
                  <div className="text-xs text-muted-foreground/80">#{item.door_no} {item.car_brand}</div>
                </TableCell>
                <TableCell className="p-2 text-right font-mono text-sm sm:text-base align-top">
                    <div>{type === 'stage' ? (item as StageResult).stage_time : (item as OverallResult).total_time}</div>
                    <div className="text-xs text-muted-foreground">
                        {type === 'stage' ? item.diff_to_leader : item.diff_to_previous}
                    </div>
                     {type === 'overall' && (item as OverallResult).penalty_time && (item as OverallResult).penalty_time !== '00:00.0' && <div className="text-xs text-destructive">P: {(item as OverallResult).penalty_time}</div>}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
};

const ResultsTableSkeleton = () => {
    return (
        <div className="p-4 space-y-4">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                     <div className="space-y-2 text-right">
                        <Skeleton className="h-5 w-16 ml-auto" />
                        <Skeleton className="h-4 w-12 ml-auto" />
                    </div>
                </div>
            ))}
        </div>
    )
}
