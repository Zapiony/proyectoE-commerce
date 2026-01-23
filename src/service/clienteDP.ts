'use server';

export interface ICliente {
    CLI_CEDULA_RUC: string;
    CLI_NOMBRE: string;
    CLI_TELEFONO: string;
    CLI_CORREO: string;
}

export async function createClient(cliente: ICliente) {
    try {
        const validationError = validateClientData(cliente);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const clientToSave = { ...cliente, CLI_NOMBRE: cliente.CLI_NOMBRE.toUpperCase() };

        const response = await fetch(`${process.env.API_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientToSave)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al crear cliente' };
        }

        return { success: true, message: 'Cliente creado correctamente', data: data };
    } catch (error) {
        console.error('Error creating cliente:', error);
        return { success: false, message: 'Error al crear cliente' };
    }
}

export async function getClientes() {
    try {
        const response = await fetch(`${process.env.API_URL}/clients`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const clientes = await response.json();
        return { success: true, data: clientes };
    } catch (error) {
        console.error('Error fetching clientes:', error);
        return { success: false, message: 'Error al obtener clientes' };
    }
}

export async function updateClient(cliente: ICliente) {
    try {
        const validationError = validateClientData(cliente);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const clientToSave = { ...cliente, CLI_NOMBRE: cliente.CLI_NOMBRE.toUpperCase() };

        const response = await fetch(`${process.env.API_URL}/clients/${cliente.CLI_CEDULA_RUC}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientToSave)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Error al actualizar cliente' };
        }

        return { success: true, message: 'Cliente actualizado correctamente', data: data };
    } catch (error) {
        console.error('Error updating cliente:', error);
        return { success: false, message: 'Error al actualizar cliente' };
    }
}

export async function deleteClient(cedula: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/clients/${cedula}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { success: false, message: data.message || 'Error al eliminar cliente' };
        }

        return { success: true, message: 'Cliente eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting cliente:', error);
        return { success: false, message: 'Error al eliminar cliente' };
    }
}

export async function getClientByCedula(cedula: string) {
    try {
        const res = await fetch(`${process.env.API_URL}/clients/${cedula}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error('Error fetching client by cedula:', e);
        return null;
    }
}

export async function getClientDetails(token: string) {
    try {
        console.log("getClientDetails: Fetching profile with token...");
        const res = await fetch(`${process.env.API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            if (data.user) {
                const u = data.user;
                // Map user profile to ICliente structure if needed, or return compatible object
                // ICliente requires: CLI_CEDULA_RUC, CLI_NOMBRE, CLI_TELEFONO, CLI_CORREO
                return {
                    CLI_CEDULA_RUC: u.cedula || u.CLI_CEDULA_RUC,
                    CLI_NOMBRE: u.name || u.CLI_NOMBRE,
                    CLI_TELEFONO: u.telephone || u.CLI_TELEFONO || '0000000000',
                    CLI_CORREO: u.email || u.CLI_CORREO
                };
            }
        }
    } catch (e) {
        console.error("getClientDetails: Token fetch failed, falling back to search.", e);
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