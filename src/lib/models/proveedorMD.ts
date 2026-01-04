import { getConnection } from '../db';
import { IProveedor } from '@/types';

export class ProveedoresMD {
    async insertar(proveedor: IProveedor): Promise<boolean> {
        let connection;
        try {
        connection = await getConnection();
        
        const sql = `
            INSERT INTO PROVEEDOR (PRV_RUC, PRV_RAZON_SOCIAL, PRV_DIRECCION, PRV_TELEFONO, PRV_NOMBRE)
            VALUES (:ruc, :razonSocial, :direccion, :telefono, :nombreContacto)
        `;

        await connection.execute(sql, {
            ruc: proveedor.ruc,
            razonSocial: proveedor.razonSocial,
            direccion: proveedor.direccion,
            telefono: proveedor.telefono,
            nombreContacto: proveedor.nombreContacto
        }, { autoCommit: true });

        return true;
        } catch (error) {
        console.error("Error en ProveedoresMD.insertar:", error);
        throw error;
        } finally {
        if (connection) {
            await connection.close();
        }
        }
    }
}