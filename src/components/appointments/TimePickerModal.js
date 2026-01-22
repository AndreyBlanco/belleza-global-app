import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Colors } from '../../theme/colors';

/* =========================
   UTILITIES
========================= */

const buildTimes = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
};

/* =========================
   COMPONENT
========================= */

export default function TimePickerModal({
  visible,
  value,
  onSelect,
  onClose
}) {
  const times = useMemo(buildTimes, []);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Seleccionar hora
            </Text>
          </View>

          {/* LIST */}
          <FlatList
            data={times}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const active = item === value;

              return (
                <TouchableOpacity
                  style={[
                    styles.item,
                    active && styles.itemActive
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.itemText,
                      active && styles.itemTextActive
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* FOOTER */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },

  modal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20
  },

  header: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  headerTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16
  },

  item: {
    paddingVertical: 16,
    alignItems: 'center'
  },
  itemActive: {
    backgroundColor: Colors.primary + '15'
  },
  itemText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16
  },
  itemTextActive: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary
  },

  cancelButton: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center'
  },
  cancelText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.textSecondary
  }
});