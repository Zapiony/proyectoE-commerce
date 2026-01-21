'use server';

export interface IFactura {
    FAC_CODIGO: number;
    CLI_CEDULA_RUC: string;
    FAC_FECHA: Date | string;
    FAC_SUBTOTAL: number;
    FAC_IVA: number;
    FAC_MONTO_TOTAL: number;
    FAC_METODO_PAGO: string;
}

export async function getFacturas() {
    try {
        const response = await fetch(`${process.env.API_URL}/invoices`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const rawData = await response.json();

        const facturas: IFactura[] = rawData.map((item: any) => ({
            FAC_CODIGO: item.FAC_CODIGO,
            CLI_CEDULA_RUC: item.CLI_CEDULA_RUC,
            FAC_FECHA: item.FAC_FECHA,
            FAC_SUBTOTAL: item.FAC_SUBTOTAL,
            FAC_IVA: item.FAC_IVA,
            FAC_MONTO_TOTAL: item.FAC_MONTO_TOTAL,
            FAC_METODO_PAGO: item.FAC_METODO_PAGO
        }));

        return { success: true, data: facturas };
    } catch (error) {
        console.error('Error fetching facturas:', error);
        return { success: false, message: 'Error al obtener facturas' };
    }
}

export async function anularFactura(codigo: number) {
    try {
        const response = await fetch(`${process.env.API_URL}/invoices/${codigo}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { success: false, message: data.message || 'Error al anular factura' };
        }

        return { success: true, message: 'Factura anulada correctamente' };
    } catch (error) {
        console.error('Error anulling factura:', error);
        return { success: false, message: 'Error al anular factura' };
    }
}