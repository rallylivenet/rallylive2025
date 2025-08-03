
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
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RallyStagePage() {
  const params = useParams();
  const rid = params.rid as string;
  const stage_no = params.stage_no as string;
  const { toast } = useToast();

  const [stageResults, setStageResults] = React.useState<StageResult[]>([]);
  const [overallResults, setOverallResults] = React.useState<OverallResult[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stageName, setStageName] = React.useState('');

  React.useEffect(() => {
    if (!rid || !stage_no) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [stageResultsResponse, overallResultsResponse] = await Promise.all([
          fetch(`https://www.rallylive.net/mobileapp/v1/json-stagetimes.php?rid=${rid}&stage_no=${stage_no}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rid}&stage_no=${stage_no}`),
        ]);

        if (!stageResultsResponse.ok) throw new Error('Failed to fetch stage results');
        if (!overallResultsResponse.ok) throw new Error('Failed to fetch overall results');

        const stageResultsData: StageResult[] = await stageResultsResponse.json();
        const overallResultsData: OverallResult[] = await overallResultsResponse.json();
        
        setStageName(`SS${stage_no}`);

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rallies
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{loading ? <Skeleton className="h-7 w-2/3" /> : `Stage Results: ${stageName}`}</CardTitle>
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
            <CardTitle>{loading ? <Skeleton className="h-7 w-2/3" /> : `Overall Results (After ${stageName})`}</CardTitle>
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
        return <p className="text-muted-foreground">No results available.</p>;
    }

  return (
    <div className="overflow-x-auto">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Driver / Co-driver</TableHead>
            <TableHead className="w-[10px] text-right">Time</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item, index) => (
            <TableRow key={index}>
                <TableCell>
                  <div className="flex">
                    <div className="w-10 flex-shrink-0 text-center">
                      <div>{item.rank}</div>
                      <div className="text-sm text-muted-foreground">{item.door_no}</div>
                    </div>
                    <div>
                      <div className="font-medium hidden sm:block">{`${item.driver_name} ${item.driver_surname}`}</div>
                      <div className="font-medium block sm:hidden">{`${item.driver_name.charAt(0)}. ${item.driver_surname}`}</div>
                      <div className="text-sm text-muted-foreground hidden sm:block">{`${item.codriver_name} ${item.codriver_surname}`}</div>
                      <div className="text-sm text-muted-foreground block sm:hidden">{`${item.codriver_name.charAt(0)}. ${item.codriver_surname}`}</div>
                      <div className="text-xs text-muted-foreground/80 hidden sm:block">{`${item.car_brand} ${item.car_version}`}</div>
                      <div className="text-xs text-muted-foreground/80 block sm:hidden">{item.car_version}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                    <div>{type === 'stage' ? (item as StageResult).stage_time : (item as OverallResult).total_time}</div>
                    <div className="text-sm text-muted-foreground">{item.diff_to_leader}</div>
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
        <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    )
}
