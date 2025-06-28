export async function up(connection) {
    await connection.execute(`
        INSERT INTO users (username, password) VALUES
        ('admin', 'super_secret_admin_password123'),
        ('regular_user', 'normal_user_password456')
    `);
}

export async function down(connection) {
    await connection.execute(`
        DELETE FROM users 
        WHERE username IN ('admin', 'regular_user')
    `);
} 