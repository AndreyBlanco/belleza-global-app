import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { Colors } from '../theme/colors';
import { getClients, insertAppointment } from '../database/database';

export default function CreateAppointmentScreen({
  date,
  time,
  onSave,
  onCancel
}) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [notes, setNotes] = useState('');

  const normalizedDate =
    typeof date === 'string'
      ? date
      : new Date(date).toISOString().split('T')[0];

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  const saveAppointment = async () => {
    if (!selectedClient) return;

    await insertAppointment(
      selectedClient,
      normalizedDate,
      time,
      notes
    );

    onSave();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nueva cita</Text>
        <Text style={styles.subtitle}>
          {normalizedDate} · {time}
        </Text>
      </View>

      {/* Cliente */}
      <Text style={styles.label}>Cliente</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedClient}
          onValueChange={value => setSelectedClient(value)}
        >
          <Picker.Item label="-- Seleccionar cliente --" value={null} />
          {clients.map(client => (
            <Picker.Item
              key={client.id}
              label={client.name}
              value={client.id}
            />
          ))}
        </Picker>
      </View>

      {/* Notas */}
      <Text style={styles.label}>Servicio / Notas</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Corte, Barba, Cejas..."
        value={notes}
        onChangeText={setNotes}
      />

      {/* Acciones */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.button,
            !selectedClient && { opacity: 0.5 }
          ]}
          onPress={saveAppointment}
          disabled={!selectedClient}
        >
          <Text style={styles.buttonText}>Guardar cita</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancel}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.textSecondary,
    marginTop: 4
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 8,
    marginTop: 12
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden'
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Montserrat-Regular'
  },
  actions: {
    marginTop: 30
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center'
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16
  },
  cancel: {
    textAlign: 'center',
    marginTop: 14,
    color: Colors.textSecondary
  }
});