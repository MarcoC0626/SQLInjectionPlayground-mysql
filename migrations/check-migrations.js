import { createConnection } from './config.js';

async function checkMigrations() {
    const connection = await createConnection();
    
    try {
        // Check if migrations table exists
        const [tables] = await connection.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.tables 
            WHERE table_schema = 'stockscanner'
        `);
        
        console.log('\nDatabase Tables:');
        console.log('----------------');
        tables.forEach(table => console.log(table.TABLE_NAME));
        
        // Check executed migrations
        const [migrations] = await connection.execute('SELECT * FROM migrations ORDER BY id');
        
        console.log('\nExecuted Migrations:');
        console.log('-------------------');
        if (migrations.length === 0) {
            console.log('No migrations have been executed yet.');
        } else {
            migrations.forEach(migration => {
                console.log(`${migration.id}. ${migration.name} (${migration.executed_at})`);
            });
        }
        
    } catch (error) {
        console.error('Error checking migrations:', error);
    } finally {
        await connection.end();
    }
}

checkMigrations(); 