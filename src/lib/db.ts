import oracledb from 'oracledb';

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

export async function openConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (err) {
    console.error('[OracleDB] Error obtaining connection:', err);
    throw err;
  }
}

export async function closeConnection(connection: oracledb.Connection) {
  try {
    await connection.close();
  } catch (err) {
    console.error('[OracleDB] Error closing connection:', err);
  }
}