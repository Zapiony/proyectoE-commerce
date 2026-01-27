'use server';

export interface IProveedor {
    PRV_RUC: string;
    PRV_DIRECCION: string;
    PRV_TELEFONO: string;
    PRV_CORREO: string;
    PRV_RAZON_SOCIAL: string;
}

export async function getSuppliers(token?: string) {
    try {
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${process.env.API_URL}/suppliers`, {
            method: 'GET',
            headers: headers,
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const rawData = await response.json();

        const suppliers = rawData.map((item: any) => ({
            PRV_RUC: item.PRV_RUC,
            PRV_NOMBRE: item.PRV_NOMBRE,
            PRV_DIRECCION: item.PRV_DIRECCION,
            PRV_TELEFONO: item.PRV_TELEFONO,
            PRV_CORREO: item.PRV_CORREO,
            PRV_RAZON_SOCIAL: item.PRV_RAZON_SOCIAL
        }));

        return { success: true, data: suppliers };
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        return { success: false, message: 'Error al obtener suppliers' };
    }
}

export async function createSupplier(supplier: IProveedor, token?: string) {
    try {
        const validationError = validateProveedorData(supplier);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const supplierToSave = {
            ...supplier,
            PRV_RAZON_SOCIAL: supplier.PRV_RAZON_SOCIAL.toUpperCase(),
            PRV_DIRECCION: supplier.PRV_DIRECCION.toUpperCase(),
            PRV_CORREO: supplier.PRV_CORREO.toUpperCase()
        };

        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.API_URL}/suppliers`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(supplierToSave)
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

export async function updateSupplier(supplier: IProveedor, token?: string) {
    try {
        const validationError = validateProveedorData(supplier);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const supplierToSave = {
            ...supplier,
            PRV_RAZON_SOCIAL: supplier.PRV_RAZON_SOCIAL.toUpperCase(),
            PRV_DIRECCION: supplier.PRV_DIRECCION.toUpperCase()
        };

        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.API_URL}/suppliers/${supplier.PRV_RUC}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(supplierToSave)
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

export async function deleteSupplier(ruc: string, token?: string) {
    try {
        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${process.env.API_URL}/suppliers/${ruc}`, {
            method: 'DELETE',
            headers: headers,
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

function validateProveedorData(supplier: IProveedor) {
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(supplier.PRV_TELEFONO)) {
        return 'El teléfono debe contener solo números enteros positivos.';
    }

    if (!phoneRegex.test(supplier.PRV_RUC)) {
        return 'El RUC debe contener solo números.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplier.PRV_CORREO)) {
        return 'El correo electrónico no es válido.';
    }

    return null;
}