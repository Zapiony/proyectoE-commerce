import oracledb from 'oracledb';
import { openConnection, closeConnection } from '../db';
import { ICategoria } from '@/types';

export const getAllCategorias = async (): Promise<ICategoria[]> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT CAT_CODIGO, CAT_NOMBRE, CAT_DESCRIPCION FROM CATEGORIA`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows) {
            return result.rows as ICategoria[];
        }
        return [];
    } catch (err) {
        console.error('[CategoriaModel] Error getting all categorias:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};
