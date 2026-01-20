'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProducto } from '@/types';

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

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: IProducto, quantity = 1) => {
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
    };

    const removeFromCart = (productCode: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.PRD_CODIGO !== productCode));
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
