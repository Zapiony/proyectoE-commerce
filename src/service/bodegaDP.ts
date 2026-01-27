'use server';

export interface IBodega {
    BOD_CODIGO: string;
    BOD_DESCRIPCION: string;
    BOD_DIRECCION: string;
    BOD_NOMBRE_ENCARGADO: string;
    BOD_TELEFONO_ENCARGADO: string;
}

function validateBodegaData(bodega: IBodega) {
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(bodega.BOD_TELEFONO_ENCARGADO)) {
        return 'El teléfono del encargado debe contener solo números enteros positivos.';
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(bodega.BOD_NOMBRE_ENCARGADO)) {
        return 'El nombre del encargado no puede contener números ni caracteres especiales.';
    }

    return null;
}

export async function getBodegasAction(token?: string) {
    try {
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${process.env.API_URL}/warehouses`, {
            method: 'GET',
            headers: headers,
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const bodegas = await response.json();
        return { success: true, data: bodegas };
    } catch (error) {
        console.error('Error fetching bodegas:', error);
        return { success: false, message: 'Error al obtener bodegas' };
    }
}

export async function createBodegaAction(bodega: IBodega, token?: string) {
    try {
        const validationError = validateBodegaData(bodega);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const bodegaToSave = {
            ...bodega,
            BOD_DESCRIPCION: bodega.BOD_DESCRIPCION.toUpperCase(),
            BOD_DIRECCION: bodega.BOD_DIRECCION.toUpperCase(),
            BOD_NOMBRE_ENCARGADO: bodega.BOD_NOMBRE_ENCARGADO.toUpperCase()
        };

        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.API_URL}/warehouses`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodegaToSave)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al crear bodega' };
        }

        return { success: true, message: 'Bodega creada correctamente', data: data };
    } catch (error) {
        console.error('Error creating bodega:', error);
        return { success: false, message: 'Error al crear bodega' };
    }
}

export async function updateBodegaAction(bodega: IBodega, token?: string) {
    try {
        const validationError = validateBodegaData(bodega);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const bodegaToSave = {
            ...bodega,
            BOD_DESCRIPCION: bodega.BOD_DESCRIPCION.toUpperCase(),
            BOD_DIRECCION: bodega.BOD_DIRECCION.toUpperCase(),
            BOD_NOMBRE_ENCARGADO: bodega.BOD_NOMBRE_ENCARGADO.toUpperCase()
        };

        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.API_URL}/warehouses/${bodega.BOD_CODIGO}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(bodegaToSave)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al actualizar bodega' };
        }

        return { success: true, message: 'Bodega actualizada correctamente', data: data };
    } catch (error) {
        console.error('Error updating bodega:', error);
        return { success: false, message: 'Error al actualizar bodega' };
    }
}

export async function deleteBodegaAction(codigo: string, token?: string) {
    try {
        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${process.env.API_URL}/warehouses/${codigo}`, {
            method: 'DELETE',
            headers: headers,
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { success: false, message: data.message || 'Error al eliminar bodega' };
        }

        return { success: true, message: 'Bodega eliminada correctamente' };
    } catch (error) {
        console.error('Error deleting bodega:', error);
        return { success: false, message: 'Error al eliminar bodega' };
    }
}