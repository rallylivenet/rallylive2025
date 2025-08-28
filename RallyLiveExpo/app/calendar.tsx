import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Button,
  Surface,
  Text,
  Chip,
} from 'react-native-paper';
import { router } from 'expo-router';
import { RallyEvent } from '../types/rally';

export default function CalendarScreen() {
  const [events, setEvents] = useState<RallyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchEvents = async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const url = `https://www.rallylive.net/mobileapp/v1/get-events.php?year=${year}&month=${String(month).padStart(2, '0')}`;
      
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
      Alert.alert('Error', 'Could not load calendar events. Please try again later.');
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const handleEventPress = (event: RallyEvent) => {
    if (event.id && event.sonEtap && event.sonEtap !== '0') {
      router.push(`/rally/${event.id}/${event.sonEtap}`);
    } else if (event.id) {
      router.push(`/rally/${event.id}/1`);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(event => new Date(event.Tarih) >= today);
  const pastEvents = events.filter(event => new Date(event.Tarih) < today);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading calendar...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Header */}
        <Surface style={styles.header}>
          <Title style={styles.headerTitle}>📅 Rally Calendar</Title>
          <Paragraph>Browse upcoming and past rally events</Paragraph>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            ← Back to Home
          </Button>
        </Surface>

        {/* Events List */}
        {events.length > 0 ? (
          <View style={styles.eventsContainer}>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <View style={styles.eventSection}>
                <Title style={styles.sectionTitle}>🏁 Upcoming Rallies</Title>
                {upcomingEvents.map((event, index) => (
                  <Card
                    key={event.id || event.Link || index}
                    style={styles.eventCard}
                    onPress={() => handleEventPress(event)}
                  >
                    <Card.Content>
                      <View style={styles.eventContent}>
                        <View style={styles.eventInfo}>
                          <Title style={styles.eventTitle}>{event.RalliAdi}</Title>
                          <Paragraph style={styles.eventDate}>
                            {new Date(event.Tarih).toLocaleDateString()}
                          </Paragraph>
                        </View>
                        <Chip mode="outlined" textStyle={styles.chipText}>
                          Upcoming
                        </Chip>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <View style={styles.eventSection}>
                <Title style={styles.sectionTitle}>📚 Past Rallies</Title>
                {pastEvents.map((event, index) => (
                  <Card
                    key={event.id || event.Link || index}
                    style={styles.eventCard}
                    onPress={() => handleEventPress(event)}
                  >
                    <Card.Content>
                      <View style={styles.eventContent}>
                        <View style={styles.eventInfo}>
                          <Title style={styles.eventTitle}>{event.RalliAdi}</Title>
                          <Paragraph style={styles.eventDate}>
                            {new Date(event.Tarih).toLocaleDateString()}
                          </Paragraph>
                        </View>
                        <Chip mode="outlined" textStyle={styles.chipText}>
                          Finished
                        </Chip>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Surface style={styles.emptyState}>
            <Text style={styles.emptyStateText}>📅</Text>
            <Title style={styles.emptyStateTitle}>No events found</Title>
            <Paragraph style={styles.emptyStateDescription}>
              No events found for the selected period.
            </Paragraph>
          </Surface>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  eventsContainer: {
    gap: 24,
  },
  eventSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  eventContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  chipText: {
    fontSize: 12,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    borderRadius: 12,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateDescription: {
    textAlign: 'center',
    color: '#666',
  },
});