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

export async function getFacturas(token?: string) {
    try {
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${process.env.API_URL}/invoices`, {
            method: 'GET',
            headers: headers,
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

export async function anularFactura(codigo: number, token?: string) {
    try {
        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${process.env.API_URL}/invoices/${codigo}`, {
            method: 'DELETE',
            headers: headers,
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

export async function getMonthlySalesStats(token?: string) {
    try {
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${process.env.API_URL}/invoices/stats/monthly`, {
            method: 'GET',
            headers: headers,
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data: data };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { success: false, message: 'Error al obtener estadísticas' };
    }
}

export async function downloadFacturaPdf(codigo: number, token?: string) {
    try {
        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.API_URL}/invoices/${codigo}/pdf`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');

        return { success: true, data: base64 };
    } catch (error) {
        console.error('Error downloading PDF:', error);
        return { success: false, message: 'Error al descargar el PDF' };
    }
}