import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../theme/colors';
import { Image } from 'react-native';
import {
  getAppointmentsByDate,
  getNextAppointmentsToday,
  getAppointmentsBetween
} from '../database/database';

const { width } = Dimensions.get('window');
const LOGO_WIDTH = width * 0.7;

const getLocalDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatLongDate = (date) =>
  new Date(date + 'T00:00:00').toLocaleDateString('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

export default function DashboardScreen() {
  const [todayStats, setTodayStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    canceled: 0
  });

  const [nextAppointments, setNextAppointments] = useState([]);
  const [periodCounts, setPeriodCounts] = useState({
    today: 0,
    tomorrow: 0,
    week: 0
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const today = new Date();
    const todayStr = getLocalDateString(today);

    const todayAppointments = await getAppointmentsByDate(todayStr);

    setTodayStats({
      total: todayAppointments.length,
      confirmed: todayAppointments.filter(a => a.status === 'confirmed').length,
      pending: todayAppointments.filter(a => a.status === 'pending').length,
      canceled: todayAppointments.filter(a => a.status === 'canceled').length
    });

    setNextAppointments(await getNextAppointmentsToday(3));

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const weekEnd = new Date(today);
    const day = weekEnd.getDay() || 7;
    weekEnd.setDate(today.getDate() + (7 - day));

    setPeriodCounts({
      today: todayAppointments.length,
      tomorrow: (
        await getAppointmentsByDate(getLocalDateString(tomorrow))
      ).length,
      week: (
        await getAppointmentsBetween(
          todayStr,
          getLocalDateString(weekEnd)
        )
      ).length
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={{
            width: LOGO_WIDTH,
            height: LOGO_WIDTH / 1.4
          }}
          resizeMode="contain"
        />

        <Text style={styles.welcome}>BIENVENIDA</Text>
        <Text style={styles.name}>Hannia Wallace</Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* RESUMEN HOY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {formatLongDate(getLocalDateString())}
          </Text>

          <View style={styles.row}>
            <StatCard label="Total" value={todayStats.total} color={Colors.primary} />
            <StatCard label="Confirmado" value={todayStats.confirmed} color={Colors.confirmed} />
            <StatCard label="Pendiente" value={todayStats.pending} color={Colors.pending} />
            <StatCard label="Cancelado" value={todayStats.canceled} color={Colors.canceled} />
          </View>
        </View>

        {/* NEXT APPOINTMENTS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Próximas citas</Text>

          {nextAppointments.map((a, i) => (
            <View
              key={i}
              style={[
                styles.appointment,
                { backgroundColor: Colors[a.status] }
              ]}
            >
              <Text style={styles.time}>{a.time}</Text>

              <View style={styles.appo}>
                <Text style={styles.client}>{a.name}</Text>
                <Text style={styles.service}>{a.notes}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* PERIOD COUNTS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Citas</Text>

          <View style={styles.row}>
            <StatCard label="Hoy" value={periodCounts.today} color={Colors.primary} />
            <StatCard label="Mañana" value={periodCounts.tomorrow} color={Colors.primary} />
            <StatCard label="Esta semana" value={periodCounts.week} color={Colors.primary} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, color }) {
  return (
    <View style={[styles.stat, { backgroundColor: color }]}>
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

  /* HEADER */
  header: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 10
  },
  welcome: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.white,
    fontSize: 20,
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    color: Colors.white
  },

  /* CONTENT */
  content: {
    paddingBottom: 120
  },
  card: {
    backgroundColor: Colors.background,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 22,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.primary
  },
  cardTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'capitalize'
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  stat: {
    width: '23%',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center'
  },
  statValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: Colors.white
  },
  statLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.white
  },

  appointment: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  appo: {
    borderLeftWidth: 1,
    borderLeftColor: "white",
    paddingLeft: 10,
  },
  time: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.white,
    marginRight: 14,
    width: 55,
  },
  client: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.white
  },
  service: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.white
  }
});