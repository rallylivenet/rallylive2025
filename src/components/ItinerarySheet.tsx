
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
import { List, Calendar, Clock, Route, Flag, Users, Wrench, FlagCheckered } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ItineraryItem } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const iconMap: { [key: string]: React.ElementType } = {
    'fa-solid fa-flag': Flag,
    'fa-solid fa-users': Users,
    'fa-solid fa-wrench': Wrench,
    'fa-solid fa-flag-checkered': FlagCheckered,
};

const ItineraryRowIcon = ({ icon, stageNo }: { icon: string; stageNo: string }) => {
    const IconComponent = iconMap[icon];
    
    if (IconComponent) {
        return <IconComponent className="h-5 w-5 text-muted-foreground" />;
    }

    if (parseInt(stageNo, 10) > 0) {
        return <span className="font-bold w-5 text-center">{stageNo}</span>;
    }

    return <div className="w-5 h-5" />; // Placeholder for spacing
};


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
        setItinerary(data);
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
            <div className="space-y-1">
              {itinerary.map((item, index) => {
                const isLink = parseInt(item.no, 10) > 0;
                const Wrapper = isLink ? Link : 'div';
                const wrapperProps = isLink ? { href: `/rally/${rid}/${item.no}` } : {};

                return (
                  <Wrapper key={`${item.day}-${item.no}-${item.name}-${index}`} {...wrapperProps}>
                     <div className={cn(
                         "flex items-center space-x-4 p-3 rounded-md",
                         isLink && "hover:bg-accent cursor-pointer",
                         item.no === currentStageNo && "bg-primary text-primary-foreground"
                     )}>
                        <div className="w-6 text-center">
                            <ItineraryRowIcon icon={item.icon} stageNo={item.no} />
                        </div>
                        <div className="flex-1 font-semibold">
                            {item.name}
                        </div>
                        <div className="w-16 text-right text-sm text-muted-foreground">
                            {isLink && `${item.km} km`}
                        </div>
                        <div className="w-16 text-right text-sm text-muted-foreground">
                            {item.time}
                        </div>
                     </div>
                  </Wrapper>
                )
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
