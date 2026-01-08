'use server';

import { getAllProveedores, createProveedor, updateProveedor, deleteProveedor, getProveedorByRuc } from '@/lib/models/proveedorMD';
import { IProveedor } from '@/types';

function validateProveedorData(proveedor: IProveedor) {
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(proveedor.PRV_TELEFONO)) {
        return 'El teléfono debe contener solo números enteros positivos.';
    }

    if (!phoneRegex.test(proveedor.PRV_RUC)) {
        return 'El RUC debe contener solo números.';
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(proveedor.PRV_NOMBRE)) {
        return 'El nombre de contacto no puede contener números ni caracteres especiales.';
    }

    return null;
}

export async function getProveedoresAction() {
    try {
        const proveedores = await getAllProveedores();
        return { success: true, data: proveedores };
    } catch (error) {
        console.error('Error fetching proveedores:', error);
        return { success: false, message: 'Error al obtener proveedores' };
    }
}

export async function createProveedorAction(proveedor: IProveedor) {
    try {
        const validationError = validateProveedorData(proveedor);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const proveedorToSave = {
            ...proveedor,
            PRV_NOMBRE: proveedor.PRV_NOMBRE.toUpperCase(),
            PRV_DIRECCION: proveedor.PRV_DIRECCION.toUpperCase(),
            PRV_RAZON_SOCIAL: proveedor.PRV_RAZON_SOCIAL.toUpperCase()
        };

        const existing = await getProveedorByRuc(proveedor.PRV_RUC);
        if (existing) {
            return { success: false, message: 'El RUC ya se encuentra registrado.' };
        }

        await createProveedor(proveedorToSave);
        return { success: true, message: 'Proveedor creado correctamente', data: proveedorToSave };
    } catch (error) {
        console.error('Error creating proveedor:', error);
        return { success: false, message: 'Error al crear proveedor' };
    }
}

export async function updateProveedorAction(proveedor: IProveedor) {
    try {
        const validationError = validateProveedorData(proveedor);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const proveedorToSave = {
            ...proveedor,
            PRV_NOMBRE: proveedor.PRV_NOMBRE.toUpperCase(),
            PRV_DIRECCION: proveedor.PRV_DIRECCION.toUpperCase(),
            PRV_RAZON_SOCIAL: proveedor.PRV_RAZON_SOCIAL.toUpperCase()
        };

        await updateProveedor(proveedorToSave);
        return { success: true, message: 'Proveedor actualizado correctamente', data: proveedorToSave };
    } catch (error) {
        console.error('Error updating proveedor:', error);
        return { success: false, message: 'Error al actualizar proveedor' };
    }
}

export async function deleteProveedorAction(ruc: string) {
    try {
        await deleteProveedor(ruc);
        return { success: true, message: 'Proveedor eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting proveedor:', error);
        return { success: false, message: 'Error al eliminar proveedor' };
    }
}
