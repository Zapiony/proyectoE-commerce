'use server';

import { getAllClientes, createCliente, updateCliente, deleteCliente, getClienteByCedula } from '@/lib/models/clienteMD';
import { ICliente } from '@/types';

export async function deleteClientAction(cedula: string) {
    try {
        await deleteCliente(cedula);
        return { success: true, message: 'Cliente eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting cliente:', error);
        return { success: false, message: 'Error al eliminar cliente' };
    }
}

export async function getClientesAction() {
    try {
        const clientes = await getAllClientes();
        return { success: true, data: clientes };
    } catch (error) {
        console.error('Error fetching clientes:', error);
        return { success: false, message: 'Error al obtener clientes' };
    }
}

function validateClientData(cliente: ICliente) {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(cliente.CLI_NOMBRE)) {
        return 'El nombre no puede contener números ni caracteres especiales.';
    }
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(cliente.CLI_TELEFONO)) {
        return 'El teléfono debe contener solo números enteros positivos.';
    }
    if (!phoneRegex.test(cliente.CLI_CEDULA_RUC)) {
        return 'La Cédula/RUC debe contener solo números.';
    }
    return null;
}

export async function createClientAction(cliente: ICliente) {
    try {
        const validationError = validateClientData(cliente);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const clientToSave = { ...cliente, CLI_NOMBRE: cliente.CLI_NOMBRE.toUpperCase() };

        const existing = await getClienteByCedula(cliente.CLI_CEDULA_RUC);
        if (existing) {
            return { success: false, message: 'El número de cédula/RUC ya se encuentra registrado.' };
        }

        await createCliente(clientToSave);
        return { success: true, message: 'Cliente creado correctamente', data: clientToSave };
    } catch (error) {
        console.error('Error creating cliente:', error);
        return { success: false, message: 'Error al crear cliente' };
    }
}

export async function updateClientAction(cliente: ICliente) {
    try {
        const validationError = validateClientData(cliente);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const clientToSave = { ...cliente, CLI_NOMBRE: cliente.CLI_NOMBRE.toUpperCase() };

        await updateCliente(clientToSave);
        return { success: true, message: 'Cliente actualizado correctamente', data: clientToSave };
    } catch (error) {
        console.error('Error updating cliente:', error);
        return { success: false, message: 'Error al actualizar cliente' };
    }
}
