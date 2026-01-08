import oracledb from 'oracledb';
import { openConnection, closeConnection } from '../db';
import { IOrdenCompra, IDetalleOrdenCompra } from '@/types';

export const getAllOrdenes = async (): Promise<IOrdenCompra[]> => {
    let connection;
    try {
        connection = await openConnection();
        const result = await connection.execute(
            `SELECT o.ORD_CODIGO, o.PRV_RUC, p.PRV_NOMBRE, o.ORD_FECHA_ENTREGA, o.ORD_ESTADO 
             FROM ORDEN_DE_COMPRA o
             JOIN PROVEEDOR p ON o.PRV_RUC = p.PRV_RUC
             ORDER BY o.ORD_CODIGO DESC`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows) {
            return result.rows as IOrdenCompra[];
        }
        return [];
    } catch (err) {
        console.error('[OrdenCompraModel] Error getting all ordenes:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const createOrdenCompraTransaction = async (orden: IOrdenCompra, detalles: IDetalleOrdenCompra[]) => {
    let connection;
    try {
        connection = await openConnection();

        const resultId = await connection.execute(
            `SELECT NVL(MAX(ORD_CODIGO), 0) + 1 AS NEXT_ID FROM ORDEN_DE_COMPRA`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        const newOrdCodigo = (resultId.rows![0] as any).NEXT_ID;

        await connection.execute(
            `INSERT INTO ORDEN_DE_COMPRA (ORD_CODIGO, PRV_RUC, ORD_FECHA_ENTREGA, ORD_ESTADO) 
             VALUES (:ORD_CODIGO, :PRV_RUC, :ORD_FECHA_ENTREGA, 'EN ESPERA')`,
            {
                ORD_CODIGO: newOrdCodigo,
                PRV_RUC: orden.PRV_RUC,
                ORD_FECHA_ENTREGA: new Date(orden.ORD_FECHA_ENTREGA)
            },
            { autoCommit: false }
        );

        if (detalles && detalles.length > 0) {
            for (const det of detalles) {
                await connection.execute(
                    `INSERT INTO DETALLE_ORD_COMPRA (ORD_CODIGO, PRD_CODIGO, DET_ORD_COMPRA_CANTIDAD, DET_ORD_COMPRA_COSTO_UNITARIO)
                     VALUES (:ORD_CODIGO, :PRD_CODIGO, :CANTIDAD, :COSTO)`,
                    {
                        ORD_CODIGO: newOrdCodigo,
                        PRD_CODIGO: det.PRD_CODIGO,
                        CANTIDAD: det.DET_ORD_COMPRA_CANTIDAD,
                        COSTO: det.DET_ORD_COMPRA_COSTO_UNITARIO
                    },
                    { autoCommit: false }
                );
            }
        }

        await connection.commit();
        return { success: true, ordCodigo: newOrdCodigo };

    } catch (err) {
        console.error('[OrdenCompraModel] Error creating orden:', err);
        if (connection) {
            try { await connection.rollback(); } catch (e) { console.error('Rollback error', e); }
        }
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const recibirMercaderia = async (ordCodigo: number) => {
    let connection;
    try {
        connection = await openConnection();
        await connection.execute(
            `BEGIN
                PR_RECEPCION_MERCADERIA(:p_ord_codigo);
             END;`,
            {
                p_ord_codigo: Number(ordCodigo)
            },
            { autoCommit: true }
        );
        return { success: true };
    } catch (err) {
        console.error('[OrdenCompraModel] Error receiving mercaderia:', err);
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};

export const deleteOrden = async (ordCodigo: number) => {
    let connection;
    try {
        connection = await openConnection();
        // First delete details
        await connection.execute(
            `DELETE FROM DETALLE_ORD_COMPRA WHERE ORD_CODIGO = :id`,
            { id: ordCodigo },
            { autoCommit: false }
        );

        // Then delete header
        await connection.execute(
            `DELETE FROM ORDEN_DE_COMPRA WHERE ORD_CODIGO = :id`,
            { id: ordCodigo },
            { autoCommit: false }
        );

        await connection.commit();
        return { success: true };
    } catch (err) {
        console.error('[OrdenCompraModel] Error deleting orden:', err);
        if (connection) {
            try { await connection.rollback(); } catch (e) { console.error(e); }
        }
        throw err;
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
};
