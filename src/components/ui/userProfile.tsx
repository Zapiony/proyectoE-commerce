'use client';

import { useState, useEffect } from 'react';
import { getClientDetails } from '@/service/clienteDP';

interface UserProfileMenuProps {
    user: any;
    onLogout: () => void;
}

export default function UserProfileMenu({ user, onLogout }: UserProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getClientDetails(token).then(data => {
                if (data) {
                    setUserInfo(data);
                }
            });
        }
    }, [user]);

    const displayName = userInfo?.CLI_NOMBRE || user?.name || user?.username || "Usuario";
    const displayEmail = userInfo?.CLI_CORREO || user?.email || "correo@ejemplo.com";

    return (
        <div className="position-relative d-inline-block">
            {/* Trigger Button */}
            <button
                onClick={toggleMenu}
                className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 border-0"
                style={{ outline: 'none', boxShadow: 'none' }}
            >
                {/* Small Avatar on Navbar */}
                <div
                    className="rounded-circle overflow-hidden border border-2 border-white d-flex align-items-center justify-content-center bg-secondary"
                    style={{ width: '40px', height: '40px' }}
                >
                    <i className="fa-solid fa-user text-white fs-5"></i>
                </div>
                <i className={`fa-solid fa-caret-down text-white small ${isOpen ? 'fa-rotate-180' : ''}`} style={{ transition: 'transform 0.2s' }}></i>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Invisible Backdrop to close on click outside */}
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ zIndex: 1050, cursor: 'default' }}
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Card Content */}
                    <div
                        className="position-absolute end-0 mt-3 bg-white rounded-3 shadow-lg overflow-hidden animate__animated animate__fadeIn"
                        style={{ width: '320px', zIndex: 1051, top: '100%', right: '0' }}
                    >
                        {/* Header Section */}
                        <div className="p-4 text-center border-bottom">
                            {/* Big Avatar */}
                            <div
                                className="rounded-circle overflow-hidden border border-3 border-light mx-auto mb-3 d-flex align-items-center justify-content-center bg-light"
                                style={{ width: '90px', height: '90px' }}
                            >
                                <i className="fa-solid fa-user text-secondary" style={{ fontSize: '3rem' }}></i>
                            </div>

                            {/* Name */}
                            <h6 className="fw-bold text-dark text-uppercase px-2" style={{ letterSpacing: '0.5px' }}>
                                {displayName}
                            </h6>

                            {/* Email */}
                            <p className="small text-muted px-2 text-break">
                                {displayEmail}
                            </p>
                        </div>

                        {/* Footer / Actions Section */}
                        <div className="bg-light p-2">
                            <button
                                className="btn btn-light w-100 text-start d-flex align-items-center text-white gap-3 py-2 px-3 hover-effect"
                                onClick={() => { onLogout(); setIsOpen(false); }}
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                <span className="small">Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Simple inline styles for hover effect */}
            <style jsx>{`
                .hover-effect:hover {
                    background-color: #e9ecef;
                }
            `}</style>
        </div>
    );
}
