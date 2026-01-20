import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Colors } from '../../theme/colors';
import { insertClient } from '../../database/database';
import ImportContactModal from './ImportContactModal';

export default function NewClientModal({ visible, onClose, onSaved }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showImport, setShowImport] = useState(false);

  const reset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setShowImport(false);
  };

  const save = async () => {
    if (!name || !phone) return;

    const createdClient = await insertClient(
      name.trim(),
      phone.trim(),
      email.trim() || null,
      ''
    );

    reset();
    onSaved(createdClient);
  };

  const importContact = async (contact) => {
    const createdClient = await insertClient(
      contact.name,
      contact.phone,
      contact.email,
      ''
    );

    reset();
    onSaved(createdClient);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Nuevo cliente</Text>

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
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.import}
            onPress={() => setShowImport(true)}
          >
            <Text style={styles.importText}>
              Importar desde contactos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ImportContactModal
        visible={showImport}
        onSelect={importContact}
        onClose={() => setShowImport(false)}
      />
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
    alignItems: 'center',
    marginBottom: 8
  },
  saveText: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.white
  },
  import: {
    alignItems: 'center',
    paddingVertical: 10
  },
  importText: {
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.primary
  },
  close: {
    textAlign: 'center',
    marginTop: 10,
    color: Colors.textSecondary
  }
});