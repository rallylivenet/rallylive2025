
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Newspaper, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RallyNews() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('https://rallylive.net/wp-json/wp/v2/posts?per_page=5&_embed');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching news',
          description: 'Could not load the latest news. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold font-headline">
            <Newspaper className="mr-3 h-6 w-6" />
            Latest News
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return null; // Don't render the component if there are no posts
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold font-headline">
          <Newspaper className="mr-3 h-6 w-6" />
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {posts.map((post) => {
            const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
            return (
              <div key={post.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b pb-4 last:border-b-0 last:pb-0">
                {featuredMedia && (
                  <Link href={`/post/${post.id}`} className="md:col-span-1 block w-full">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                       <Image
                          src={featuredMedia.source_url}
                          alt={featuredMedia.alt_text || post.title.rendered}
                          fill
                          className="object-cover"
                          unoptimized
                       />
                    </div>
                  </Link>
                )}
                <div className={featuredMedia ? "md:col-span-3" : "md:col-span-4"}>
                  <h3 className="text-lg font-semibold mb-1">
                    <Link
                      href={`/post/${post.id}`}
                      className="hover:text-primary transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </h3>
                  <div
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-muted-foreground/80">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <Button asChild variant="link" size="sm">
                      <Link href={`/post/${post.id}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
