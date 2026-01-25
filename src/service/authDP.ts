'use server';

export async function loginAction(username: string, password: string) {
    try {
        const payload: any = { username, password };

        const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message };
        }

        return { success: true, message: 'Login exitoso', user: data };
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

export async function getProfileAction(token: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return { success: false, message: 'Invalid token' };
        }

        const data = await response.json();
        return { success: true, data: data };
    } catch (error) {
        console.error('Get Profile Error:', error);
        return { success: false, message: 'Server error' };
    }
}
