// CreateAppointmentScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '../theme/colors';
import {
  getClients,
  insertAppointment,
  getAppointmentsByDate
} from '../database/database';
import { getWorkHours } from '../database/settings';

import ClientPickerModal from '../components/clients/ClientPickerModal';
import TimePickerModal from '../components/appointments/TimePickerModal';
import DurationPickerModal from '../components/appointments/DurationPickerModal';

/* =========================
   UTILITIES
========================= */

const buildTimes = (startTime, blocks) => {
  const [h, m] = startTime.split(':').map(Number);
  const times = [];
  let minutes = h * 60 + m;

  for (let i = 0; i < blocks; i++) {
    const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    times.push(`${hh}:${mm}`);
    minutes += 15;
  }
  return times;
};

const isOutsideWorkHours = (time, start, end) =>
  time < start || time >= end;

/* =========================
   SCREEN
========================= */

export default function CreateAppointmentScreen({
  date,
  time,
  onSave,
  onCancel
}) {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [workHours, setWorkHours] = useState(null);

  const [selectedClient, setSelectedClient] = useState(null);
  const [notes, setNotes] = useState('');

  const [selectedTime, setSelectedTime] = useState(time);
  const [blocks, setBlocks] = useState(1);

  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const normalizedDate =
    typeof date === 'string'
      ? date
      : new Date(date).toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setClients(await getClients());
    setAppointments(await getAppointmentsByDate(normalizedDate));
    setWorkHours(await getWorkHours());
  };

  const validateAndSave = async () => {
    if (!selectedClient) return;

    const times = buildTimes(selectedTime, blocks);

    // ✅ Validar disponibilidad
    for (const t of times) {
      const conflict = appointments.find(
        a =>
          a.time === t &&
          (a.status === 'confirmed' || a.status === 'pending')
      );
      if (conflict) {
        Alert.alert(
          'Horario no disponible',
          `El bloque ${t} ya está ocupado.`
        );
        return;
      }
    }

    // ✅ Advertir fuera de horario
    const outside = workHours
      ? times.some(t =>
          isOutsideWorkHours(
            t,
            workHours.work_start,
            workHours.work_end
          )
        )
      : false;

    if (outside) {
      Alert.alert(
        'Fuera de horario',
        'Esta cita está fuera del horario laboral. ¿Deseas continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => save(times) }
        ]
      );
      return;
    }

    save(times);
  };

  const save = async (times) => {
    for (let i = 0; i < times.length; i++) {
      await insertAppointment(
        selectedClient.id,
        normalizedDate,
        times[i],
        i === 0 ? notes : 'Continuación'
      );
    }
    onSave();
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nueva cita</Text>
        <Text style={styles.headerSubtitle}>{normalizedDate}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* CLIENTE */}
        <Text style={styles.label}>Cliente</Text>
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => setShowClientPicker(true)}
        >
          <Text style={styles.selectText}>
            {selectedClient
              ? selectedClient.name
              : 'Seleccionar cliente'}
          </Text>
        </TouchableOpacity>

        {/* HORA */}
        <Text style={styles.label}>Hora de inicio</Text>
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.selectText}>
            {selectedTime}
          </Text>
        </TouchableOpacity>

        {/* DURACIÓN */}
        <Text style={styles.label}>Duración</Text>
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => setShowDurationPicker(true)}
        >
          <Text style={styles.selectText}>
            {blocks * 15} minutos
          </Text>
        </TouchableOpacity>

        {/* NOTAS */}
        <Text style={styles.label}>Servicio / Notas</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Corte, Barba, Cejas..."
          value={notes}
          onChangeText={setNotes}
        />

        {/* ACCIONES */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !selectedClient && { opacity: 0.5 }
            ]}
            onPress={validateAndSave}
            disabled={!selectedClient}
          >
            <Text style={styles.primaryButtonText}>
              Guardar cita
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancel}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODALS */}
      <ClientPickerModal
        visible={showClientPicker}
        clients={clients}
        onSelect={(client) => {
          setSelectedClient(client);
          setShowClientPicker(false);
        }}
        onClose={() => setShowClientPicker(false)}
      />

      <TimePickerModal
        visible={showTimePicker}
        value={selectedTime}
        onSelect={setSelectedTime}
        onClose={() => setShowTimePicker(false)}
      />

      <DurationPickerModal
        visible={showDurationPicker}
        value={blocks}
        onSelect={setBlocks}
        onClose={() => setShowDurationPicker(false)}
      />
    </View>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background
  },

  header: {
    backgroundColor: Colors.primary,
    paddingTop: 32,
    paddingBottom: 20,
    alignItems: 'center'
  },
  headerTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: Colors.white
  },
  headerSubtitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: Colors.white,
    marginTop: 6
  },

  content: {
    padding: 20
  },

  label: {
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 8,
    marginTop: 14
  },

  selectBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14
  },
  selectText: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.textSecondary
  },

  input: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    fontFamily: 'Montserrat-Regular'
  },

  actions: {
    marginTop: 30
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center'
  },
  primaryButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.white
  },
  cancel: {
    textAlign: 'center',
    marginTop: 14,
    color: Colors.textSecondary
  }
});