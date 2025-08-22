
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface PushMessage {
  id: number;
  title: string;
  body: string;
  date: string;
}

const dummyMessages: PushMessage[] = [
  {
    id: 1,
    title: 'New Rally Started!',
    body: 'The WRC Safari Rally Kenya has just started. Follow live results now!',
    date: '2024-07-28T10:00:00Z',
  },
  {
    id: 2,
    title: 'Stage 5 Results are in',
    body: 'Thierry Neuville wins SS5, extending his overall lead.',
    date: '2024-07-28T12:35:00Z',
  },
  {
    id: 3,
    title: 'Rally Canceled',
    body: 'Due to extreme weather conditions, Rally Estonia has been canceled.',
    date: '2024-07-27T09:15:00Z',
  },
];

export default function PushMessagesPage() {
  const [messages] = React.useState<PushMessage[]>(dummyMessages);

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
          <Link href="/login">
            <Button variant="ghost" size="icon">
                <LogIn />
                <span className="sr-only">Login</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-4 flex justify-between items-center">
            <Link href="/">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Rallies
                </Button>
            </Link>
            <h2 className="text-xl font-bold">Notifications</h2>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Push Messages
                </CardTitle>
            </CardHeader>
            <CardContent>
                {messages.length > 0 ? (
                    <ul className="space-y-4">
                        {messages.map((message) => (
                            <li key={message.id} className="p-4 rounded-lg border bg-card">
                                <h3 className="font-semibold">{message.title}</h3>
                                <p className="text-muted-foreground">{message.body}</p>
                                <p className="text-xs text-muted-foreground/80 mt-2">{new Date(message.date).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">You have no new messages.</p>
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
