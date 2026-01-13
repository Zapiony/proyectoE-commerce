import oracledb from 'oracledb';
import { openConnection, closeConnection } from '../db';

export const validateAdmin = async (username: string, password: string) => {
    let connection;
    try {
        connection = await openConnection();

        const result = await connection.execute(
            `SELECT * FROM usuario WHERE usu_nombre = :username AND usu_contrasena = :password`,
            [username, password],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows && result.rows.length > 0) {
            return result.rows[0];
        }
        return null;

    } catch (err) {
        console.error('[AdminModel] Error validating admin:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};
