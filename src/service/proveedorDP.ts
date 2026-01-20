'use server';

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(proveedor.PRV_CORREO)) {
        return 'El correo electrónico no es válido.';
    }

    return null;
}

export async function getProveedoresAction() {
    try {
        const response = await fetch(`${process.env.API_URL}/suppliers`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const rawData = await response.json();

        // Map API response to IProveedor
        const proveedores = rawData.map((item: any) => ({
            PRV_RUC: item.PRV_RUC,
            PRV_NOMBRE: item.PRV_NOMBRE || '', // Handle missing field if backend doesn't return it logic
            PRV_DIRECCION: item.PRV_DIRECCION,
            PRV_TELEFONO: item.PRV_TELEFONO,
            PRV_CORREO: item.PRV_CORREO,
            PRV_RAZON_SOCIAL: item.PRV_RAZON_SOCIAL
        }));

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
            PRV_RAZON_SOCIAL: proveedor.PRV_RAZON_SOCIAL.toUpperCase(),
            PRV_DIRECCION: proveedor.PRV_DIRECCION.toUpperCase()
        };

        const response = await fetch(`${process.env.API_URL}/suppliers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proveedorToSave)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al crear proveedor' };
        }

        return { success: true, message: 'Proveedor creado correctamente', data: data };
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
            PRV_RAZON_SOCIAL: proveedor.PRV_RAZON_SOCIAL.toUpperCase(),
            PRV_DIRECCION: proveedor.PRV_DIRECCION.toUpperCase()
        };

        const response = await fetch(`${process.env.API_URL}/suppliers/${proveedor.PRV_RUC}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proveedorToSave)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al actualizar proveedor' };
        }

        return { success: true, message: 'Proveedor actualizado correctamente', data: data };
    } catch (error) {
        console.error('Error updating proveedor:', error);
        return { success: false, message: 'Error al actualizar proveedor' };
    }
}

export async function deleteProveedorAction(ruc: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/suppliers/${ruc}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { success: false, message: data.message || 'Error al eliminar proveedor' };
        }

        return { success: true, message: 'Proveedor eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting proveedor:', error);
        return { success: false, message: 'Error al eliminar proveedor' };
    }
}
