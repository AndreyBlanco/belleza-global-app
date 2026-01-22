// BottomNav.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

const icons = {
  dashboard: require('../../assets/icons/home.png'),
  agenda: require('../../assets/icons/agenda.png'),
  clients: require('../../assets/icons/clients.png'),
  settings: require('../../assets/icons/settings.png') // ⚙️ Configuración
};

export default function BottomNav({ current, onChange }) {
  const insets = useSafeAreaInsets();

  const renderButton = (screen) => {
    const isActive = current === screen;

    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => onChange(screen)}
        activeOpacity={0.8}
      >
        <Image
          source={icons[screen]}
          style={[
            styles.icon,
            { opacity: isActive ? 1 : 0.6 }
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom }
      ]}
    >
      {renderButton('dashboard')}
      {renderButton('agenda')}
      {renderButton('clients')}
      {renderButton('settings')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    alignItems: 'center'
  },
  icon: {
    width: 26,
    height: 26
  }
});