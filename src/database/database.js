import * as SQLite from 'expo-sqlite';

/* =====================================================
   PERSISTENT DATABASE CONNECTION (CRITICAL FIX)
   ===================================================== */

let db = null;
let initialized = false;
let initPromise = null;

/**
 * ✅ Get persistent database instance
 * - Opened once
 * - Reused for all queries
 */
const getDatabase = async () => {
  if (db) return db;

  console.log('[DB] Creating persistent database connection');
  db = await SQLite.openDatabaseAsync('bgapp.db');
  return db;
};

/**
 * ✅ GUARANTEED DB INITIALIZATION
 * - Runs once
 * - Blocks queries until finished
 */
export const initDatabase = async () => {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const database = await getDatabase();

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'confirmed',
        created_at TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      );
    `);

    initialized = true;
    console.log('[DB] Initialized ✅');
  })();

  return initPromise;
};

/* =====================================================
   CLIENTS
   ===================================================== */

export const insertClient = async (
  name,
  phone,
  email = null,
  notes = ''
) => {
  await initDatabase();
  const database = await getDatabase();

  const result = await database.runAsync(
    `
    INSERT INTO clients (name, phone, email, notes)
    VALUES (?, ?, ?, ?)
    `,
    [name, phone, email, notes]
  );

  return await database.getFirstAsync(
    `SELECT * FROM clients WHERE id = ?`,
    [result.lastInsertRowId]
  );
};

export const getClients = async () => {
  await initDatabase();
  const database = await getDatabase();

  return await database.getAllAsync(
    `SELECT * FROM clients ORDER BY name;`
  );
};

export const updateClient = async (
  id,
  name,
  phone,
  email
) => {
  await initDatabase();
  const database = await getDatabase();

  await database.runAsync(
    `
    UPDATE clients
    SET name = ?, phone = ?, email = ?
    WHERE id = ?
    `,
    [name, phone, email, id]
  );
};

/* =====================================================
   APPOINTMENTS
   ===================================================== */

export const insertAppointment = async (
  clientId,
  date,
  time,
  notes
) => {
  await initDatabase();
  const database = await getDatabase();

  const normalizedDate =
    typeof date === 'string'
      ? date
      : new Date(date).toISOString().split('T')[0];

  const normalizedTime = time.padStart(5, '0');

  await database.runAsync(
    `
    INSERT INTO appointments
    (client_id, date, time, notes, status, created_at)
    VALUES (?, ?, ?, ?, 'confirmed', datetime('now'))
    `,
    [clientId, normalizedDate, normalizedTime, notes]
  );
};

export const updateAppointment = async (
  appointmentId,
  status,
  notes
) => {
  await initDatabase();
  const database = await getDatabase();

  await database.runAsync(
    `
    UPDATE appointments
    SET status = ?, notes = ?, created_at = datetime('now')
    WHERE id = ?
    `,
    [status, notes, appointmentId]
  );
};

export const getAppointmentsByDate = async (date) => {
  if (!date) return [];

  await initDatabase();
  const database = await getDatabase();

  return await database.getAllAsync(
    `
    SELECT a.*, c.name
    FROM appointments a
    LEFT JOIN clients c ON a.client_id = c.id
    WHERE a.date = ?
    ORDER BY a.time ASC, a.created_at DESC
    `,
    [date]
  );
};

/* =====================================================
   DASHBOARD / HISTORY
   ===================================================== */

export const getNextAppointmentsToday = async (limit = 3) => {
  await initDatabase();
  const database = await getDatabase();

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime =
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0');

  return await database.getAllAsync(
    `
    SELECT a.*, c.name
    FROM appointments a
    LEFT JOIN clients c ON a.client_id = c.id
    WHERE a.date = ?
      AND a.time >= ?
    ORDER BY a.time ASC
    LIMIT ?
    `,
    [today, currentTime, limit]
  );
};

export const getAppointmentsBetween = async (startDate, endDate) => {
  await initDatabase();
  const database = await getDatabase();

  return await database.getAllAsync(
    `
    SELECT *
    FROM appointments
    WHERE date >= ?
      AND date <= ?
    `,
    [startDate, endDate]
  );
};

export const getClientAppointmentStats = async (clientId) => {
  await initDatabase();
  const database = await getDatabase();

  const rows = await database.getAllAsync(
    `
    SELECT status, COUNT(*) as count
    FROM appointments
    WHERE client_id = ?
    GROUP BY status
    `,
    [clientId]
  );

  const stats = {
    total: 0,
    confirmed: 0,
    pending: 0,
    canceled: 0
  };

  rows.forEach(r => {
    stats.total += r.count;
    if (stats[r.status] !== undefined) {
      stats[r.status] = r.count;
    }
  });

  return stats;
};

export const getNextClientAppointment = async (clientId) => {
  await initDatabase();
  const database = await getDatabase();

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime =
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0');

  return await database.getFirstAsync(
    `
    SELECT *
    FROM appointments
    WHERE client_id = ?
      AND (
        date > ?
        OR (date = ? AND time >= ?)
      )
    ORDER BY date ASC, time ASC
    LIMIT 1
    `,
    [clientId, today, today, currentTime]
  );
};

export const getClientAppointmentNotes = async (clientId) => {
  await initDatabase();
  const database = await getDatabase();

  return await database.getAllAsync(
    `
    SELECT notes
    FROM appointments
    WHERE client_id = ?
      AND notes IS NOT NULL
      AND TRIM(notes) != ''
    ORDER BY date DESC, time DESC
    `,
    [clientId]
  );
};