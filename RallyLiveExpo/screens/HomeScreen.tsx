import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Appbar,
  Surface,
} from 'react-native-paper';
import { RallySlider } from '../components/RallySlider';
import { LiveRallies } from '../components/LiveRallies';
import { RallyNews } from '../components/RallyNews';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="RallyLive Net" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      
      <ScrollView
        style={styles.scrollView}
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E3A8A',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
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
});