
import * as React from 'react';
import type { Post } from '@/lib/types';
import PostClientPage from '@/components/PostClientPage';

// This function is required for static export
export async function generateStaticParams() {
    try {
        const response = await fetch('https://rallylive.net/wp-json/wp/v2/posts?per_page=20&_embed');
        if (!response.ok) {
            console.error("Failed to fetch posts for static generation");
            return [];
        }
        const posts: Post[] = await response.json();
        return posts.map((post) => ({
            id: String(post.id),
        }));
    } catch (error) {
        console.error("Error in generateStaticParams for posts:", error);
        return [];
    }
}

async function getPost(id: string): Promise<Post | null> {
    try {
        const response = await fetch(`https://rallylive.net/wp-json/wp/v2/posts/${id}?_embed`);
        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error(`Failed to fetch post ${id}:`, error);
        return null;
    }
}

export default async function PostPage({ params }: { params: { id: string } }) {
    const post = await getPost(params.id);

    return <PostClientPage post={post} />;
}
