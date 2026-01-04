import oracledb from 'oracledb';

if (!process.env.ORACLE_USER || !process.env.ORACLE_PASSWORD || !process.env.ORACLE_CONN_STR) {
  throw new Error('Faltan variables de entorno para Oracle');
}

const dbConfig: oracledb.ConnectionAttributes = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONN_STR,
};

// Singleton para obtener conexión
export async function getConnection(): Promise<oracledb.Connection> {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (err) {
    console.error('Error conectando a Oracle:', err);
    throw err;
  }
}