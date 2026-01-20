import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet
} from 'react-native';
import { Colors } from '../../theme/colors';

export default function ClientPickerModal({
  visible,
  clients,
  onSelect,
  onClose
}) {
  const [query, setQuery] = useState('');

  const filteredClients = useMemo(() => {
    const q = query.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(q)
    );
  }, [clients, query]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Seleccionar cliente</Text>

          <TextInput
            placeholder="Buscar por nombre"
            value={query}
            onChangeText={setQuery}
            style={styles.search}
          />

          <FlatList
            data={filteredClients}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                style={styles.item}
              >
                <Text style={styles.name}>{item.name}</Text>
                {item.phone ? (
                  <Text style={styles.phone}>{item.phone}</Text>
                ) : null}
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Cerrar</Text>
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
    padding: 20
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%'
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    marginBottom: 8
  },
  search: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    fontFamily: 'Montserrat-Regular'
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  name: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16
  },
  phone: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.textSecondary
  },
  close: {
    textAlign: 'center',
    marginTop: 16,
    color: Colors.primary,
    fontFamily: 'Montserrat-SemiBold'
  }
});