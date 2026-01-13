import oracledb from 'oracledb';
import { openConnection, closeConnection } from '../db';
import { IProducto } from '@/types';

export const getAllProductos = async (): Promise<IProducto[]> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT PRD_CODIGO, CAT_CODIGO, PRD_DESCRIPCION, PRD_PRECIO, PRD_COSTO_ADQUISICION FROM PRODUCTO`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows) {
            return result.rows as IProducto[];
        }
        return [];
    } catch (err) {
        console.error('[ProductoModel] Error getting all productos:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const getProductoByCodigo = async (codigo: string): Promise<IProducto | null> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT PRD_CODIGO, CAT_CODIGO, PRD_DESCRIPCION, PRD_PRECIO, PRD_COSTO_ADQUISICION FROM PRODUCTO WHERE PRD_CODIGO = :codigo`,
            [codigo],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows && result.rows.length > 0) {
            return result.rows[0] as IProducto;
        }
        return null;
    } catch (err) {
        console.error('[ProductoModel] Error getting producto by codigo:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const createProducto = async (producto: IProducto) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `INSERT INTO PRODUCTO (PRD_CODIGO, CAT_CODIGO, PRD_DESCRIPCION, PRD_PRECIO, PRD_COSTO_ADQUISICION) 
             VALUES (:PRD_CODIGO, :CAT_CODIGO, :PRD_DESCRIPCION, :PRD_PRECIO, :PRD_COSTO_ADQUISICION)`,
            {
                PRD_CODIGO: producto.PRD_CODIGO,
                CAT_CODIGO: producto.CAT_CODIGO,
                PRD_DESCRIPCION: producto.PRD_DESCRIPCION,
                PRD_PRECIO: producto.PRD_PRECIO,
                PRD_COSTO_ADQUISICION: producto.PRD_COSTO_ADQUISICION
            },
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[ProductoModel] Error creating producto:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const updateProducto = async (producto: IProducto) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `UPDATE PRODUCTO 
             SET CAT_CODIGO = :CAT_CODIGO, 
                 PRD_DESCRIPCION = :PRD_DESCRIPCION, 
                 PRD_PRECIO = :PRD_PRECIO,
                 PRD_COSTO_ADQUISICION = :PRD_COSTO_ADQUISICION
             WHERE PRD_CODIGO = :PRD_CODIGO`,
            {
                CAT_CODIGO: producto.CAT_CODIGO,
                PRD_DESCRIPCION: producto.PRD_DESCRIPCION,
                PRD_PRECIO: producto.PRD_PRECIO,
                PRD_COSTO_ADQUISICION: producto.PRD_COSTO_ADQUISICION,
                PRD_CODIGO: producto.PRD_CODIGO
            },
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[ProductoModel] Error updating producto:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const deleteProducto = async (codigo: string) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `DELETE FROM PRODUCTO WHERE PRD_CODIGO = :codigo`,
            [codigo],
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[ProductoModel] Error deleting producto:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};
