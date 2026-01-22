import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../theme/colors';
import { getAppointmentsByDate } from '../database/database';
import { getWorkHours } from '../database/settings';

import AgendaHeader from '../components/agenda/AgendaHeader';
import DaySwipe from '../components/agenda/DaySwipe';
import StatusFilter from '../components/agenda/StatusFilter';
import TimeSlotItem from '../components/agenda/TimeSlotItem';
import AppointmentModal from '../components/agenda/AppointmentModal';
import CanceledSlotModal from '../components/agenda/CanceledSlotModal';
import CreateAppointmentScreen from './CreateAppointmentScreen';

/* =========================
   UTILITIES
========================= */

const getLocalDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const buildTimeSlots = (appointments, startHour, endHour) => {
  const slots = [];

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 15) {
      const time = `${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}`;

      const matches = appointments.filter(a => a.time === time);

      let slot = { time, status: 'available' };

      if (matches.length > 0) {
        const active =
          matches.find(a => a.status === 'confirmed') ||
          matches.find(a => a.status === 'pending');

        if (active) {
          slot = {
            time,
            status: active.status,
            name: active.name,
            service: active.notes,
            appointmentId: active.id
          };
        } else {
          const canceled = matches.find(a => a.status === 'canceled');
          if (canceled) {
            slot = {
              time,
              status: 'canceled',
              name: canceled.name,
              service: canceled.notes,
              appointmentId: canceled.id
            };
          }
        }
      }

      slots.push(slot);
    }
  }

  return slots;
};

/* =========================
   SCREEN
========================= */

export default function AgendaScreen() {
  const [date, setDate] = useState(getLocalDateString());
  const [slots, setSlots] = useState([]);
  const [filter, setFilter] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCanceledModal, setShowCanceledModal] = useState(false);

  const [workStartHour, setWorkStartHour] = useState(9);
  const [workEndHour, setWorkEndHour] = useState(17);

  useEffect(() => {
    loadWorkHours();
  }, []);

  useEffect(() => {
    loadAgenda();
  }, [date, workStartHour, workEndHour]);

  const loadWorkHours = async () => {
    const hours = await getWorkHours();
    setWorkStartHour(parseInt(hours.work_start.split(':')[0], 10));
    setWorkEndHour(parseInt(hours.work_end.split(':')[0], 10));
  };

  const loadAgenda = async () => {
    const appointments = await getAppointmentsByDate(date);
    setSlots(
      buildTimeSlots(
        appointments,
        workStartHour,
        workEndHour
      )
    );
  };

  const handleSlotPress = (slot) => {
    if (slot.status === 'confirmed' || slot.status === 'pending') {
      setSelectedSlot(slot);
      setShowModal(true);
      return;
    }

    if (slot.status === 'canceled') {
      setSelectedSlot(slot);
      setShowCanceledModal(true);
      return;
    }

    setSelectedSlot(slot);
    setCreating(true);
  };

  if (creating && selectedSlot) {
    return (
      <CreateAppointmentScreen
        date={date}
        time={selectedSlot.time}
        onSave={async () => {
          setCreating(false);
          setSelectedSlot(null);
          await loadAgenda();
        }}
        onCancel={() => {
          setCreating(false);
          setSelectedSlot(null);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <AgendaHeader date={date} onChangeDate={setDate} />

      <View style={styles.topSection}>
        <DaySwipe selectedDate={date} onChange={setDate} />
        <StatusFilter active={filter} onChange={setFilter} />
      </View>

      <FlatList
        data={filter === null ? slots : slots.filter(s => s.status === filter)}
        keyExtractor={(item) => item.time}
        renderItem={({ item }) => (
          <TimeSlotItem slot={item} onPress={handleSlotPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <AppointmentModal
        visible={showModal}
        slot={selectedSlot}
        onClose={() => setShowModal(false)}
        onUpdated={async () => {
          setShowModal(false);
          setSelectedSlot(null);
          await loadAgenda();
        }}
      />

      <CanceledSlotModal
        visible={showCanceledModal}
        onReactivate={() => {
          setShowCanceledModal(false);
          setShowModal(true);
        }}
        onCreateNew={() => {
          setShowCanceledModal(false);
          setCreating(true);
        }}
        onClose={() => {
          setShowCanceledModal(false);
          setSelectedSlot(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background
  },
  topSection: {
    paddingTop: 8,
    paddingBottom: 8
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    alignItems: 'stretch'
  }
});