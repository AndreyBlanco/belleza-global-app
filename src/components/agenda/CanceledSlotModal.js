import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Colors } from '../../theme/colors';

export default function CanceledSlotModal({
  visible,
  onReactivate,
  onCreateNew,
  onClose
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Cita cancelada
          </Text>

          <Text style={styles.subtitle}>
            Este bloque tiene una cita cancelada.
            ¿Qué deseas hacer?
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.confirmed }]}
            onPress={onReactivate}
          >
            <Text style={styles.buttonText}>
              Reactivar cita
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.primary }]}
            onPress={onCreateNew}
          >
            <Text style={styles.buttonText}>
              Crear nueva cita
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>
              Cancelar
            </Text>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '85%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    marginBottom: 6
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.textSecondary,
    marginBottom: 20
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.white
  },
  cancel: {
    textAlign: 'center',
    marginTop: 8,
    color: Colors.textSecondary
  }
});