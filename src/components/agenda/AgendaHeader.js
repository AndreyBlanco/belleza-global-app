import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../theme/colors';

const getTodayString = () => {
  const d = new Date();
  return (
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
  );
};

export default function AgendaHeader({ date, onChangeDate }) {
  const [showPicker, setShowPicker] = useState(false);

  const today = getTodayString();
  const isToday = date === today;

  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Agenda</Text>

        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text style={styles.date}>{formatted}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => onChangeDate(today)}
        style={[
          styles.todayButton,
          isToday && styles.todayActive
        ]}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.todayText,
            isToday && styles.todayTextActive
          ]}
        >
          Hoy
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={new Date(date + 'T00:00:00')}
          mode="date"
          display="calendar"
          onChange={(_, selected) => {
            setShowPicker(false);
            if (selected) {
              onChangeDate(
                selected.getFullYear() + '-' +
                String(selected.getMonth() + 1).padStart(2, '0') + '-' +
                String(selected.getDate()).padStart(2, '0')
              );
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  center: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.white
  },
  date: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginTop: 4,
    textTransform: 'capitalize'
  },
  todayButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14
  },
  todayActive: {
    backgroundColor: Colors.available
  },
  todayText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)'
  },
  todayTextActive: {
    color: Colors.white
  }
});