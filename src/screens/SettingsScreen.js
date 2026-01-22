import React, { useState } from 'react';
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
import { Alert } from 'react-native';
import { backupDatabase } from '../utils/backupDatabase';
import { restoreDatabase } from '../utils/restoreDatabase';
import WorkHoursModal from '../components/settings/WorkHoursModal';

const settingsIcon = require('../../assets/icons/settings.png');
const backupIcon = require('../../assets/icons/backup.png'); // preparar PNG
const clockIcon = require('../../assets/icons/clock.png');   // preparar PNG


export default function SettingsScreen() {
  const [showWorkHours, setShowWorkHours] = useState(false);
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración</Text>
        <Text style={styles.headerSubtitle}>
          Ajustes generales de la aplicación
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* SECTION: BACKUP */}
        <Text style={styles.sectionTitle}>Base de datos</Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Image
              source={backupIcon}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>
                Respaldo de información
              </Text>
              <Text style={styles.cardDescription}>
                Guarda una copia de seguridad de tus datos.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={async () => {
                const result = await backupDatabase();

                if (result.success) {
                Alert.alert(
                    'Respaldo creado',
                    'La copia de seguridad se generó correctamente.'
                );
                } else {
                Alert.alert(
                    'Error',
                    'No se pudo crear el respaldo.'
                );
                }
            }}
          >
            <Text style={styles.primaryButtonText}>
              Crear respaldo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { marginTop: 10 }]}
            activeOpacity={0.8}
            onPress={async () => {
                Alert.alert(
                'Restaurar respaldo',
                'Esto reemplazará toda la información actual. ¿Deseas continuar?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                    text: 'Restaurar',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await restoreDatabase();

                        if (result?.canceled) return;

                        if (!result.success) {
                        Alert.alert(
                            'Error',
                            'No se pudo restaurar el respaldo.'
                        );
                        }
                    }
                    }
                ]
                );
            }}
            >
            <Text style={styles.secondaryButtonText}>
                Restaurar respaldo
            </Text>
          </TouchableOpacity>
        </View>

        {/* SECTION: WORK HOURS */}
        <Text style={styles.sectionTitle}>Agenda</Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Image
              source={clockIcon}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>
                Horario laboral
              </Text>
              <Text style={styles.cardDescription}>
                Define la hora de inicio y cierre de tu jornada.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => setShowWorkHours(true)}
          >
            <Text style={styles.secondaryButtonText}>
              Configurar horario
            </Text>
          </TouchableOpacity>
        </View>

        <WorkHoursModal
            visible={showWorkHours}
            onClose={() => setShowWorkHours(false)}
        />
      </ScrollView>
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
  headerSubtitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: Colors.white,
    marginTop: 6
  },

  content: {
    padding: 20
  },

  sectionTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    marginBottom: 8
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 12
  },
  cardText: {
    flex: 1
  },
  cardTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16
  },
  cardDescription: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.textSecondary,
    marginTop: 2
  },

  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center'
  },
  primaryButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center'
  },
  secondaryButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.primary
  }
});