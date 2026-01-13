'use server';

import { getAllBodegas, createBodega, updateBodega, deleteBodega, getBodegaByCodigo } from '@/lib/models/bodegaMD';
import { IBodega } from '@/types';

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

export async function getBodegasAction() {
    try {
        const bodegas = await getAllBodegas();
        return { success: true, data: bodegas };
    } catch (error) {
        console.error('Error fetching bodegas:', error);
        return { success: false, message: 'Error al obtener bodegas' };
    }
}

export async function createBodegaAction(bodega: IBodega) {
    try {
        const validationError = validateBodegaData(bodega);
        if (validationError) {
            return { success: false, message: validationError };
        }

        // Convert to uppercase
        const bodegaToSave = {
            ...bodega,
            BOD_DESCRIPCION: bodega.BOD_DESCRIPCION.toUpperCase(),
            BOD_DIRECCION: bodega.BOD_DIRECCION.toUpperCase(),
            BOD_NOMBRE_ENCARGADO: bodega.BOD_NOMBRE_ENCARGADO.toUpperCase()
        };

        const existing = await getBodegaByCodigo(bodega.BOD_CODIGO);
        if (existing) {
            return { success: false, message: 'El código de bodega ya se encuentra registrado.' };
        }

        await createBodega(bodegaToSave);
        return { success: true, message: 'Bodega creada correctamente', data: bodegaToSave };
    } catch (error) {
        console.error('Error creating bodega:', error);
        return { success: false, message: 'Error al crear bodega' };
    }
}

export async function updateBodegaAction(bodega: IBodega) {
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

        await updateBodega(bodegaToSave);
        return { success: true, message: 'Bodega actualizada correctamente', data: bodegaToSave };
    } catch (error) {
        console.error('Error updating bodega:', error);
        return { success: false, message: 'Error al actualizar bodega' };
    }
}

export async function deleteBodegaAction(codigo: string) {
    try {
        await deleteBodega(codigo);
        return { success: true, message: 'Bodega eliminada correctamente' };
    } catch (error) {
        console.error('Error deleting bodega:', error);
        return { success: false, message: 'Error al eliminar bodega' };
    }
}
