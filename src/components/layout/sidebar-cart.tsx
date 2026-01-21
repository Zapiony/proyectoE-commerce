'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CheckoutModal from '../cart/checkout-modal';

export default function SidebarCart() {
    const { isCartOpen, toggleCart, cart, removeFromCart, total } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const router = useRouter();

    if (!isCartOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
                style={{ zIndex: 1040 }}
                onClick={toggleCart}
            ></div>

            {/* Sidebar */}
            <div
                className="position-fixed top-0 end-0 h-100 bg-white shadow-lg p-4 d-flex flex-column"
                style={{ width: '400px', zIndex: 1050, transition: 'transform 0.3s ease-in-out' }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h4 className="fw-bold m-0">Carrito de compras</h4>
                    <button onClick={toggleCart} className="btn btn-secondary rounded-circle btn-sm">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="flex-grow-1 overflow-auto">
                    {cart.length === 0 ? (
                        <p className="text-center text-muted mt-5">Tu carrito está vacío.</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item.PRD_CODIGO} className="d-flex mb-3 p-3 bg-secondary text-white rounded align-items-center">
                                <div className="me-3 position-relative" style={{ width: '80px', height: '60px' }}>
                                    <Image
                                        src="/img/logoPrincipal.png"
                                        alt={item.PRD_DESCRIPCION}
                                        fill
                                        className="rounded object-fit-cover"
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 small fw-bold">{item.PRD_DESCRIPCION}</h6>
                                    <p className="mb-1 small text-white-50">{item.PRD_DESCRIPCION}</p>
                                    <p className="mb-0 small fw-bold">Cantidad: {item.quantity}</p>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-2">
                                    <button
                                        onClick={() => removeFromCart(item.PRD_CODIGO)}
                                        className="btn btn-danger btn-sm rounded-pill px-2 py-1"
                                        style={{ fontSize: '0.75rem' }}
                                    >
                                        Eliminar producto
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold m-0">Total:</h4>
                        <h4 className="fw-bold m-0">${total.toFixed(2)}</h4>
                    </div>
                    <button
                        className="btn btn-dark w-100 py-3 fw-bold rounded-3"
                        onClick={() => setShowCheckout(true)}
                        disabled={cart.length === 0}
                    >
                        Pagar
                    </button>
                </div>
            </div>

            <CheckoutModal
                isOpen={showCheckout}
                onClose={() => setShowCheckout(false)}
                total={total}
            />
        </>
    );
}
