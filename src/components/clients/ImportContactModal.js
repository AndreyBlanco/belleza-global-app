import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { Colors } from '../../theme/colors';

export default function ImportContactModal({
  visible,
  onSelect,
  onClose
}) {
  const [contacts, setContacts] = useState([]);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!visible) return;

    (async () => {
      setQuery('');

      const { status } =
        await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails
        ]
      });

      setContacts(data || []);
    })();
  }, [visible]);

  const filteredContacts = useMemo(() => {
    const q = query.toLowerCase();

    return contacts.filter(c =>
      c.name?.toLowerCase().includes(q)
    );
  }, [contacts, query]);

  const normalizeContact = (contact) => ({
    name: contact.name,
    phone: contact.phoneNumbers?.[0]?.number || '',
    email: contact.emails?.[0]?.email || null
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            Importar desde contactos
          </Text>

          <TextInput
            placeholder="Buscar contacto"
            value={query}
            onChangeText={setQuery}
            style={styles.search}
          />

          {permissionDenied ? (
            <Text style={styles.error}>
              Permiso de contactos denegado
            </Text>
          ) : (
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const phone =
                  item.phoneNumbers?.[0]?.number;

                if (!phone) return null;

                return (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() =>
                      onSelect(normalizeContact(item))
                    }
                  >
                    <Text style={styles.name}>
                      {item.name}
                    </Text>
                    <Text style={styles.phone}>
                      {phone}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Cancelar</Text>
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
  error: {
    textAlign: 'center',
    color: Colors.canceled,
    marginVertical: 20
  },
  close: {
    textAlign: 'center',
    marginTop: 16,
    color: Colors.primary,
    fontFamily: 'Montserrat-SemiBold'
  }
});