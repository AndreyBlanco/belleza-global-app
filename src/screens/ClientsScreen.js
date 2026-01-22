import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../theme/colors';
import {
  getClients,
  getClientAppointmentStats,
  getNextClientAppointment,
  getClientAppointmentNotes
} from '../database/database';

import ClientPickerModal from '../components/clients/ClientPickerModal';
import NewClientModal from '../components/clients/NewClientModal';
import EditClientModal from '../components/clients/EditClientModal';

const pencilIcon = require('../../assets/icons/pencil.png');

const formatDate = (date) =>
  new Date(date + 'T00:00:00').toLocaleDateString('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

export default function ClientsScreen() {
  const [clients, setClients] = useState([]);
  const [activeClient, setActiveClient] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    canceled: 0
  });

  const [nextAppointment, setNextAppointment] = useState(null);
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

  const loadHistory = async (client) => {
    if (!client) return;
    setStats(await getClientAppointmentStats(client.id));
    setNextAppointment(await getNextClientAppointment(client.id));
    setNotesList(await getClientAppointmentNotes(client.id));
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (activeClient) {
      loadHistory(activeClient);
    }
  }, [activeClient]);

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
            {/* INFO + EDIT ICON */}
            <View style={styles.infoRow}>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => setShowEditClient(true)}
                activeOpacity={0.7}
              >
                <Image
                  source={pencilIcon}
                  style={styles.editIconImage}
                  resizeMode="contain"
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

            {/* NEXT APPOINTMENT */}
            <View style={styles.nextAppointment}>
              <Text style={styles.nextTitle}>Próxima cita:</Text>
              <Text style={styles.nextDate}>
                {nextAppointment
                  ? `${formatDate(nextAppointment.date)} · ${nextAppointment.time}`
                  : '—'}
              </Text>
            </View>

            {/* STATS */}
            <View style={styles.statsRow}>
              <StatBox label="Total" value={stats.total} color={Colors.primary} />
              <StatBox label="Confirmado" value={stats.confirmed} color={Colors.confirmed} />
              <StatBox label="Pendiente" value={stats.pending} color={Colors.pending} />
              <StatBox label="Cancelado" value={stats.canceled} color={Colors.canceled} />
            </View>

            {/* NOTES */}
            <Text style={styles.sectionTitle}>Servicios / Notas:</Text>
            <View style={styles.notesBox}>
              {notesList.length === 0 ? (
                <Text style={styles.notesText}>—</Text>
              ) : (
                notesList.map((n, i) => (
                  <Text key={i} style={styles.notesText}>
                    • {n.notes}
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

function StatBox({ label, value, color }) {
  return (
    <View style={[styles.statBox, { backgroundColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

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
    marginBottom: 12
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

  nextAppointment: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center'
  },
  nextTitle: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.white
  },
  nextDate: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white,
    marginTop: 4,
    textAlign: 'center'
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statBox: {
    width: '23%',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center'
  },
  statValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.white
  },
  statLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.white
  },

  sectionTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    marginBottom: 8
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