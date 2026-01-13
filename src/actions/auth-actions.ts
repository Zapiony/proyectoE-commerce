'use server';

import { validateClient } from '@/lib/models/clienteMD';
import { validateAdmin } from '@/lib/models/administradorMD';

export async function loginAction(username: string, password: string, type: 'client' | 'employee') {
    try {
        if (type === 'client') {
            const client = await validateClient(username, password);
            if (client) {
                return { success: true, message: 'Login de cliente exitoso', user: client };
            }
        } else if (type === 'employee') {
            const admin = await validateAdmin(username, password);
            if (admin) {
                return { success: true, message: 'Login de empleado exitoso', user: admin };
            }
        }

        return { success: false, message: 'Credenciales incorrectas' };
    } catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: 'Error de servidor al intentar iniciar sesión' };
    }
}
