import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../theme/colors';
import {
  getClients,
  getAppointmentsBetween,
  getAppointmentsByDate,
  updateAppointment,
  getClientAppointmentNotes
} from '../database/database';

import ClientPickerModal from '../components/clients/ClientPickerModal';
import NewClientModal from '../components/clients/NewClientModal';
import EditClientModal from '../components/clients/EditClientModal';

const pencilIcon = require('../../assets/icons/pencil.png');

const formatDateTime = (date, time) =>
  new Date(`${date}T${time}`).toLocaleString('es-CR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

export default function ClientsScreen() {
  const [clients, setClients] = useState([]);
  const [activeClient, setActiveClient] = useState(null);

  const [futureAppointments, setFutureAppointments] = useState([]);
  const [notesList, setNotesList] = useState([]);

  const [showPicker, setShowPicker] = useState(false);
  const [showNewClient, setShowNewClient] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
    if (!activeClient && data.length > 0) {
      setActiveClient(data[0]);
    }
  };

  const loadClientData = async (client) => {
    if (!client) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const future = '2100-01-01';

    const all = await getAppointmentsBetween(today, future);

    const upcoming = all
      .filter(
        a =>
          a.client_id === client.id &&
          new Date(`${a.date}T${a.time}`) >= now
      )
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`) -
          new Date(`${b.date}T${b.time}`)
      );

    setFutureAppointments(upcoming);

    const rawNotes = await getClientAppointmentNotes(client.id);
    const cleaned = [
      ...new Set(
        rawNotes
          .map(n => n.notes)
          .filter(
            n =>
              n &&
              n.trim() !== '' &&
              n.toLowerCase() !== 'continuación'
          )
      )
    ];
    setNotesList(cleaned);
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (activeClient) {
      loadClientData(activeClient);
    }
  }, [activeClient]);

  const changeStatus = async (appt, status) => {
    if (status === 'confirmed' && appt.status === 'canceled') {
      const sameSlot = await getAppointmentsByDate(appt.date);
      const conflict = sameSlot.find(
        a =>
          a.time === appt.time &&
          a.id !== appt.id &&
          (a.status === 'confirmed' || a.status === 'pending')
      );
      if (conflict) {
        Alert.alert(
          'No disponible',
          'Ya existe otra cita activa en este horario.'
        );
        return;
      }
    }

    await updateAppointment(appt.id, status, appt.notes);
    loadClientData(activeClient);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return Colors.confirmed;
      case 'pending':
        return Colors.pending;
      case 'canceled':
        return Colors.canceled;
      default:
        return Colors.primary;
    }
  };

  const statusLabel = (status) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmado';
    case 'pending':
      return 'Pendiente';
    case 'canceled':
      return 'Cancelado';
    default:
      return status;
  }
};

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clientes</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text style={styles.headerClient}>
            {activeClient?.name || 'Seleccionar cliente'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeClient && (
          <>
            {/* INFO */}
            <View style={styles.infoRow}>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => setShowEditClient(true)}
              >
                <Image
                  source={pencilIcon}
                  style={styles.editIconImage}
                />
              </TouchableOpacity>

              <View style={styles.infoText}>
                <Text style={styles.label}>
                  Teléfono:{' '}
                  <Text style={styles.value}>
                    {activeClient.phone}
                  </Text>
                </Text>
                <Text style={styles.label}>
                  Correo:{' '}
                  <Text style={styles.value}>
                    {activeClient.email || '-'}
                  </Text>
                </Text>
              </View>
            </View>

            {/* UPCOMING APPOINTMENTS */}
            <Text style={styles.sectionTitle}>Próximas citas</Text>
            <View style={styles.appointmentsBox}>
              {futureAppointments.length === 0 ? (
                <Text style={styles.empty}>—</Text>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                >
                  {futureAppointments.map(appt => (
                    <View
                      key={appt.id}
                      style={[
                        styles.appointmentRow,
                        { backgroundColor: statusColor(appt.status) }
                      ]}
                    >
                      <Text style={styles.appointmentDate}>
                        {formatDateTime(appt.date, appt.time)}
                      </Text>

                      <View style={styles.actionsRow}>
                        {['confirmed', 'pending', 'canceled'].map(s => (
                          <TouchableOpacity
                            key={s}
                            onPress={() => changeStatus(appt, s)}
                          >
                            <Text
                              style={[
                                styles.action,
                                appt.status === s && styles.actionActive
                              ]}
                            >
                              {statusLabel(s)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* NOTES */}
            <Text style={styles.sectionTitle}>
              Servicios / Notas
            </Text>
            <View style={styles.notesBox}>
              {notesList.length === 0 ? (
                <Text style={styles.empty}>—</Text>
              ) : (
                notesList.map((n, i) => (
                  <Text key={i} style={styles.notesText}>
                    • {n}
                  </Text>
                ))
              )}
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.newClientButton}
          onPress={() => setShowNewClient(true)}
        >
          <Text style={styles.newClientText}>
            Registrar Nuevo Cliente
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODALS */}
      <ClientPickerModal
        visible={showPicker}
        clients={clients}
        onSelect={(client) => {
          setActiveClient(client);
          setShowPicker(false);
        }}
        onClose={() => setShowPicker(false)}
      />

      <NewClientModal
        visible={showNewClient}
        onSaved={(client) => {
          setShowNewClient(false);
          setActiveClient(client);
          loadClients();
        }}
        onClose={() => setShowNewClient(false)}
      />

      <EditClientModal
        visible={showEditClient}
        client={activeClient}
        onSaved={(updated) => {
          setShowEditClient(false);
          setActiveClient(updated);
          loadClients();
        }}
        onClose={() => setShowEditClient(false)}
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
  headerClient: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 26,
    color: Colors.white,
    marginTop: 6
  },
  content: {
    padding: 20
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  editIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  editIconImage: {
    width: 24,
    height: 24
  },
  infoText: {
    flex: 1
  },

  label: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16
  },
  value: {
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.primary
  },

  sectionTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    marginBottom: 8
  },

  appointmentsBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 8,
    height: 172,
    marginBottom: 24
  },
  appointmentRow: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center'
  },
  appointmentDate: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8
  },
  appointmentText: {
    fontFamily: 'Montserrat-SemiBold'
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },

  action: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.white,
    opacity: 0.7
  },
  actionActive: {
    fontFamily: 'Montserrat-Bold',
    opacity: 1,
  },

  notesBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    minHeight: 80,
    marginBottom: 30
  },
  notesText: {
    fontFamily: 'Montserrat-Regular'
  },
  empty: {
    textAlign: 'center',
    color: Colors.textSecondary
  },

  newClientButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center'
  },
  newClientText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.white
  }
});