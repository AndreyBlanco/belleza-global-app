import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { Colors } from '../theme/colors';

const icons = {
  dashboard: Asset.fromModule(require('../../assets/icons/home.svg')).uri,
  agenda: Asset.fromModule(require('../../assets/icons/agenda.svg')).uri,
  clients: Asset.fromModule(require('../../assets/icons/clients.svg')).uri
};

export default function BottomNav({ current, onChange }) {
  const renderButton = (screen) => {
    const isActive = current === screen;

    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => onChange(screen)}
        activeOpacity={0.8}
      >
        <SvgUri
          uri={icons[screen]}
          width={26}
          height={26}
          fill={isActive ? Colors.white : 'rgba(255,255,255,0.6)'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderButton('dashboard')}
      {renderButton('agenda')}
      {renderButton('clients')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    alignItems: 'center'
  }
});