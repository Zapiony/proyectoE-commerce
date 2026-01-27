'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'guest' | 'client' | 'dba' | 'admin' | 'ROL_BODEGUERO' | 'ROL_VENTAS' | 'ROL_MARKETING' | 'ROL_COMPRAS';

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

                const { getProfileAction } = await import('../service/authDP');
                const result = await getProfileAction(token);

                if (!result.success) {
                    throw new Error(result.message || 'Failed to fetch profile');
                }

                const data = result.data;

                if (data) {
                    const valUser = data.user || data;
                    const userFinal = {
                        ...valUser,
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

        const token = userData.access_token || userData.token;
        if (token) {
            localStorage.setItem('token', token);
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
