import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DashboardScreen from './src/screens/DashboardScreen';
import AgendaScreen from './src/screens/AgendaScreen';
import ClientsScreen from './src/screens/ClientsScreen';
import BottomNav from './src/components/BottomNav';
import { initDatabase } from './src/database/database';

/**
 * Main application entry point.
 */
export default function App() {
  const [screen, setScreen] = useState('dashboard');

  useEffect(() => {
    initDatabase();
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'agenda':
        return <AgendaScreen />;
      case 'clients':
        return <ClientsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {renderScreen()}
          </View>

          <BottomNav current={screen} onChange={setScreen} />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}