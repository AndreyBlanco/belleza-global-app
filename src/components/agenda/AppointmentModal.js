import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';

import { Colors } from '../../theme/colors';
import { updateAppointment } from '../../database/database';

export default function AppointmentModal({
  visible,
  slot,
  onClose,
  onUpdated
}) {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (slot) {
      setNotes(slot.service || '');
    }
  }, [slot]);

  if (!slot) return null;

  const save = async (status) => {
    if (!slot.appointmentId) return;

    await updateAppointment(
      slot.appointmentId,
      status,
      notes
    );

    onUpdated();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.name}>{slot.name}</Text>
          <Text style={styles.time}>{slot.time}</Text>

          <Text style={styles.label}>Servicio / Notas</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder="Servicio o notas"
            multiline
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.confirmed }]}
              onPress={() => save('confirmed')}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.pending }]}
              onPress={() => save('pending')}
            >
              <Text style={styles.buttonText}>Pendiente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.canceled }]}
              onPress={() => save('canceled')}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20
  },
  time: {
    marginTop: 4,
    color: Colors.textSecondary
  },
  label: {
    marginTop: 16,
    fontFamily: 'Montserrat-SemiBold'
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    fontFamily: 'Montserrat-Regular',
    minHeight: 60
  },
  actions: {
    marginTop: 20
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Montserrat-SemiBold'
  },
  close: {
    textAlign: 'center',
    marginTop: 10,
    color: Colors.textSecondary
  }
});