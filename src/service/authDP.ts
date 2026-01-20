'use server';

export async function loginAction(username: string, password: string, type: 'client' | 'employee') {
    try {
        const payload: any = { username, password };

        if (type === 'employee') {
            payload.isAdmin = true;
        }

        const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: 'Login exitoso', user: data };
        }

        return { success: false, message: data.message || 'Credenciales incorrectas' };
    } catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: 'Error de servidor al intentar iniciar sesión' };
    }
}
export async function registerAction(userData: any) {
    try {
        const payload = {
            identification: userData.identification,
            name: userData.name.toUpperCase(),
            username: userData.username,
            password: userData.password,
            email: userData.email
        };

        const response = await fetch(`${process.env.API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: 'Registro exitoso' };
        }

        return { success: false, message: data.message || 'Error en el registro' };
    } catch (error) {
        console.error('Register Error:', error);
        return { success: false, message: 'Error de servidor al intentar registrarse' };
    }
}
