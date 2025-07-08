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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Route, Zap } from 'lucide-react';
import type { Rally } from '@/lib/types';
import { getRallyUpdate } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';

// Mock Data
const rallies: Rally[] = [
  {
    id: 'rally-finland-2024',
    name: 'Rally Finland 2024',
    image: 'https://placehold.co/720x400.png',
    imageHint: 'rally car forest',
    lastStage: {
      name: 'SS12 Ruuhimäki 1',
      distance: '11.12 km',
      winner: 'K. Rovanperä',
      leader: 'E. Evans',
    },
    keyMoment: 'Ott Tänak had a puncture on the final corner, losing 15 seconds.',
  },
  {
    id: 'safari-rally-kenya-2024',
    name: 'Safari Rally Kenya 2024',
    image: 'https://placehold.co/720x400.png',
    imageHint: 'safari rally',
    lastStage: {
      name: 'SS10 Sleeping Warrior',
      distance: '31.04 km',
      winner: 'S. Ogier',
      leader: 'K. Rovanperä',
    },
    keyMoment: 'Heavy rains turned the stage into a mud bath, causing several drivers to get stuck.',
  },
  {
    id: 'rally-eac-2024',
    name: 'Central European Rally 2024',
    image: 'https://placehold.co/720x400.png',
    imageHint: 'rally tarmac race',
    lastStage: {
      name: 'SS8 Böhmerwald',
      distance: '17.3 km',
      winner: 'T. Neuville',
      leader: 'T. Neuville',
    },
    keyMoment: 'Takamoto Katsuta slid off the road into a field but managed to recover with minimal time loss.',
  },
];

const CheckeredFlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
);


export default function RallySlider() {
  const [updates, setUpdates] = React.useState<Record<string, { loading: boolean; text: string | null }>>({});
  const { toast } = useToast();

  const handleGenerateUpdate = async (rally: Rally) => {
    setUpdates(prev => ({ ...prev, [rally.id]: { loading: true, text: null } }));
    
    const stageResults = `Winner: ${rally.lastStage.winner}, Distance: ${rally.lastStage.distance}`;
    
    const result = await getRallyUpdate({
      rallyName: rally.name,
      stageName: rally.lastStage.name,
      stageResults,
      leader: rally.lastStage.leader,
      keyMoment: rally.keyMoment,
    });
    
    if (result.success) {
      setUpdates(prev => ({ ...prev, [rally.id]: { loading: false, text: result.update } }));
    } else {
      setUpdates(prev => ({ ...prev, [rally.id]: { loading: false, text: null } }));
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent>
        {rallies.map((rally) => (
          <CarouselItem key={rally.id}>
            <div className="p-1">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-2">
                <div className="relative aspect-[720/380]">
                  <Link href={`#`} aria-label={`View details for ${rally.name}`}>
                    <Image
                      src={rally.image}
                      alt={rally.name}
                      fill
                      className="object-cover"
                      data-ai-hint={rally.imageHint}
                      priority={rallies.indexOf(rally) === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-3xl lg:text-4xl font-bold text-white font-headline">{rally.name}</h3>
                    </div>
                  </Link>
                  <Badge variant="destructive" className="absolute top-4 right-4 text-base shadow-lg">LIVE</Badge>
                </div>
                <CardContent className="p-6 grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-3 bg-muted p-4 rounded-lg flex flex-col">
                    <h4 className="font-bold font-headline text-xl mb-4">AI Rally Update</h4>
                    <div className="flex-grow">
                      {updates[rally.id]?.loading ? (
                        <div className="space-y-2 pt-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-4/6" />
                        </div>
                      ) : updates[rally.id]?.text ? (
                        <p className="text-sm text-muted-foreground italic leading-relaxed">"{updates[rally.id]?.text}"</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Click the button below to generate a live update from our AI commentator.</p>
                      )}
                    </div>
                     <Button
                      onClick={() => handleGenerateUpdate(rally)}
                      disabled={updates[rally.id]?.loading}
                      className="mt-4 w-full"
                      size="lg"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      {updates[rally.id]?.loading ? 'Generating...' : 'Generate Update'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex left-[-50px]" />
      <CarouselNext className="hidden sm:flex right-[-50px]" />
    </Carousel>
  );
}
