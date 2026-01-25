'use server';

import { getClientDetails } from "./clienteDP";
export { getClientDetails };

// Verify API URL loaded (Server Side)
const API_URL = process.env.API_URL;
if (!API_URL) console.warn("WARNING: process.env.API_URL is undefined in carritoComprasDP.ts");

export async function getCart(identification: string, token?: string) {
    try {
        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/cart/${identification}`, {
            headers: headers,
            cache: 'no-store',
        });

        if (!res.ok) {
            return { success: false, data: [], message: 'Error fetching cart' };
        }

        const data = await res.json();
        return { success: true, data: data.items || [] };
    } catch (e) {
        console.error('Error fetching cart:', e);
        return { success: false, data: [], message: 'Error de conexión' };
    }
}

export async function addToCart(identification: string, productId: string, quantity: number, token?: string) {
    try {
        const payload = {
            PRD_CODIGO: productId,
            cantidad: quantity
        };
        console.log("addToCart: Sending payload:", payload, "to", `${API_URL}/cart/${identification}/add`);

        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/cart/${identification}/add`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`addToCart Error: Status ${res.status}`, errorText);
            return { success: false, message: 'Error al agregar al carrito' };
        }

        return { success: true, message: 'Producto agregado' };
    } catch (e) {
        console.error('Error adding to cart:', e);
        return { success: false, message: 'Error al agregar al carrito' };
    }
}

export async function removeFromCart(identification: string, productId: string, token?: string) {
    try {
        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/cart/${identification}/remove/${productId}`, {
            method: 'DELETE',
            headers: headers,
        });

        if (!res.ok) {
            return { success: false, message: 'Error al eliminar del carrito' };
        }

        return { success: true, message: 'Producto eliminado' };
    } catch (e) {
        console.error('Error removing from cart:', e);
        return { success: false, message: 'Error al eliminar del carrito' };
    }
}

export async function getClientIdentification() {
    const client = await getClientDetails();
    console.log("getClientIdentification: Client details for cart:", client);
    return client ? client.CLI_CEDULA_RUC : null;
}

export async function checkout(identification: string, cedulaFactura: string, formaPago: string, token?: string) {
    try {
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/cart/${identification}/checkout`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ cedulaFactura, formaPago }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`checkout Error: Status ${res.status}`, errorText);
            return { success: false, message: 'Error al procesar el pago' };
        }

        return { success: true, message: 'Compra realizada con éxito' };
    } catch (e) {
        console.error('Error checkout:', e);
        return { success: false, message: 'Error de conexión' };
    }
}
