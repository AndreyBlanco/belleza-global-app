// EditClientModal.js
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Colors } from '../../theme/colors';
import { updateClient, getClients } from '../../database/database';

export default function EditClientModal({
  visible,
  client,
  onSaved,
  onClose
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
      setEmail(client.email || '');
    }
  }, [client]);

  const nameExists = async (value) => {
    const clients = await getClients();
    const normalized = value.trim().toLowerCase();
    return clients.some(
      c =>
        c.id !== client.id &&
        c.name.trim().toLowerCase() === normalized
    );
  };

  const save = async () => {
    if (!name || !phone) {
      Alert.alert('Campos requeridos', 'Nombre y teléfono son obligatorios.');
      return;
    }

    if (await nameExists(name)) {
      Alert.alert(
        'Nombre duplicado',
        'Ya existe otro cliente con este nombre.'
      );
      return;
    }

    await updateClient(
      client.id,
      name.trim(),
      phone.trim(),
      email.trim() || null
    );

    onSaved({
      ...client,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Editar cliente</Text>

          <TextInput
            placeholder="Nombre *"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Teléfono *"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            placeholder="Correo (opcional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TouchableOpacity style={styles.save} onPress={save}>
            <Text style={styles.saveText}>Guardar cambios</Text>
          </TouchableOpacity>

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
    padding: 20
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontFamily: 'Montserrat-Regular'
  },
  save: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center'
  },
  saveText: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.white
  },
  close: {
    textAlign: 'center',
    marginTop: 14,
    color: Colors.textSecondary
  }
});