
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { List, Calendar, Clock, Route } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ItineraryItem } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { useParams } from 'next/navigation';

export default function ItinerarySheet() {
  const params = useParams();
  const rid = params.rid as string;
  const currentStageNo = params.stage_no as string;

  const { toast } = useToast();
  const [itinerary, setItinerary] = React.useState<ItineraryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchItinerary() {
      if (!rid) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.rallylive.net/mobileapp/v1/rally-itinerary.php?rid=${rid}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch itinerary');
        }
        const data: ItineraryItem[] = await response.json();
        // Filter for actual stages with a positive number
        setItinerary(data.filter((item) => item.icon !== 'road' && parseInt(item.no, 10) > 0));
      } catch (error) {
        console.error('Failed to fetch itinerary:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching itinerary',
          description: 'Could not load the rally itinerary.',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchItinerary();
  }, [rid, toast]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <List className="mr-2 h-4 w-4" />
          View Itinerary
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <List className="mr-2 h-5 w-5" />
            Rally Itinerary
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 h-[calc(100vh-80px)] overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {itinerary.map((item) => {
                const isLink = parseInt(item.no, 10) > 0;
                
                return (
                  <li key={item.no}>
                    <Button
                      asChild={isLink}
                      variant={item.no === currentStageNo ? 'default' : 'secondary'}
                      className="w-full h-auto justify-start"
                      disabled={!isLink}
                    >
                      {isLink ? (
                        <Link
                          href={`/rally/${rid}/${item.no}`}
                          className="flex flex-col items-start p-3"
                        >
                          <h4 className="font-semibold">
                            {item.name.startsWith('SS')
                              ? item.name
                              : `SS${item.no} ${item.name}`}
                          </h4>
                          <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                            <span className="flex items-center">
                              <Calendar className="mr-1.5 h-3 w-3" />
                              {new Date(item.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1.5 h-3 w-3" />
                              {item.time}
                            </span>
                            <span className="flex items-center">
                              <Route className="mr-1.5 h-3 w-3" />
                              {item.km} km
                            </span>
                          </div>
                        </Link>
                      ) : (
                         <div className="flex flex-col items-start p-3 text-left">
                            <h4 className="font-semibold">
                                {item.name}
                            </h4>
                         </div>
                      )}
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
