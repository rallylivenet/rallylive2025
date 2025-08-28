import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Surface,
  Text,
} from 'react-native-paper';
import { Image } from 'expo-image';

interface Post {
  id: number;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: {
      id: number;
      source_url: string;
      alt_text: string;
    }[];
  };
}

export function RallyNews() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://rallylive.net/wp-json/wp/v2/posts?per_page=5&_embed');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      Alert.alert('Error', 'Could not load the latest news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostPress = (post: Post) => {
    Linking.openURL(post.link);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  if (loading) {
    return (
      <Card style={styles.container}>
        <Card.Content>
          <Title style={styles.title}>📰 Latest News</Title>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>Loading news...</Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title style={styles.title}>📰 Latest News</Title>
        
        <View style={styles.newsList}>
          {posts.map((post) => {
            const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
            
            return (
              <Surface
                key={post.id}
                style={styles.newsItem}
                onTouchEnd={() => handlePostPress(post)}
              >
                <View style={styles.newsContent}>
                  {featuredMedia && (
                    <Image
                      source={{ uri: featuredMedia.source_url }}
                      style={styles.newsImage}
                      contentFit="cover"
                    />
                  )}
                  
                  <View style={[styles.newsText, !featuredMedia && styles.newsTextFull]}>
                    <Text style={styles.newsTitle} numberOfLines={2}>
                      {stripHtml(post.title.rendered)}
                    </Text>
                    
                    <Text style={styles.newsExcerpt} numberOfLines={3}>
                      {stripHtml(post.excerpt.rendered)}
                    </Text>
                    
                    <View style={styles.newsFooter}>
                      <Text style={styles.newsDate}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                      
                      <Button
                        mode="text"
                        compact
                        onPress={() => handlePostPress(post)}
                        labelStyle={styles.readMoreText}
                      >
                        Read More →
                      </Button>
                    </View>
                  </View>
                </View>
              </Surface>
            );
          })}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  newsList: {
    gap: 16,
  },
  newsItem: {
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    elevation: 1,
    overflow: 'hidden',
  },
  newsContent: {
    flexDirection: 'row',
    gap: 12,
  },
  newsImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  newsText: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  newsTextFull: {
    paddingLeft: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 20,
  },
  newsExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
  },
  readMoreText: {
    fontSize: 12,
    color: '#1E3A8A',
  },
});