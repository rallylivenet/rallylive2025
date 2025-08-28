import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  ActivityIndicator,
  Chip,
  Surface,
  Text,
} from 'react-native-paper';
import { router } from 'expo-router';

interface LiveRally {
  id: string;
  name: string;
  status: 'Live' | 'Finished' | 'Upcoming';
  link: string;
}

export function LiveRallies() {
  const [rallies, setRallies] = useState<LiveRally[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRallies();
  }, []);

  const fetchRallies = async () => {
    try {
      const response = await fetch('https://www.rallylive.net/wp-json/rally/v1/live-results?limit=15');
      if (!response.ok) {
        throw new Error('Failed to fetch live rallies');
      }
      
      const data = await response.json();
      const mappedRallies = await Promise.all(data.map(async (rally: any) => {
        let status: LiveRally['status'] = 'Upcoming';
        let link = `/rally/${rally.rid}`;

        if (rally.rid) {
          try {
            const stageResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-sonetap.php?rid=${rally.rid}`);
            if (stageResponse.ok) {
              const stageData = await stageResponse.json();
              if (stageData && stageData.sonEtap && stageData.sonEtap !== '0') {
                link = `/rally/${rally.rid}/${stageData.sonEtap}`;
                status = 'Live';
              }
            }
          } catch (e) {
            console.error(`Failed to fetch stage data for rally ${rally.rid}`, e);
          }
        }
        
        return {
          id: rally.rid,
          name: rally.title,
          status,
          link,
        };
      }));

      setRallies(mappedRallies);
    } catch (error) {
      console.error('Failed to fetch live rallies:', error);
      Alert.alert('Error', 'Could not load the list of live rallies.');
    } finally {
      setLoading(false);
    }
  };

  const handleRallyPress = (rally: LiveRally) => {
    router.push(rally.link);
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title style={styles.title}>🏁 Live Rallies</Title>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.ralliesList}>
            {rallies.length > 0 ? (
              rallies.map((rally) => (
                <Surface
                  key={rally.id}
                  style={styles.rallyItem}
                  onTouchEnd={() => handleRallyPress(rally)}
                >
                  <View style={styles.rallyContent}>
                    <Text style={styles.rallyName} numberOfLines={2}>
                      {rally.name}
                    </Text>
                    <Chip
                      mode="outlined"
                      style={[
                        styles.statusChip,
                        rally.status === 'Live' && styles.liveChip
                      ]}
                      textStyle={[
                        styles.chipText,
                        rally.status === 'Live' && styles.liveChipText
                      ]}
                    >
                      {rally.status}
                    </Chip>
                  </View>
                </Surface>
              ))
            ) : (
              <Text style={styles.emptyText}>
                No live rallies at the moment.
              </Text>
            )}
          </View>
        )}
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
  ralliesList: {
    gap: 8,
  },
  rallyItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    elevation: 1,
  },
  rallyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  rallyName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  chipText: {
    fontSize: 12,
  },
  liveChip: {
    backgroundColor: '#DC2626',
  },
  liveChipText: {
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 16,
  },
});