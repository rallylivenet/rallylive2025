
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import type { RallyFromApi, LastStageFromApi } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { List } from 'lucide-react';

interface LiveRally {
    id: string;
    name: string;
    status: 'Live' | 'Finished' | 'Upcoming';
    link: string;
}

export default function LiveRallies() {
  const [rallies, setRallies] = React.useState<LiveRally[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchRallies() {
      try {
        const response = await fetch('https://www.rallylive.net/wp-json/rally/v1/live-results?limit=15');
        if (!response.ok) {
          throw new Error('Failed to fetch live rallies');
        }
        const data: RallyFromApi[] = await response.json();
        
        const mappedRallies = await Promise.all(data.map(async (rally) => {
            let status: LiveRally['status'] = 'Upcoming';
            let link = `/rally/${rally.rid}`;

            if (rally.rid) {
                try {
                    const stageResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-sonetap.php?rid=${rally.rid}`);
                    if (stageResponse.ok) {
                        const stageData: LastStageFromApi = await stageResponse.json();
                        if (stageData && stageData.sonEtap && stageData.sonEtap !== '0') {
                            link = `/rally/${rally.rid}/${stageData.sonEtap}`;
                            // This is a simplification. A more robust check might be needed.
                            status = 'Live'; 
                        }
                    }
                } catch (e) {
                    console.error(`Failed to fetch stage data for rally ${rally.rid}`, e);
                }
            }
            
            return {
                id: rally.rid,
                name: rally.title,
                status,
                link,
            };
        }));

        setRallies(mappedRallies);

      } catch (error) {
        console.error('Failed to fetch live rallies:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching live rallies',
          description: 'Could not load the list of live rallies.',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchRallies();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold font-headline">
          <List className="mr-3 h-6 w-6" />
          Live Rallies
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {rallies.length > 0 ? rallies.map((rally) => (
              <Link href={rally.link} key={rally.id}>
                <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent transition-colors cursor-pointer">
                  <span className="font-semibold text-sm">{rally.name}</span>
                  <Badge variant={rally.status === 'Live' ? 'destructive' : 'secondary'}>
                    {rally.status}
                  </Badge>
                </div>
              </Link>
            )) : (
              <p className="text-sm text-muted-foreground text-center">No live rallies at the moment.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
