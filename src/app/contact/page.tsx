
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationMenu from '@/components/NavigationMenu';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, User, BookText, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
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
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl font-bold font-headline">
                <Mail className="mr-3 h-8 w-8" />
                Contact Us
            </CardTitle>
            <CardDescription>
                Fans of the rally, we are dedicated to serving you live results around the world. In case of your needs, you can contact us, anytime!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <form className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Your Name (required)</Label>
                        <Input id="name" placeholder="John Doe" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Your Email (required)</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="Question about..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea id="message" placeholder="Your message here..." rows={5} />
                    </div>
                    <Button type="submit" className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                    </Button>
                </form>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Get in touch with Us</h3>
                        <p className="text-muted-foreground">
                            For any inquiries, partnership opportunities, or feedback, feel free to reach out. We appreciate your engagement and will get back to you as soon as possible.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Address</h3>
                        <address className="not-italic text-muted-foreground">
                            71-75 Shelton Street, Covent Garden<br />
                            WC2H 9JQ, London<br />
                            United Kingdom
                        </address>
                    </div>
                </div>
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
