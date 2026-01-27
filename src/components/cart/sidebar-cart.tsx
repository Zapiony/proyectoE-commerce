'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CheckoutModal from './checkout-modal';
import ConfirmationModal from '@/components/ui/confirmation-modal';

export default function SidebarCart() {
    const { isCartOpen, toggleCart, cart, removeFromCart, addToCart, total } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const router = useRouter();

    const handleDeleteClick = (productId: string) => {
        setProductToDelete(productId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            removeFromCart(productToDelete);
            setProductToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const cancelDelete = () => {
        setProductToDelete(null);
        setShowDeleteConfirm(false);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`position-fixed top-0 start-0 w-100 h-100 bg-dark ${isCartOpen ? 'opacity-50' : 'opacity-0'}`}
                style={{
                    zIndex: 1040,
                    transition: 'opacity 0.3s ease-in-out',
                    pointerEvents: isCartOpen ? 'auto' : 'none'
                }}
                onClick={toggleCart}
            ></div>

            {/* Sidebar */}
            <div
                className="position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
                style={{
                    width: '400px',
                    zIndex: 1050,
                    transition: 'transform 0.3s ease-in-out',
                    transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)'
                }}
            >
                <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                    <h5 className="fw-bold m-0 text-dark">Tu Carrito <span className="text-muted small">({cart.length})</span></h5>
                    <button onClick={toggleCart} className="btn btn-light rounded-circle btn-sm shadow-sm" aria-label="Cerrar">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="flex-grow-1 overflow-auto p-4">
                    {cart.length === 0 ? (
                        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                            <i className="fa-solid fa-cart-shopping fa-3x mb-3 text-secondary opacity-25"></i>
                            <p className="fw-medium">Tu carrito está vacío.</p>
                            <button onClick={toggleCart} className="btn btn-link text-decoration-none">Empezar a comprar</button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.PRD_CODIGO} className="d-flex mb-4 p-3 bg-white rounded shadow-sm border position-relative">
                                <div className="me-3 flex-shrink-0 position-relative rounded overflow-hidden" style={{ width: '80px', height: '80px' }}>
                                    <Image
                                        src="/img/logoPrincipal.png"
                                        alt={item.PRD_DESCRIPCION}
                                        fill
                                        className="object-fit-cover"
                                    />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <h6 className="mb-0 small fw-bold text-dark text-truncate" style={{ maxWidth: '160px' }}>{item.PRD_DESCRIPCION}</h6>
                                        <button
                                            onClick={() => handleDeleteClick(item.PRD_CODIGO)}
                                            className="btn btn-link text-danger p-1 bg-transparent ms-2"
                                            title="Eliminar producto"
                                            style={{ lineHeight: 1 }}
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                    <p className="mb-2 small text-muted">Precio c/u: ${item.PRD_PRECIO.toFixed(2)}</p>

                                    <div className="d-flex align-items-center justify-content-between">
                                        <strong>Cantidad:</strong>
                                        <div className="d-flex align-items-center bg-light rounded px-2 py-1">
                                            <button
                                                onClick={() => item.quantity > 1 && addToCart(item, -1)}
                                                className={`btn btn-sm btn-link text-decoration-none p-0 ${item.quantity <= 1 ? 'opacity-25' : ''}`}
                                                disabled={item.quantity <= 1}
                                                style={{ width: '20px' }}
                                            >
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                            <span className="mx-2 small fw-bold user-select-none" style={{ minWidth: '15px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => addToCart(item, 1)}
                                                className={`btn btn-sm btn-link text-decoration-none p-0 ${item.quantity >= (item.DET_BOD_CANTIDAD || 9999) ? 'opacity-25' : ''}`}
                                                disabled={item.quantity >= (item.DET_BOD_CANTIDAD || 9999)}
                                                style={{ width: '20px' }}
                                            >
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                        <span className="small fw-bold text-dark">
                                            ${(item.PRD_PRECIO * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-top bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted fw-medium">Total</span>
                        <h4 className="fw-bold m-0 text-dark">${total.toFixed(2)}</h4>
                    </div>
                    <button
                        className="btn btn-dark w-100 py-3 fw-bold rounded-3 shadow-sm"
                        onClick={() => setShowCheckout(true)}
                        disabled={cart.length === 0}
                    >
                        Pagar ahora
                    </button>
                </div>
            </div>

            <CheckoutModal
                isOpen={showCheckout}
                onClose={() => setShowCheckout(false)}
                total={total}
            />

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Confirmar eliminación"
                message="¿Estás seguro de que deseas eliminar este producto del carrito?"
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
        </>
    );
}
