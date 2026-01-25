'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'guest' | 'client' | 'admin';

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
                console.log('Perfil del usuario (Nuevo):', data);

                if (data) {
                    // The structure might be nested depending on how backend returns it
                    // Based on previous code: data.user or data directly
                    const valUser = data.user || data;
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
                // Only remove token if it was really invalid (401/403), but for now safe to clear on error to prevent infinite loops
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
