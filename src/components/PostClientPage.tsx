
'use client';

import * as React from 'react';
import type { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import NavigationMenu from '@/components/NavigationMenu';

export default function PostClientPage({ post: initialPost }: { post: Post | null }) {
    const [post, setPost] = React.useState<Post | null>(initialPost);
    
    if (!post) {
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
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <p className="mt-4 text-lg text-muted-foreground">Post not found or failed to load.</p>
                </main>
                 <footer className="py-6 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} RallyLive Net. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        )
    }

    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const author = post._embedded?.author?.[0]?.name || '';

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
                <div className="mb-6">
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to News
                        </Button>
                    </Link>
                </div>
                <article className="prose dark:prose-invert max-w-none">
                    <h1 
                        className="text-3xl md:text-4xl font-bold font-headline mb-4"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                    />
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                        {author && (
                             <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>{author}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                    {featuredMedia && (
                        <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
                            <Image
                                src={featuredMedia.source_url}
                                alt={featuredMedia.alt_text || post.title.rendered}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                    <div 
                        className="prose-p:text-base prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
                    />
                </article>
            </main>
            <footer className="py-6 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} RallyLive Net. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
