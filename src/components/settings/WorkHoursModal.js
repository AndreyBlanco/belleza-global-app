import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../theme/colors';
import { getWorkHours, updateWorkHours } from '../../database/settings';

const buildDateFromTime = (time) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h);
  d.setMinutes(m);
  d.setSeconds(0);
  return d;
};

const formatTime = (date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;

export default function WorkHoursModal({ visible, onClose }) {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      loadHours();
    }
  }, [visible]);

  const loadHours = async () => {
    setLoading(true);
    const hours = await getWorkHours();
    setStart(buildDateFromTime(hours.work_start));
    setEnd(buildDateFromTime(hours.work_end));
    setLoading(false);
  };

  const save = async () => {
    await updateWorkHours(formatTime(start), formatTime(end));
    onClose(true);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Horario laboral</Text>

          {!loading && (
            <>
              {/* START */}
              <TouchableOpacity
                style={styles.row}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.label}>Hora inicio</Text>
                <Text style={styles.value}>{formatTime(start)}</Text>
              </TouchableOpacity>

              {/* END */}
              <TouchableOpacity
                style={styles.row}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.label}>Hora cierre</Text>
                <Text style={styles.value}>{formatTime(end)}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ACTIONS */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onClose(false)}>
              <Text style={styles.cancel}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={save}>
              <Text style={styles.save}>Guardar</Text>
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={start}
              mode="time"
              is24Hour
              display={Platform.OS === 'android' ? 'clock' : 'spinner'}
              onChange={(_, date) => {
                setShowStartPicker(false);
                if (date) setStart(date);
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={end}
              mode="time"
              is24Hour
              display={Platform.OS === 'android' ? 'clock' : 'spinner'}
              onChange={(_, date) => {
                setShowEndPicker(false);
                if (date) setEnd(date);
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16
  },
  value: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.primary
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  cancel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16
  },
  save: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.primary
  }
});