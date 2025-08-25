
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
import type { StageResult, OverallResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { summarizeStageResults } from '@/ai/flows/summarize-stage-results';

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

  React.useEffect(() => {
    if (!rid || !stage_no) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [stageResultsResponse, overallResultsResponse, stageNameResponse] = await Promise.all([
          fetch(`https://www.rallylive.net/mobileapp/v1/json-stagetimes.php?rid=${rid}&stage_no=${stage_no}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rid}&stage_no=${stage_no}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/json-sonetap.php?rid=${rid}`)
        ]);

        if (!stageResultsResponse.ok) throw new Error('Failed to fetch stage results');
        if (!overallResultsResponse.ok) throw new Error('Failed to fetch overall results');
        if (!stageNameResponse.ok) throw new Error('Failed to fetch stage name');

        const stageResultsData: StageResult[] = await stageResultsResponse.json();
        const overallResultsData: OverallResult[] = await overallResultsResponse.json();
        const stageNameData = await stageNameResponse.json();
        
        const currentStageInfo = stageNameData.etaplar.find((e: any) => e.no === stage_no);
        setStageName(currentStageInfo ? `SS${stage_no} ${currentStageInfo.name}` : `Stage ${stage_no}`);
        
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
  }, [rid, stage_no, toast]);

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    setSummary('');
    try {
        // Format the results data into a readable string for the AI
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
      <div className="mb-4 flex justify-between items-center">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rallies
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-right">{loading ? <Skeleton className="h-7 w-48" /> : stageName}</h2>
      </div>

       <div className="mb-6">
        <Button onClick={handleGenerateSummary} disabled={isSummarizing || loading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isSummarizing ? 'Generating...' : 'Generate AI Summary'}
        </Button>
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


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stage Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ResultsTableSkeleton />
            ) : (
              <ResultsTable data={stageResults} type="stage" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overall Standings</CardTitle>
          </CardHeader>
          <CardContent>
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
        return <p className="p-4 text-muted-foreground">No results available.</p>;
    }

  return (
    <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Pos</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Diff.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
            <TableRow key={index}>
                <TableCell>
                  <div className="font-bold">{item.rank}</div>
                  <div className="text-xs text-muted-foreground">#{item.door_no}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{`${item.driver_name.charAt(0)}. ${item.driver_surname}`}</div>
                  <div className="text-sm text-muted-foreground">{`${item.codriver_name.charAt(0)}. ${item.codriver_surname}`}</div>
                  <div className="text-xs text-muted-foreground/80">{item.car_brand}</div>
                </TableCell>
                <TableCell className="text-right font-mono">{type === 'stage' ? (item as StageResult).stage_time : (item as OverallResult).total_time}</TableCell>
                <TableCell className="text-right font-mono hidden sm:table-cell">{item.diff_to_leader}</TableCell>
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
                <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}
