export async function up(connection) {
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS demo_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            string VARCHAR(255) NOT NULL
        )
    `);
}

export async function down(connection) {
    await connection.execute('DROP TABLE IF EXISTS demo_data');
} 