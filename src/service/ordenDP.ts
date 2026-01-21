'use server';

export interface IOrdenCompra {
    ORD_CODIGO?: number; 
    PRV_RUC: string;
    PRV_NOMBRE?: string; 
    ORD_FECHA_ENTREGA: Date | string;
    ORD_ESTADO: string;
}

export interface IDetalleOrdenCompra {
    ORD_CODIGO?: number;
    PRD_CODIGO: string;
    DET_ORD_COMPRA_CANTIDAD: number;
    DET_ORD_COMPRA_COSTO_UNITARIO: number;
}

export async function getOrdenes() {
    try {
        const response = await fetch(`${process.env.API_URL}/purchase-orders`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const ordenes = await response.json();
        return { success: true, data: ordenes };
    } catch (error) {
        console.error('Error fetching ordenes:', error);
        return { success: false, message: 'Error al obtener ordenes de compra' };
    }
}

export async function createOrden(orden: IOrdenCompra, detalles: IDetalleOrdenCompra[]) {
    try {
        if (!orden.PRV_RUC) return { success: false, message: 'Seleccione un proveedor.' };
        if (!orden.ORD_FECHA_ENTREGA) return { success: false, message: 'Ingrese la fecha de entrega.' };
        if (!detalles || detalles.length === 0) return { success: false, message: 'Agregue al menos un producto.' };

        const payload = {
            PRV_RUC: orden.PRV_RUC,
            ORD_FECHA_ENTREGA: orden.ORD_FECHA_ENTREGA,
            detalles: detalles.map(d => ({
                PRD_CODIGO: d.PRD_CODIGO,
                DET_ORD_COMPRA_CANTIDAD: Number(d.DET_ORD_COMPRA_CANTIDAD),
                DET_ORD_COMPRA_COSTO_UNITARIO: Number(d.DET_ORD_COMPRA_COSTO_UNITARIO)
            }))
        };

        const response = await fetch(`${process.env.API_URL}/purchase-orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al registrar la orden de compra.' };
        }

        return { success: true, message: 'Orden creada correctamente', data };
    } catch (error) {
        console.error('Error creating orden:', error);
        return { success: false, message: 'Error al registrar la orden de compra.' };
    }
}

export async function recibirPedido(ordCodigo: number) {
    try {
        const response = await fetch(`${process.env.API_URL}/purchase-orders/${ordCodigo}/receive`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al recibir el pedido.' };
        }

        return { success: true, message: 'Pedido recibido correctamente', data };
    } catch (error) {
        console.error('Error receiving pedido:', error);
        return { success: false, message: 'Error al recibir el pedido.' };
    }
}

export async function deleteOrden(ordCodigo: number) {
    try {
        const response = await fetch(`${process.env.API_URL}/purchase-orders/${ordCodigo}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { success: false, message: data.message || 'Error al eliminar la orden.' };
        }

        return { success: true, message: 'Orden eliminada correctamente' };
    } catch (error) {
        console.error('Error deleting orden:', error);
        return { success: false, message: 'Error al eliminar la orden.' };
    }
}