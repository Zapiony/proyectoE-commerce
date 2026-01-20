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
        // Recover session from localStorage on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setRole(parsedUser.role || 'guest');
            } catch (error) {
                console.error("Failed to parse user from local storage", error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        setRole(userData.role);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setRole('guest');
        localStorage.removeItem('user');
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
