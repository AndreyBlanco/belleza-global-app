import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

const STATUSES = [
  { key: 'available', label: 'Disponible', color: Colors.available },
  { key: 'confirmed', label: 'Confirmado', color: Colors.confirmed },
  { key: 'pending', label: 'Pendiente', color: Colors.pending },
  { key: 'canceled', label: 'Cancelado', color: Colors.canceled }
];

export default function StatusFilter({ active, onChange }) {
  const handlePress = (key) => {
    onChange(active === key ? null : key);
  };

  return (
    <View style={styles.container}>
      {STATUSES.map(s => {
        const isActive = active === s.key;

        return (
          <TouchableOpacity
            key={s.key}
            onPress={() => handlePress(s.key)}
            style={[
              styles.button,
              { backgroundColor: s.color },
              !isActive && active !== null && { opacity: 0.4 }
            ]}
          >
            <Text style={styles.text}>{s.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center'
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    color: Colors.white
  }
});