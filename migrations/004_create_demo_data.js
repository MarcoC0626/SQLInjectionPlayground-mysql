export async function up(connection) {
    await connection.execute(`
        INSERT INTO demo_data (string) VALUES
        ('123'),
        ('456'),
        ("123' UNION SELECT username,password FROM users-- -")
    `);
}

export async function down(connection) {
    await connection.execute('DELETE FROM demo_data');
}