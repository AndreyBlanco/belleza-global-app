import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

const DB_NAME = 'bgapp.db';

export async function backupDatabase() {
  try {
    const dbPath =
      Platform.OS === 'android'
        ? `${FileSystem.documentDirectory}SQLite/${DB_NAME}`
        : `${FileSystem.documentDirectory}${DB_NAME}`;

    const backupDir = `${FileSystem.documentDirectory}backups/`;
    const backupPath = `${backupDir}bgapp_backup_${Date.now()}.db`;

    const dirInfo = await FileSystem.getInfoAsync(backupDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
    }

    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    if (!dbInfo.exists) {
      throw new Error('La base de datos aún no existe.');
    }

    await FileSystem.copyAsync({
      from: dbPath,
      to: backupPath
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(backupPath);
    }

    return { success: true };
  } catch (error) {
    console.error('Backup error:', error);
    return { success: false, error };
  }
}