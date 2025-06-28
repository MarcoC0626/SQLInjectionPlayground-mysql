import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createConnection } from './config.js';

async function createMigrationsTable(connection) {
    console.log('Creating migrations table if it doesn\'t exist...');
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Migrations table ready.');
}

async function getExecutedMigrations(connection) {
    console.log('Checking for existing migrations...');
    const [rows] = await connection.execute('SELECT name FROM migrations ORDER BY id DESC');
    console.log(`Found ${rows.length} existing migrations.`);
    return rows.map(row => row.name);
}

async function runMigration(connection, migrationFile, direction = 'up') {
    console.log(`Loading migration file: ${migrationFile}`);
    const migration = await import(`./${migrationFile}`);
    
    try {
        console.log(`Starting ${direction} migration for ${migrationFile}...`);
        await connection.beginTransaction();
        if (direction === 'up') {
            await migration.up(connection);
            await connection.execute('INSERT INTO migrations (name) VALUES (?)', [migrationFile]);
        } else {
            await migration.down(connection);
            await connection.execute('DELETE FROM migrations WHERE name = ?', [migrationFile]);
        }
        await connection.commit();
        console.log(`✅ Successfully executed ${direction} migration: ${migrationFile}`);
    } catch (error) {
        await connection.rollback();
        console.error(`❌ Failed to execute ${direction} migration ${migrationFile}:`, error);
        throw error;
    }
}

async function main() {
    const direction = process.argv[2] || 'up';
    console.log('Connecting to database...');
    const connection = await createConnection();
    console.log('Connected to database successfully.');
    
    try {
        // Create migrations table if it doesn't exist
        await createMigrationsTable(connection);
        
        if (direction === 'down') {
            // Get the last executed migration
            const executedMigrations = await getExecutedMigrations(connection);
            if (executedMigrations.length === 0) {
                console.log('No migrations to roll back');
                return;
            }
            const lastMigration = executedMigrations[0];
            console.log(`Rolling back migration: ${lastMigration}`);
            await runMigration(connection, lastMigration, 'down');
        } else {
            // Get list of executed migrations
            const executedMigrations = await getExecutedMigrations(connection);
            
            // Get all migration files
            console.log('Scanning for migration files...');
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const files = await fs.readdir(__dirname);
            const migrationFiles = files
                .filter(f => f.endsWith('.js') && f !== 'config.js' && f !== 'runner.js' && f !== 'check-migrations.js' && f.startsWith('0'))
                .sort();
            
            console.log(`Found ${migrationFiles.length} migration files:`, migrationFiles);
            
            // Run pending migrations
            for (const file of migrationFiles) {
                if (!executedMigrations.includes(file)) {
                    console.log(`Running migration: ${file}`);
                    await runMigration(connection, file, 'up');
                } else {
                    console.log(`Skipping already executed migration: ${file}`);
                }
            }
        }
        
        console.log('✨ All migrations completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

main(); 