import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Chip,
  Surface,
  Text,
} from 'react-native-paper';
import { Rally } from '../types/rally';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export function RallySlider() {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRallies();
  }, []);

  const fetchRallies = async () => {
    try {
      const response = await fetch('https://www.rallylive.net/wp-json/rally/v1/live-results?limit=10');
      if (!response.ok) {
        throw new Error('Failed to fetch rallies');
      }
      
      const data = await response.json();
      const mappedRallies = await Promise.all(data.map(async (rally: any) => {
        let lastStageData = {
          name: 'TBA',
          distance: 'TBA',
          winner: 'TBA',
          leader: 'TBA',
          number: '0',
        };

        if (rally.rid && rally.rid.trim() !== '') {
          try {
            const stageResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-sonetap.php?rid=${rally.rid}`);
            if (stageResponse.ok) {
              const stageData = await stageResponse.json();
              if (stageData && stageData.sonEtap && stageData.sonEtap !== '0') {
                lastStageData = {
                  name: `SS${stageData.sonEtap} ${stageData.name || 'TBA'}`,
                  distance: `${stageData.km || '0.00'} km`,
                  winner: 'Loading...',
                  leader: 'Loading...',
                  number: stageData.sonEtap || '0',
                };
              }
            }
          } catch (e) {
            console.error(`Failed to fetch stage data for rally ${rally.rid}`, e);
          }
        }

        return {
          id: rally.rid,
          name: rally.title,
          image: rally.thumbnail,
          lastStage: lastStageData,
          date: rally.date,
        };
      }));

      setRallies(mappedRallies);
    } catch (error) {
      console.error('Failed to fetch rallies:', error);
      Alert.alert('Error', 'Could not load rally data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Surface style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading rallies...</Text>
      </Surface>
    );
  }

  if (rallies.length === 0) {
    return (
      <Surface style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No live rallies found.</Text>
      </Surface>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 16}
        contentContainerStyle={styles.scrollContainer}
      >
        {rallies.map((rally) => {
          const isUpcoming = rally.lastStage.number === '0';
          
          return (
            <Card
              key={rally.id}
              style={[styles.rallyCard, { width: CARD_WIDTH }]}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: rally.image || 'https://placehold.co/720x380.png' }}
                  style={styles.rallyImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
                <View style={styles.imageContent}>
                  <Title style={styles.rallyTitle}>{rally.name}</Title>
                  {!isUpcoming && (
                    <Chip mode="flat" style={styles.liveChip} textStyle={styles.liveChipText}>
                      🔴 LIVE
                    </Chip>
                  )}
                </View>
              </View>

              <Card.Content style={styles.cardContent}>
                {isUpcoming ? (
                  <View style={styles.upcomingContent}>
                    <Title style={styles.upcomingTitle}>Rally starts soon!</Title>
                    <Paragraph style={styles.upcomingDate}>
                      {new Date(rally.date).toLocaleDateString()}
                    </Paragraph>
                  </View>
                ) : (
                  <View style={styles.stageInfo}>
                    <Title style={styles.stageTitle}>Latest Stage: {rally.lastStage.name}</Title>
                    <View style={styles.stageDetails}>
                      <View style={styles.stageDetail}>
                        <Text style={styles.detailLabel}>🏁 Distance:</Text>
                        <Text style={styles.detailValue}>{rally.lastStage.distance}</Text>
                      </View>
                      <View style={styles.stageDetail}>
                        <Text style={styles.detailLabel}>🏆 Stage Winner:</Text>
                        <Text style={styles.detailValue}>{rally.lastStage.winner}</Text>
                      </View>
                      <View style={styles.stageDetail}>
                        <Text style={styles.detailLabel}>👑 Overall Leader:</Text>
                        <Text style={styles.detailValue}>{rally.lastStage.leader}</Text>
                      </View>
                    </View>
                  </View>
                )}

                <Button
                  mode="contained"
                  style={styles.viewButton}
                >
                  View Results
                </Button>
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    borderRadius: 12,
    elevation: 2,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    borderRadius: 12,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  rallyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  rallyImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  imageContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rallyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  liveChip: {
    backgroundColor: '#DC2626',
  },
  liveChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  upcomingContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  upcomingDate: {
    fontSize: 16,
    color: '#666',
  },
  stageInfo: {
    marginBottom: 16,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stageDetails: {
    gap: 8,
  },
  stageDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  viewButton: {
    backgroundColor: '#1E3A8A',
  },
});