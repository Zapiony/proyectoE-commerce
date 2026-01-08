'use server';

import { getAllProductos, createProducto, updateProducto, deleteProducto, getProductoByCodigo } from '@/lib/models/productoMD';
import { IProducto } from '@/types';

function validateProductoData(producto: IProducto) {
    if (isNaN(producto.PRD_PRECIO) || producto.PRD_PRECIO < 0) {
        return 'El precio debe ser un número positivo.';
    }

    if (isNaN(producto.PRD_COSTO_ADQUISICION) || producto.PRD_COSTO_ADQUISICION < 0) {
        return 'El costo de adquisición debe ser un número positivo.';
    }

    if (!producto.PRD_DESCRIPCION || producto.PRD_DESCRIPCION.trim() === '') {
        return 'La descripción es obligatoria.';
    }

    return null;
}

export async function getProductosAction() {
    try {
        const productos = await getAllProductos();
        return { success: true, data: productos };
    } catch (error) {
        console.error('Error fetching productos:', error);
        return { success: false, message: 'Error al obtener productos' };
    }
}

export async function createProductoAction(producto: IProducto) {
    try {
        const validationError = validateProductoData(producto);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const productoToSave = {
            ...producto,
            PRD_DESCRIPCION: producto.PRD_DESCRIPCION.toUpperCase()
        };

        const existing = await getProductoByCodigo(producto.PRD_CODIGO);
        if (existing) {
            return { success: false, message: 'El código del producto ya se encuentra registrado.' };
        }

        await createProducto(productoToSave);
        return { success: true, message: 'Producto creado correctamente', data: productoToSave };
    } catch (error) {
        console.error('Error creating producto:', error);
        return { success: false, message: 'Error al crear producto' };
    }
}

export async function updateProductoAction(producto: IProducto) {
    try {
        const validationError = validateProductoData(producto);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const productoToSave = {
            ...producto,
            PRD_DESCRIPCION: producto.PRD_DESCRIPCION.toUpperCase()
        };

        await updateProducto(productoToSave);
        return { success: true, message: 'Producto actualizado correctamente', data: productoToSave };
    } catch (error) {
        console.error('Error updating producto:', error);
        return { success: false, message: 'Error al actualizar producto' };
    }
}

export async function deleteProductoAction(codigo: string) {
    try {
        await deleteProducto(codigo);
        return { success: true, message: 'Producto eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting producto:', error);
        return { success: false, message: 'Error al eliminar producto' };
    }
}
