import oracledb from 'oracledb';
import { openConnection, closeConnection } from '../db';
import { IProveedor } from '@/types';

export const getAllProveedores = async (): Promise<IProveedor[]> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT PRV_RUC, PRV_NOMBRE, PRV_DIRECCION, PRV_TELEFONO, PRV_RAZON_SOCIAL, PRV_CORREO FROM PROVEEDOR`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows) {
            return result.rows as IProveedor[];
        }
        return [];
    } catch (err) {
        console.error('[ProveedorModel] Error getting all proveedores:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const getProveedorByRuc = async (ruc: string): Promise<IProveedor | null> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT PRV_RUC, PRV_NOMBRE, PRV_DIRECCION, PRV_TELEFONO, PRV_RAZON_SOCIAL, PRV_CORREO FROM PROVEEDOR WHERE PRV_RUC = :ruc`,
            [ruc],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows && result.rows.length > 0) {
            return result.rows[0] as IProveedor;
        }
        return null;
    } catch (err) {
        console.error('[ProveedorModel] Error getting proveedor by RUC:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const createProveedor = async (proveedor: IProveedor) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `INSERT INTO PROVEEDOR (PRV_RUC, PRV_NOMBRE, PRV_DIRECCION, PRV_TELEFONO, PRV_RAZON_SOCIAL, PRV_CORREO) 
             VALUES (:PRV_RUC, :PRV_NOMBRE, :PRV_DIRECCION, :PRV_TELEFONO, :PRV_RAZON_SOCIAL, :PRV_CORREO)`,
            {
                PRV_RUC: proveedor.PRV_RUC,
                PRV_NOMBRE: proveedor.PRV_NOMBRE,
                PRV_DIRECCION: proveedor.PRV_DIRECCION,
                PRV_TELEFONO: proveedor.PRV_TELEFONO,
                PRV_RAZON_SOCIAL: proveedor.PRV_RAZON_SOCIAL,
                PRV_CORREO: proveedor.PRV_CORREO
            },
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[ProveedorModel] Error creating proveedor:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const updateProveedor = async (proveedor: IProveedor) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `UPDATE PROVEEDOR 
             SET PRV_NOMBRE = :PRV_NOMBRE, 
                 PRV_DIRECCION = :PRV_DIRECCION, 
                 PRV_TELEFONO = :PRV_TELEFONO,
                 PRV_RAZON_SOCIAL = :PRV_RAZON_SOCIAL,
                 PRV_CORREO = :PRV_CORREO
             WHERE PRV_RUC = :PRV_RUC`,
            {
                PRV_NOMBRE: proveedor.PRV_NOMBRE,
                PRV_DIRECCION: proveedor.PRV_DIRECCION,
                PRV_TELEFONO: proveedor.PRV_TELEFONO,
                PRV_RAZON_SOCIAL: proveedor.PRV_RAZON_SOCIAL,
                PRV_CORREO: proveedor.PRV_CORREO,
                PRV_RUC: proveedor.PRV_RUC
            },
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[ProveedorModel] Error updating proveedor:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const deleteProveedor = async (ruc: string) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `DELETE FROM PROVEEDOR WHERE PRV_RUC = :ruc`,
            [ruc],
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[ProveedorModel] Error deleting proveedor:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};