'use server';

export interface IProducto {
    PRD_CODIGO: string;
    CAT_CODIGO: string;
    PRD_DESCRIPCION: string;
    PRD_PRECIO: number;
    PRD_COSTO_ADQUISICION: number;
}

export async function getProducts() {
    try {
        const response = await fetch(`${process.env.API_URL}/products`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const rawData = await response.json();

        const productos = rawData.map((item: any) => ({
            PRD_CODIGO: item.PRD_CODIGO,
            CAT_CODIGO: item.CAT_CODIGO,
            PRD_DESCRIPCION: item.PRD_DESCRIPCION || '',
            PRD_PRECIO: item.PRD_PRECIO,
            PRD_COSTO_ADQUISICION: item.PRD_COSTO_ADQUISICION
        }));

        return { success: true, data: productos };
    } catch (error) {
        console.error('Error fetching productos:', error);
        return { success: false, message: 'Error al obtener productos' };
    }
}

export async function getProductByCode(code: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/products/${code}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.warn(`Producto ${code} not found or error.`);
            return { success: false, message: 'Producto no encontrado' };
        }

        const rawData = await response.json();

        const producto = {
            PRD_CODIGO: rawData.PRD_CODIGO,
            CAT_CODIGO: rawData.CAT_CODIGO,
            PRD_DESCRIPCION: rawData.PRD_DESCRIPCION || '',
            PRD_PRECIO: rawData.PRD_PRECIO,
            PRD_COSTO_ADQUISICION: rawData.PRD_COSTO_ADQUISICION
        };

        return { success: true, data: producto };
    } catch (error) {
        console.error('Error fetching producto:', error);
        return { success: false, message: 'Error al obtener producto' };
    }
}

export async function createProduct(product: IProducto) {
    try {
        const validationError = validateProductData(product);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const productToSave = {
            ...product,
            PRD_DESCRIPCION: product.PRD_DESCRIPCION.toUpperCase(),
            PRD_PRECIO: Number(product.PRD_PRECIO),
            PRD_COSTO_ADQUISICION: Number(product.PRD_COSTO_ADQUISICION)
        };

        const response = await fetch(`${process.env.API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productToSave)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al crear producto' };
        }

        return { success: true, message: 'Producto creado correctamente', data: data };
    } catch (error) {
        console.error('Error creating producto:', error);
        return { success: false, message: 'Error al crear producto' };
    }
}

export async function updateProduct(product: IProducto) {
    try {
        const validationError = validateProductData(product);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const productToSave = {
            ...product,
            PRD_DESCRIPCION: product.PRD_DESCRIPCION.toUpperCase(),
            PRD_PRECIO: Number(product.PRD_PRECIO),
            PRD_COSTO_ADQUISICION: Number(product.PRD_COSTO_ADQUISICION)
        };

        const response = await fetch(`${process.env.API_URL}/products/${product.PRD_CODIGO}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productToSave)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al actualizar producto' };
        }

        return { success: true, message: 'Producto actualizado correctamente', data: data };
    } catch (error) {
        console.error('Error updating producto:', error);
        return { success: false, message: 'Error al actualizar producto' };
    }
}

export async function deleteProduct(code: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/products/${code}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { success: false, message: data.message || 'Error al eliminar producto' };
        }

        return { success: true, message: 'Producto eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting producto:', error);
        return { success: false, message: 'Error al eliminar producto' };
    }
}

function validateProductData(product: IProducto) {
    if (isNaN(product.PRD_PRECIO) || product.PRD_PRECIO < 0) {
        return 'El precio debe ser un número positivo.';
    }

    if (isNaN(product.PRD_COSTO_ADQUISICION) || product.PRD_COSTO_ADQUISICION < 0) {
        return 'El costo de adquisición debe ser un número positivo.';
    }

    if (!product.PRD_DESCRIPCION || product.PRD_DESCRIPCION.trim() === '') {
        return 'La descripción es obligatoria.';
    }

    return null;
}