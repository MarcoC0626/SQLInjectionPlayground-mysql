export async function up(connection) {
    await connection.execute(`
        CREATE TABLE demo_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            string VARCHAR(255) NOT NULL
        )
    `);

    // Insert some sample tokens
    await connection.execute(`
        INSERT INTO demo_data (string) VALUES
        ('123'),
        ('456')
    `);
}

export async function down(connection) {
    await connection.execute('DROP TABLE IF EXISTS demo_data');
} 