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
  DataTable,
  ActivityIndicator,
  Chip,
  Button,
  Surface,
  Text,
} from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { StageResult, OverallResult } from '../../../types/rally';

export default function RallyStageScreen() {
  const { rid, stage_no } = useLocalSearchParams<{ rid: string; stage_no: string }>();
  const [stageResults, setStageResults] = useState<StageResult[]>([]);
  const [overallResults, setOverallResults] = useState<OverallResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stageName, setStageName] = useState('');
  const [activeTab, setActiveTab] = useState<'stage' | 'overall'>('stage');

  const fetchData = async () => {
    try {
      const [stageResponse, overallResponse, itineraryResponse] = await Promise.all([
        fetch(`https://www.rallylive.net/mobileapp/v1/json-stagetimes.php?rid=${rid}&stage_no=${stage_no}`),
        fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rid}&stage_no=${stage_no}`),
        fetch(`https://www.rallylive.net/mobileapp/v1/rally-itinerary.php?rid=${rid}`)
      ]);

      if (stageResponse.ok) {
        const stageData = await stageResponse.json();
        setStageResults(stageData);
      }

      if (overallResponse.ok) {
        const overallData = await overallResponse.json();
        setOverallResults(overallData);
      }

      if (itineraryResponse.ok) {
        const itineraryData = await itineraryResponse.json();
        const currentStage = itineraryData.find((item: any) => item.no === stage_no);
        setStageName(currentStage ? `SS${stage_no} ${currentStage.name}` : `SS${stage_no}`);
      }
    } catch (error) {
      console.error('Failed to fetch rally data:', error);
      Alert.alert('Error', 'Failed to load rally data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [rid, stage_no]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderResultsTable = (data: (StageResult | OverallResult)[], type: 'stage' | 'overall') => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text>No results available</Text>
        </View>
      );
    }

    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={styles.rankColumn}>Rank</DataTable.Title>
          <DataTable.Title style={styles.driverColumn}>Driver</DataTable.Title>
          <DataTable.Title style={styles.timeColumn} numeric>Time</DataTable.Title>
        </DataTable.Header>

        {data.slice(0, 20).map((item, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell style={styles.rankColumn}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>{item.rank}</Text>
                <Text style={styles.doorNumber}>#{item.door_no}</Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell style={styles.driverColumn}>
              <View>
                <Text style={styles.driverName}>
                  {item.driver_surname.toUpperCase()}
                </Text>
                <Text style={styles.carInfo}>
                  {item.car_brand} {item.car_version}
                </Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell style={styles.timeColumn} numeric>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {type === 'stage' 
                    ? (item as StageResult).stage_time 
                    : (item as OverallResult).total_time
                  }
                </Text>
                <Text style={styles.diffText}>{item.diff_to_leader}</Text>
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading rally results...</Text>
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
          <Title style={styles.stageTitle}>{stageName}</Title>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            ← Back
          </Button>
        </Surface>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <Chip
            selected={activeTab === 'stage'}
            onPress={() => setActiveTab('stage')}
            style={styles.tabChip}
          >
            🏁 Stage Results
          </Chip>
          <Chip
            selected={activeTab === 'overall'}
            onPress={() => setActiveTab('overall')}
            style={styles.tabChip}
          >
            👥 Overall Standings
          </Chip>
        </View>

        {/* Results Table */}
        <Card style={styles.resultsCard}>
          <Card.Content>
            {activeTab === 'stage' 
              ? renderResultsTable(stageResults, 'stage')
              : renderResultsTable(overallResults, 'overall')
            }
          </Card.Content>
        </Card>
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
  stageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabChip: {
    flex: 1,
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  rankColumn: {
    flex: 1,
  },
  driverColumn: {
    flex: 3,
  },
  timeColumn: {
    flex: 2,
  },
  rankContainer: {
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  doorNumber: {
    fontSize: 12,
    color: '#666',
  },
  driverName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  carInfo: {
    fontSize: 12,
    color: '#666',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  diffText: {
    fontSize: 12,
    color: '#666',
  },
});