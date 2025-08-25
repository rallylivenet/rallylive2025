
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationMenu from '@/components/NavigationMenu';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar as CalendarIcon, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { RallyEvent } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const EventItem = ({ event }: { event: RallyEvent }) => {
    const content = (
        <div className="p-3 border rounded-md bg-card flex items-center justify-between hover:bg-accent transition-colors">
            <span className="font-semibold">{event.RalliAdi}</span>
            <span className="text-sm text-muted-foreground">{new Date(event.Tarih).toLocaleDateString()}</span>
        </div>
    );

    if (event.id) {
        const link = event.sonEtap && event.sonEtap !== '0' ? `/rally/${event.id}/${event.sonEtap}` : `/rally/${event.id}`;
        return <Link href={link}>{content}</Link>;
    }
    
    if (event.Link && !event.Link.includes('|')) {
        return <Link href={event.Link}>{content}</Link>;
    }

    return <div className="cursor-default">{content}</div>;
};

export default function CalendarPage() {
  const { toast } = useToast();
  const [events, setEvents] = React.useState<RallyEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  React.useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      try {
        const url = `https://www.rallylive.net/mobileapp/v1/get-events.php?year=${year}&month=${String(month).padStart(2, '0')}`;
        console.log("Fetching events from:", url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        const filteredEvents = data.events && Array.isArray(data.events) 
          ? data.events.filter((event: RallyEvent) => event.leftStage !== null) 
          : [];
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]); 
        toast({
          variant: 'destructive',
          title: 'Error fetching events',
          description: 'Could not load calendar events. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [selectedDate, toast]);

  const handleMonthChange = (offset: number) => {
    setSelectedDate(current => {
      const newDate = new Date(current);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const handleYearSelect = (year: string) => {
    setSelectedDate(current => {
        const newDate = new Date(current);
        newDate.setFullYear(parseInt(year, 10));
        return newDate;
    });
  };

   const handleMonthSelect = (monthIndex: string) => {
    setSelectedDate(current => {
        const newDate = new Date(current);
        newDate.setMonth(parseInt(monthIndex, 10));
        return newDate;
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentMonth = selectedDate.getFullYear() === today.getFullYear() && selectedDate.getMonth() === today.getMonth();

  const upcomingEvents = Array.isArray(events) ? events.filter(event => new Date(event.Tarih) >= today) : [];
  const pastEvents = Array.isArray(events) ? events.filter(event => new Date(event.Tarih) < today) : [];

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
                unoptimized
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
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-4">
            <Link href="/">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold font-headline">
                <CalendarDays className="mr-3 h-6 w-6" />
                Rally Calendar
            </CardTitle>
            <CardDescription>Browse upcoming and past rally events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-4 sm:mb-0">
                    <Button variant="outline" size="icon" onClick={() => handleMonthChange(-1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-semibold w-32 text-center">
                        {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </h3>
                     <Button variant="outline" size="icon" onClick={() => handleMonthChange(1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Select
                        value={String(selectedDate.getFullYear())}
                        onValueChange={handleYearSelect}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select
                        value={String(selectedDate.getMonth())}
                        onValueChange={handleMonthSelect}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthNames.map((month, index) => <SelectItem key={month} value={String(index)}>{month}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
            ) : (
              events.length > 0 ? (
                isCurrentMonth ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-lg mb-4">Upcoming Rallies</h4>
                      {upcomingEvents.length > 0 ? (
                        <div className="space-y-3">
                          {upcomingEvents.map(event => (
                            <EventItem key={event.id || event.Link} event={event} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No upcoming rallies for this month.</p>
                      )}
                    </div>
                     <div>
                      <h4 className="font-bold text-lg mb-4">Past Rallies</h4>
                       {pastEvents.length > 0 ? (
                        <div className="space-y-3">
                          {pastEvents.map(event => (
                            <EventItem key={event.id || event.Link} event={event} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No past rallies for this month.</p>
                      )}
                    </div>
                  </div>
                ) : (
                   <div>
                    <h4 className="font-bold text-lg mb-4">Events for {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h4>
                    <div className="space-y-3">
                      {events.map(event => (
                         <EventItem key={event.id || event.Link} event={event} />
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-10">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No events found for the selected period.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RallyLive Net. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
