import { initDatabase } from './database';
import { getDatabase } from './database';

/**
 * ✅ Obtener horario laboral actual
 */
export const getWorkHours = async () => {
  await initDatabase();
  const db = await getDatabase();

  return await db.getFirstAsync(
    `
    SELECT work_start, work_end
    FROM app_settings
    WHERE id = 1
    `
  );
};

/**
 * ✅ Actualizar horario laboral
 */
export const updateWorkHours = async (workStart, workEnd) => {
  await initDatabase();
  const db = await getDatabase();

  await db.runAsync(
    `
    UPDATE app_settings
    SET work_start = ?, work_end = ?
    WHERE id = 1
    `,
    [workStart, workEnd]
  );
};