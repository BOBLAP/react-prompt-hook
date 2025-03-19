
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Define the database directory and path
const DB_DIR = path.join(process.cwd(), 'config');
const DB_PATH = path.join(DB_DIR, 'config.sqlite');

// Ensure the config directory exists
if (!fs.existsSync(DB_DIR)) {
  console.log(`Creating config directory: ${DB_DIR}`);
  try {
    fs.mkdirSync(DB_DIR, { recursive: true, mode: 0o755 });
    console.log('Config directory created successfully with permissions 0755');
  } catch (error) {
    console.error('Error creating config directory:', error);
    console.error('Details:', error instanceof Error ? error.message : String(error));
  }
}

// Initialize database
let db: Database.Database;

try {
  console.log(`Opening SQLite database at ${DB_PATH}`);
  db = new Database(DB_PATH);
  console.log('SQLite database opened successfully');
  
  // Set pragmas for better performance and reliability
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS auth_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS basic_auth_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      enabled INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS webhook_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      url TEXT NOT NULL
    );
  `);
  
  // Initialize with default values if tables are empty
  const initTable = (table: string, defaultValues: object) => {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
    if (count === 0) {
      console.log(`Initializing ${table} with default values`);
      const columns = Object.keys(defaultValues).join(', ');
      const placeholders = Object.keys(defaultValues).map(() => '?').join(', ');
      const stmt = db.prepare(`INSERT INTO ${table} (id, ${columns}) VALUES (1, ${placeholders})`);
      stmt.run(...Object.values(defaultValues));
    }
  };
  
  initTable('auth_config', { username: 'bob', password: '1234' });
  initTable('basic_auth_config', { username: 'toto', password: '1234', enabled: 1 });
  initTable('webhook_config', { url: 'https://n8n.lagratte.net/webhook-test/b76fe489-7e61-4bca-a65b-8cae9f677655' });
  
  console.log('Database initialized successfully');
} catch (error) {
  console.error('Error initializing database:', error);
  process.exit(1);
}

export default db;
