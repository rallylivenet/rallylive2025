
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import NavigationMenu from '@/components/NavigationMenu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PushSettingsPage() {
  const [preferences, setPreferences] = React.useState({
    rallyStartFinish: true,
    stageWinners: true,
    breakingNews: false,
    overallStandings: true,
  });

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    // In a real app, you would save this preference to a backend.
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
                <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Push Notification Preferences
                </CardTitle>
                <CardDescription>
                    Manage what notifications you receive from RallyLive Net.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between p-4 rounded-lg border">
                 <Label htmlFor="rally-start-finish" className="font-semibold">Rally Start/Finish</Label>
                 <Switch
                    id="rally-start-finish"
                    checked={preferences.rallyStartFinish}
                    onCheckedChange={() => handlePreferenceChange('rallyStartFinish')}
                 />
               </div>
               <div className="flex items-center justify-between p-4 rounded-lg border">
                 <Label htmlFor="stage-winners" className="font-semibold">Stage Winners</Label>
                 <Switch
                    id="stage-winners"
                    checked={preferences.stageWinners}
                    onCheckedChange={() => handlePreferenceChange('stageWinners')}
                 />
               </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                 <Label htmlFor="overall-standings" className="font-semibold">Overall Standings Updates</Label>
                 <Switch
                    id="overall-standings"
                    checked={preferences.overallStandings}
                    onCheckedChange={() => handlePreferenceChange('overallStandings')}
                 />
               </div>
               <div className="flex items-center justify-between p-4 rounded-lg border">
                 <Label htmlFor="breaking-news" className="font-semibold">Breaking News</Label>
                 <Switch
                    id="breaking-news"
                    checked={preferences.breakingNews}
                    onCheckedChange={() => handlePreferenceChange('breakingNews')}
                 />
               </div>
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
