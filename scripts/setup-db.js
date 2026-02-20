const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = require('dotenv').parse(fs.readFileSync(envPath));

const connectionString = envConfig.DATABASE_URL;

if (!connectionString || connectionString.includes('[YOUR-PASSWORD]')) {
    console.error('Error: DATABASE_URL is missing or contains a placeholder password.');
    console.error('Please update .env.local with your actual Supabase database password.');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function setupDatabase() {
    try {
        await client.connect();
        console.log('Connected to database via Pooler.');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS coupons (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                brand_name TEXT NOT NULL,
                category TEXT NOT NULL,
                code TEXT NOT NULL,
                description TEXT NOT NULL,
                expiry_date DATE NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                image_url TEXT
            );
        `;

        await client.query(createTableQuery);
        console.log("Success: 'coupons' table created (or already exists).");

        // Enable RLS and Policies if they don't exist (basic check)
        // Note: In a real migration script we'd check existence first, but for this 'fix-it' script
        // we'll just try to create the table. Advanced policy management is better done in the dashboard
        // to avoid errors if policies already exist.

    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
