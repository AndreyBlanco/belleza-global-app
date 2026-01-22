// DurationPickerModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Colors } from '../../theme/colors';

const DURATIONS = [1, 2, 3, 4, 5, 6]; // bloques de 15 min

export default function DurationPickerModal({
  visible,
  value,
  onSelect,
  onClose
}) {
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
              Seleccionar duración
            </Text>
          </View>

          {/* LIST */}
          <FlatList
            data={DURATIONS}
            keyExtractor={(item) => item.toString()}
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
                    {item * 15} minutos
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