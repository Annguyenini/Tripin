import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Trip_Data } from '../../../types/trip_data.types';
const default_image = require("../../../../assets/icon.png");
import { Image } from 'expo-image';
export interface TripSummary {
  id: string;
  title: string;
  coverImageUrl?: string | null;
}

interface TripsRowProps {
  trips: Trip_Data[];
  onPressTrip?: (trip:Trip_Data) => void;
  emptyLabel?: string;
}

/**
 * Horizontal scroll of a user's trips shown inside their profile card.
 * Read-only summary — tapping a trip is expected to route to a
 * permission-checked trip detail screen (owner vs. viewer access
 * is resolved by the parent/backend, not this component).
 */
export function TripsRow({ trips,onPressTrip, emptyLabel = 'No trips yet' }: TripsRowProps) {
  if (trips.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>{emptyLabel}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {trips.map((trip) => (
        <TouchableOpacity
          key={trip.trip_id}
          style={styles.thumb}
          onPress={() => onPressTrip?.(trip)}
          activeOpacity={0.8}
        >
          <Image source={ trip.image ? {uri:trip.image} : default_image  } style={styles.thumbImage} />

          <View style={styles.thumbLabelWrap}>
            <Text style={styles.thumbLabel} numberOfLines={1}>
              {trip.trip_name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: 10,
    paddingRight: 4,
  },
  thumb: {
    width: 110,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    backgroundColor: '#ECEBE5',
  },
  thumbLabelWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  thumbLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyWrap: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#8A8A8E',
  },
});
