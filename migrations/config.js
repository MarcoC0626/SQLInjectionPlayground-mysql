import mysql from 'mysql2/promise';

export const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootpassword',
    database: 'SQLInjectionPlayground',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

export const createConnection = async () => {
    return await mysql.createConnection(dbConfig);
}; 