import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Chip,
  Surface,
} from 'react-native-paper';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { RallySlider } from '../components/RallySlider';
import { LiveRallies } from '../components/LiveRallies';
import { RallyNews } from '../components/RallyNews';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Rally Slider Section */}
        <Surface style={styles.section}>
          <RallySlider />
        </Surface>

        {/* Main Content Grid */}
        <View style={styles.gridContainer}>
          {/* Rally News */}
          <Surface style={[styles.section, styles.newsSection]}>
            <RallyNews />
          </Surface>

          {/* Live Rallies Sidebar */}
          <Surface style={[styles.section, styles.sidebarSection]}>
            <LiveRallies />
          </Surface>
        </View>

        {/* Navigation Cards */}
        <View style={styles.navigationGrid}>
          <Card style={styles.navCard} onPress={() => router.push('/calendar')}>
            <Card.Content style={styles.navCardContent}>
              <Title style={styles.navCardTitle}>📅 Calendar</Title>
              <Paragraph>View upcoming rallies</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.navCard} onPress={() => Alert.alert('Coming Soon', 'Push notifications will be available soon!')}>
            <Card.Content style={styles.navCardContent}>
              <Title style={styles.navCardTitle}>🔔 Notifications</Title>
              <Paragraph>Manage alerts</Paragraph>
            </Card.Content>
          </Card>
        </View>
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
  section: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  gridContainer: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 16,
  },
  newsSection: {
    flex: width > 768 ? 2 : 1,
  },
  sidebarSection: {
    flex: width > 768 ? 1 : 1,
  },
  navigationGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  navCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  navCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});