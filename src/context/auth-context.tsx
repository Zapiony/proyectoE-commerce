'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'guest' | 'client' | 'employee';

interface User {
    username: string;
    name: string;
    role: UserRole;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    role: UserRole;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [role, setRole] = useState<UserRole>('guest');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setUser(null);
                    setRole('guest');
                    return;
                }

                // 2. Hacer la petición
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                console.log('Perfil del usuario (Nuevo):', data);

                if (data && data.user) {
                    const valUser = data.user;
                    const userFinal = {
                        ...valUser,
                        // Ensure critical ID is always at top level
                        cedula: valUser.cedula,
                        username: valUser.cedula || valUser.username || valUser.name,
                        role: valUser.role || 'client'
                    };
                    setUser(userFinal);
                    setRole(userFinal.role);
                }

            } catch (error) {
                console.error('Error al obtener perfil:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                setRole('guest');
            }
        };

        fetchProfile();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        setRole(userData.role);
        // localStorage.setItem('user', JSON.stringify(userData));

        if (userData.access_token) {
            localStorage.setItem('token', userData.access_token);
        } else if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
    };

    const logout = () => {
        setUser(null);
        setRole('guest');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
