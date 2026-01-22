import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import { Platform, DevSettings } from 'react-native';

const DB_NAME = 'bgapp.db';

export async function restoreDatabase() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    const fileUri = result.assets[0].uri;

    const dbPath =
      Platform.OS === 'android'
        ? `${FileSystem.documentDirectory}SQLite/${DB_NAME}`
        : `${FileSystem.documentDirectory}${DB_NAME}`;

    await FileSystem.copyAsync({
      from: fileUri,
      to: dbPath
    });

    // ✅ Reinicio seguro de la app
    DevSettings.reload();

    return { success: true };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error };
  }
}