'use server';

export async function getCartAction(identification: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/cart/${identification}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            // Cart might not exist yet, return empty
            return { success: true, data: [] };
        }

        const cart = await response.json();
        return { success: true, data: cart };
    } catch (error) {
        console.error('Error fetching cart:', error);
        return { success: false, message: 'Error al obtener carrito' };
    }
}

export async function addToCartAction(identification: string, product: any, quantity: number) {
    try {
        const payload = {
            productId: product.PRD_CODIGO,
            quantity: quantity
        };

        const response = await fetch(`${process.env.API_URL}/cart/${identification}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const data = await response.json();
            return { success: false, message: data.message || 'Error al agregar al carrito' };
        }

        return { success: true, message: 'Producto agregado' };
    } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, message: 'Error al agregar al carrito' };
    }
}

export async function removeFromCartAction(identification: string, productId: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/cart/${identification}/remove/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            return { success: false, message: 'Error al eliminar del carrito' };
        }

        return { success: true, message: 'Producto eliminado' };
    } catch (error) {
        console.error('Error removing from cart:', error);
        return { success: false, message: 'Error al eliminar del carrito' };
    }
}

export async function checkoutAction(identification: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/cart/${identification}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al procesar la compra' };
        }

        return { success: true, message: 'Compra realizada con éxito', data };
    } catch (error) {
        console.error('Error checkout:', error);
        return { success: false, message: 'Error al procesar la compra' };
    }
}
