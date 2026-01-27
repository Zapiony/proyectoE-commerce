'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '../../../public/img/logoConLetras.png'
import Boton from '../ui/buttonGeneral';
import { useAuth } from '@/context/auth-context';
import UserProfileMenu from '../ui/userProfile';

const Navbar = () => {
    const router = useRouter();
    const { role, logout, user } = useAuth();

    const isLogged = role !== 'guest';

    const getLinks = (role: string) => {
        switch (role) {
            case 'admin':
                return [
                    { name: 'DASHBOARD', href: '/dashboard' },
                    { name: 'CLIENTES', href: '/usuario' },
                    { name: 'BODEGAS', href: '/bodega' },
                    { name: 'PROVEEDORES', href: '/proveedor' },
                    { name: 'PRODUCTOS', href: '/productosAdmin' },
                    { name: 'ORDEN DE COMPRA', href: '/ordenes' },
                    { name: 'FACTURAS', href: '/facturas' },
                ];
            case 'ROL_BODEGUERO':
                return [
                    { name: 'BODEGAS', href: '/bodega' },
                    { name: 'PRODUCTOS', href: '/productosAdmin' },
                ];
            case 'ROL_VENTAS':
                return [
                    { name: 'CLIENTES', href: '/usuario' },
                    { name: 'FACTURAS', href: '/facturas' },
                    { name: 'PRODUCTOS', href: '/productosAdmin' },
                ];
            case 'ROL_COMPRAS':
                return [
                    { name: 'PROVEEDORES', href: '/proveedor' },
                    { name: 'ORDEN DE COMPRA', href: '/ordenes' },
                    { name: 'PRODUCTOS', href: '/productosAdmin' },
                ];
            case 'ROL_MARKETING':
                return [
                    { name: 'DASHBOARD', href: '/dashboard' },
                    { name: 'CLIENTES', href: '/usuario' },
                    { name: 'FACTURAS', href: '/facturas' },
                    { name: 'PRODUCTOS', href: '/productosAdmin' },
                ];
            case 'client':
            default:
                return [
                    { name: 'INICIO', href: '/' },
                    { name: 'PRODUCTOS', href: '/productos' },
                    { name: 'ENCUESTA DE SATISFACCIÓN', href: '/encuesta' },
                ];
        }
    };

    const links = getLinks(role);

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">

                {/* 1. LOGO */}
                <Link href="/" className="navbar-brand d-flex align-items-center">
                    <Image src={Logo} alt="Logo de la empresa" loading="eager" height={40} />
                </Link>

                {/* Botón Hamburguesa (Móvil) -> Abre Offcanvas */}
                <button
                    className="navbar-toggler border-white"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileMenu"
                    aria-controls="mobileMenu"
                >
                    <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
                </button>

                {/* 2. MENU ESCRITORIO (Horizontal) */}
                <div className="collapse navbar-collapse d-none d-lg-block" id="desktopMenu">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-5 align-items-center">
                        {links.map((link) => (
                            <li key={link.name} className="nav-item mx-2">
                                <Link href={link.href} className={`nav-link fw-bold`}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        {!isLogged ? (
                            <Boton texto="Iniciar sesión" onClick={() => router.push('/login')} />
                        ) : (
                            <UserProfileMenu user={user} onLogout={logout} />
                        )}
                    </div>
                </div>

                {/* 3. SIDEBAR MOVIL (Offcanvas) */}
                <div className="offcanvas offcanvas-end bg-dark d-lg-none" tabIndex={-1} id="mobileMenu" aria-labelledby="mobileMenuLabel">
                    <div className="offcanvas-header border-bottom border-secondary">
                        <h5 className="offcanvas-title fw-bold text-white" id="mobileMenuLabel">MENU</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body d-flex flex-column">
                        <ul className="navbar-nav gap-3 mb-auto">
                            {links.map((link) => (
                                <li key={link.name} className="nav-item">
                                    <Link href={link.href} className="nav-link text-white fw-bold fs-5 border-bottom border-secondary py-2">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="d-flex flex-column gap-3 mt-4 pb-3">
                            {!isLogged ? (
                                <Boton texto="Iniciar sesión" className="w-100" onClick={() => router.push('/login')} />
                            ) : (
                                <div className="d-flex justify-content-center">
                                    <UserProfileMenu user={user} onLogout={logout} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;