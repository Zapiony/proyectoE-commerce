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

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
            setResolvedUserId(undefined);
            setCart([]);
            return;
        }

        console.log("CartContext: Resolving User ID via Token...");
        import('@/service/carritoComprasDP').then(mod => {
            mod.getClientIdentification().then(id => {
                console.log("CartContext: Resolved ID from API (via token):", id);
                if (id) {
                    setResolvedUserId(id);
                } else {
                    console.warn("CartContext: Token present but could not resolve ID.");
                    // Optional fallback or logout?
                }
            });
        });
    }, [user]); // Trigger on user/auth changes

    // Load cart logic
    useEffect(() => {
        // Detailed log
        if (user) {
            console.log("CartContext: Processing Cart for Resolved ID:", resolvedUserId);
        } else {
            setCart([]); // Ensure cleared if no user
        }

        // If user is logged in and we have an ID, prioritize server cart
        if (resolvedUserId) {
            setCart([]); // Clear temporary while fetching to avoid stale data
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined;
            getCart(resolvedUserId, token).then((response) => {
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
        }
    }, [user, resolvedUserId]);

    const addToCart = async (product: IProducto, quantity = 1) => {
        console.log("CartContext: addToCart called for", product.PRD_CODIGO, "Quantity:", quantity);

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

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            console.log("CartContext: Triggering API call with token resolution...");
            import('@/service/carritoComprasDP').then(mod => {
                mod.getClientIdentification().then(freshId => {
                    if (freshId) {
                        console.log("CartContext: Resolved ID from token:", freshId);
                        addToCartService(freshId, product.PRD_CODIGO, quantity, token);
                    } else {
                        console.warn("CartContext: Could not resolve ID from token for add to cart.");
                    }
                });
            });
        } else {
            if (resolvedUserId) {
                const storedToken = localStorage.getItem('token') || undefined;
                await addToCartService(resolvedUserId, product.PRD_CODIGO, quantity, storedToken);
            } else {
                console.warn("CartContext: Cannot fetch API, no token and no resolvedUserId.");
            }
        }
    };

    const removeFromCart = async (productCode: string) => {
        // Optimistic update
        setCart((prevCart) => prevCart.filter((item) => item.PRD_CODIGO !== productCode));

        // API call using TOKEN
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            import('@/service/carritoComprasDP').then(mod => {
                mod.getClientIdentification().then(freshId => {
                    if (freshId) {
                        removeFromCartService(freshId, productCode, token);
                    }
                });
            });
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
