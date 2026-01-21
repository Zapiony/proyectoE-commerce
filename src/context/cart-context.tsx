'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProducto } from "@/service/productoDP";
import { useAuth } from './auth-context';
import { addToCart as addToCartService, getCart, removeFromCart as removeFromCartService } from '@/service/carritoComprasDP';

export interface CartItem extends IProducto {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    addToCart: (product: IProducto, quantity?: number) => void;
    removeFromCart: (productCode: string) => void;
    toggleCart: () => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [resolvedUserId, setResolvedUserId] = useState<string | undefined>(undefined);
    const { user } = useAuth();

    // Helper to extract user ID safely from the user object
    const getUserIdFromObject = (u: any) => {
        if (!u) return undefined;
        // Check direct properties
        if (u.identification) return u.identification;
        if (u.CLI_CEDULA_RUC) return u.CLI_CEDULA_RUC;
        if (u.id) return u.id;

        // Check nested 'user' object
        if (u.user) {
            if (u.user.identification) return u.user.identification;
            if (u.user.CLI_CEDULA_RUC) return u.user.CLI_CEDULA_RUC;
            if (u.user.id) return u.user.id;
        }
        return undefined;
    };

    // Effect to Resolve User ID (from object or via API)
    useEffect(() => {
        if (!user) {
            setResolvedUserId(undefined);
            return;
        }

        const idFromObj = getUserIdFromObject(user);
        if (idFromObj) {
            setResolvedUserId(idFromObj);
        } else {
            // Try to fetch via API if we have a username/name
            const username = user.name || (user.user && user.user.name);
            if (username) {
                console.log("CartContext: User ID missing in object. Fetching for username:", username);
                import('@/service/carritoComprasDP').then(mod => {
                    mod.getClientIdentification(username).then(id => {
                        console.log("CartContext: Resolved ID from API:", id);
                        if (id) setResolvedUserId(id);
                    });
                });
            }
        }
    }, [user]);

    // Load cart logic
    useEffect(() => {
        // Detailed log
        if (user) {
            console.log("CartContext: Processing Cart for Resolved ID:", resolvedUserId);
        }

        // If user is logged in and we have an ID, prioritize server cart
        if (resolvedUserId) {
            getCart(resolvedUserId).then((response) => {
                if (response.success && response.data) {
                    const apiItems = response.data.map((item: any) => ({
                        PRD_CODIGO: item.PRD_CODIGO,
                        CAT_CODIGO: item.CAT_CODIGO || 'DEFAULT',
                        PRD_DESCRIPCION: item.PRD_DESCRIPCION,
                        PRD_PRECIO: item.PRD_PRECIO,
                        PRD_COSTO_ADQUISICION: item.PRD_COSTO_ADQUISICION || 0,
                        quantity: item.DET_CAR_CANTIDAD
                    }));
                    setCart(apiItems);
                } else {
                    setCart([]);
                }
            }).catch(e => console.error(e));
        } else {
            // Guest mode: use local storage (only if no user is fully resolved yet)
            // But if user is null, definitely guest mode.
            if (!user) {
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                    try {
                        setCart(JSON.parse(storedCart));
                    } catch (e) {
                        console.error("Failed to parse cart", e);
                        setCart([]);
                    }
                } else {
                    setCart([]);
                }
            }
        }
    }, [user, resolvedUserId]);

    // Save to localStorage ONLY if user is guest
    useEffect(() => {
        if (!user && !resolvedUserId) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, user, resolvedUserId]);

    const addToCart = async (product: IProducto, quantity = 1) => {
        console.log("CartContext: addToCart called for", product.PRD_CODIGO, "Quantity:", quantity);
        console.log("CartContext: Current resolvedUserId:", resolvedUserId);

        // Optimistic update
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.PRD_CODIGO === product.PRD_CODIGO);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.PRD_CODIGO === product.PRD_CODIGO
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
        setIsCartOpen(true);

        // API call if user is logged in
        if (resolvedUserId) {
            console.log("CartContext: Triggering API call to add item...");
            await addToCartService(resolvedUserId, product.PRD_CODIGO, quantity);
        } else {
            console.warn("CartContext: Cannot fetch API, resolvedUserId is missing.");
        }
    };

    const removeFromCart = async (productCode: string) => {
        // Optimistic update
        setCart((prevCart) => prevCart.filter((item) => item.PRD_CODIGO !== productCode));

        // API call if user is logged in
        if (resolvedUserId) {
            await removeFromCartService(resolvedUserId, productCode);
        }
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const clearCart = () => setCart([]);

    const total = cart.reduce((acc, item) => acc + item.PRD_PRECIO * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, isCartOpen, addToCart, removeFromCart, toggleCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );

};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
