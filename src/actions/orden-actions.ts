'use server';

import { getAllOrdenes, createOrdenCompraTransaction, recibirMercaderia, deleteOrden } from '@/lib/models/ordenCompraMD';
import { IOrdenCompra, IDetalleOrdenCompra } from '@/types';

export async function getOrdenesAction() {
    try {
        const ordenes = await getAllOrdenes();
        const serialized = ordenes.map(o => ({
            ...o,
            ORD_FECHA_ENTREGA: new Date(o.ORD_FECHA_ENTREGA).toISOString().split('T')[0]
        }));
        return { success: true, data: serialized };
    } catch (error) {
        console.error('Error fetching ordenes:', error);
        return { success: false, message: 'Error al obtener ordenes de compra' };
    }
}

export async function createOrdenAction(orden: IOrdenCompra, detalles: IDetalleOrdenCompra[]) {
    try {
        if (!orden.PRV_RUC) return { success: false, message: 'Seleccione un proveedor.' };
        if (!orden.ORD_FECHA_ENTREGA) return { success: false, message: 'Ingrese la fecha de entrega.' };
        if (!detalles || detalles.length === 0) return { success: false, message: 'Agregue al menos un producto.' };

        await createOrdenCompraTransaction(orden, detalles);
        return { success: true, message: 'Orden de compra creada exitosamente.' };
    } catch (error) {
        console.error('Error creating orden:', error);
        return { success: false, message: 'Error al registrar la orden de compra.' };
    }
}

export async function recibirPedidoAction(ordCodigo: number) {
    try {
        await recibirMercaderia(ordCodigo);
        return { success: true, message: 'Mercadería recibida y stock actualizado.' };
    } catch (error) {
        console.error('Error receiving pedido:', error);
        const errString = String(error);
        if (errString.includes('ORA-')) {
        }
        return { success: false, message: 'Error al recibir el pedido. Verifique el estado o los datos.' };
    }
}

export async function deleteOrdenAction(ordCodigo: number) {
    try {
        await deleteOrden(ordCodigo);
        return { success: true, message: 'Orden eliminada correctamente.' };
    } catch (error) {
        console.error('Error deleting orden:', error);
        return { success: false, message: 'Error al eliminar la orden.' };
    }
}
