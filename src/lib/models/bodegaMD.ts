import oracledb from 'oracledb';
import { openConnection, closeConnection } from '../db';
import { IBodega } from '@/types';

export const getAllBodegas = async (): Promise<IBodega[]> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT BOD_CODIGO, BOD_DESCRIPCION, BOD_DIRECCION, BOD_NOMBRE_ENCARGADO, BOD_TELEFONO_ENCARGADO FROM BODEGA`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows) {
            return result.rows as IBodega[];
        }
        return [];
    } catch (err) {
        console.error('[BodegaModel] Error getting all bodegas:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const getBodegaByCodigo = async (codigo: string): Promise<IBodega | null> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT BOD_CODIGO, BOD_DESCRIPCION, BOD_DIRECCION, BOD_NOMBRE_ENCARGADO, BOD_TELEFONO_ENCARGADO FROM BODEGA WHERE BOD_CODIGO = :codigo`,
            [codigo],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows && result.rows.length > 0) {
            return result.rows[0] as IBodega;
        }
        return null;
    } catch (err) {
        console.error('[BodegaModel] Error getting bodega by codigo:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const createBodega = async (bodega: IBodega) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `INSERT INTO BODEGA (BOD_CODIGO, BOD_DESCRIPCION, BOD_DIRECCION, BOD_NOMBRE_ENCARGADO, BOD_TELEFONO_ENCARGADO) 
             VALUES (:BOD_CODIGO, :BOD_DESCRIPCION, :BOD_DIRECCION, :BOD_NOMBRE_ENCARGADO, :BOD_TELEFONO_ENCARGADO)`,
            {
                BOD_CODIGO: bodega.BOD_CODIGO,
                BOD_DESCRIPCION: bodega.BOD_DESCRIPCION,
                BOD_DIRECCION: bodega.BOD_DIRECCION,
                BOD_NOMBRE_ENCARGADO: bodega.BOD_NOMBRE_ENCARGADO,
                BOD_TELEFONO_ENCARGADO: bodega.BOD_TELEFONO_ENCARGADO
            },
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[BodegaModel] Error creating bodega:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const updateBodega = async (bodega: IBodega) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `UPDATE BODEGA 
             SET BOD_DESCRIPCION = :BOD_DESCRIPCION, 
                 BOD_DIRECCION = :BOD_DIRECCION, 
                 BOD_NOMBRE_ENCARGADO = :BOD_NOMBRE_ENCARGADO,
                 BOD_TELEFONO_ENCARGADO = :BOD_TELEFONO_ENCARGADO
             WHERE BOD_CODIGO = :BOD_CODIGO`,
            {
                BOD_DESCRIPCION: bodega.BOD_DESCRIPCION,
                BOD_DIRECCION: bodega.BOD_DIRECCION,
                BOD_NOMBRE_ENCARGADO: bodega.BOD_NOMBRE_ENCARGADO,
                BOD_TELEFONO_ENCARGADO: bodega.BOD_TELEFONO_ENCARGADO,
                BOD_CODIGO: bodega.BOD_CODIGO
            },
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[BodegaModel] Error updating bodega:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const deleteBodega = async (codigo: string) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `DELETE FROM BODEGA WHERE BOD_CODIGO = :codigo`,
            [codigo],
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[BodegaModel] Error deleting bodega:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};
