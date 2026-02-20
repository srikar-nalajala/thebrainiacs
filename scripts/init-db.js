const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.local')));

const client = new Client({
    connectionString: envConfig.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function initDB() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const sql = fs.readFileSync(path.resolve(__dirname, '../db_schema.sql'), 'utf8');
        console.log('Executing SQL...');

        await client.query(sql);
        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await client.end();
    }
}

initDB();
