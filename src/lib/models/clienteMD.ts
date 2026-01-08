import oracledb from 'oracledb';
import { openConnection, closeConnection } from '../db';
import { ICliente } from '@/types';

export const validateClient = async (username: string, password: string) => {
    let connection;
    try {
        connection = await openConnection();

        console.log(`[ClientModel] Validating client: ${username}`);

        const result = await connection.execute(
            `SELECT * FROM usuario WHERE username = :username AND password = :password`,
            [username, password],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log(`[ClientModel] Rows found:`, result.rows?.length);

        if (result.rows && result.rows.length > 0) {
            return result.rows[0];
        }
        return null;

    } catch (err) {
        console.error('[ClientModel] Error validating client:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const getAllClientes = async (): Promise<ICliente[]> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT CLI_CEDULA_RUC, CLI_NOMBRE, CLI_TELEFONO, CLI_CORREO FROM CLIENTE`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows) {
            return result.rows as ICliente[];
        }
        return [];
    } catch (err) {
        console.error('[ClientModel] Error getting all clients:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const getClienteByCedula = async (cedula: string): Promise<ICliente | null> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT CLI_CEDULA_RUC, CLI_NOMBRE, CLI_TELEFONO, CLI_CORREO FROM CLIENTE WHERE CLI_CEDULA_RUC = :cedula`,
            [cedula],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows && result.rows.length > 0) {
            return result.rows[0] as ICliente;
        }
        return null;
    } catch (err) {
        console.error('[ClientModel] Error getting client by cedula:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const createCliente = async (cliente: ICliente) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `INSERT INTO CLIENTE (CLI_CEDULA_RUC, CLI_NOMBRE, CLI_TELEFONO, CLI_CORREO) 
             VALUES (:CLI_CEDULA_RUC, :CLI_NOMBRE, :CLI_TELEFONO, :CLI_CORREO)`,
            {
                CLI_CEDULA_RUC: cliente.CLI_CEDULA_RUC,
                CLI_NOMBRE: cliente.CLI_NOMBRE,
                CLI_TELEFONO: cliente.CLI_TELEFONO,
                CLI_CORREO: cliente.CLI_CORREO
            },
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[ClientModel] Error creating client:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const updateCliente = async (cliente: ICliente) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `UPDATE CLIENTE 
             SET CLI_NOMBRE = :CLI_NOMBRE, 
                 CLI_TELEFONO = :CLI_TELEFONO, 
                 CLI_CORREO = :CLI_CORREO
             WHERE CLI_CEDULA_RUC = :CLI_CEDULA_RUC`,
            {
                CLI_NOMBRE: cliente.CLI_NOMBRE,
                CLI_TELEFONO: cliente.CLI_TELEFONO,
                CLI_CORREO: cliente.CLI_CORREO,
                CLI_CEDULA_RUC: cliente.CLI_CEDULA_RUC
            },
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[ClientModel] Error updating client:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const deleteCliente = async (cedula: string) => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `DELETE FROM CLIENTE WHERE CLI_CEDULA_RUC = :cedula`,
            [cedula],
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error('[ClientModel] Error deleting client:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};
