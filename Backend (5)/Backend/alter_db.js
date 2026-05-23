import pool from './config/db.js';

async function alterTable() {
  try {
    console.log('Altering upcoming_trips table...');
    const query = `
      ALTER TABLE upcoming_trips 
      ADD COLUMN inclusion TEXT NULL,
      ADD COLUMN exclusion TEXT NULL,
      ADD COLUMN routing VARCHAR(255) NULL,
      ADD COLUMN duration VARCHAR(100) NULL,
      ADD COLUMN supplementery TEXT NULL,
      ADD COLUMN price VARCHAR(100) NULL;
    `;
    await pool.query(query);
    console.log('Table altered successfully.');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Columns already exist.');
    } else {
      console.error('Error altering table:', error.message);
    }
  } finally {
    process.exit();
  }
}

alterTable();
