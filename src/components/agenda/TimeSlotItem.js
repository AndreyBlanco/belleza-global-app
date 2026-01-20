import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';

const STATUS_COLORS = {
  available: Colors.available,
  confirmed: Colors.confirmed,
  pending: Colors.pending,
  canceled: Colors.canceled
};

export default function TimeSlotItem({ slot, onPress }) {
  const isAvailable = slot.status === 'available';

  return (
    <View style={styles.row}>
      <Text style={styles.time}>{slot.time} am</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress(slot)}
        style={[
          styles.card,
          { backgroundColor: STATUS_COLORS[slot.status] }
        ]}
      >
        {isAvailable ? (
          <Text style={styles.availableText}>Disponible</Text>
        ) : (
          <>
            <Text style={styles.name}>{slot.name}</Text>
            <Text style={styles.service}>{slot.service}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  time: {
    width: 80,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16
  },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 16
  },
  availableText: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 22,
    color: Colors.white
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.white
  },
  service: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.white,
    marginTop: 4
  }
});