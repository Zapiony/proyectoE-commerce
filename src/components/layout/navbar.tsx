'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '../../../public/img/logoConLetras.png'
import Boton from '../ui/buttonGeneral';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '@/context/auth-context';

const Navbar = () => {
    const router = useRouter();
    const { role, logout, user } = useAuth();

    const isLogged = role !== 'guest';

    const links = role === 'employee'
        ? [
            { name: 'CLIENTES', href: '/usuario', active: true },
            { name: 'BODEGAS', href: '/bodega', active:
                 true },
            { name: 'PROVEEDORES', href: '/proveedor', active: true },
            { name: 'PRODUCTOS', href: '/productosAdmin', active: false },
            { name: 'ORDEN DE COMPRA', href: '/ordenes', active: false },
        ]
        : [
            { name: 'INICIO', href: '/', active: true },
            { name: 'PRODUCTOS', href: '/productos', active: false },
            { name: 'ENCUESTA DE SATISFACCIÓN', href: '/encuesta', active: false },
        ];

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">

                {/* 1. LOGO */}
                <Link href="/" className="navbar-brand d-flex align-items-center">
                    <Image src={Logo} alt="Logo de la empresa" height={40} />
                </Link>

                {/* Botón Hamburguesa (Móvil) */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Contenido Colapsable */}
                <div className="collapse navbar-collapse" id="navbarContent">

                    {/* 2. ENLACES CENTRALES */}
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-5">
                        {links.map((link) => (
                            <li key={link.name} className="nav-item mx-2">
                                <Link href={link.href} className={`nav-link fw-bold`}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* 3. LADO DERECHO (Acciones) */}
                    <div className="d-flex align-items-center gap-3">

                        {!isLogged ? (
                            <Boton texto="Iniciar sesión" onClick={() => router.push('/login')} />
                        ) : (
                            <>
                                <span className="text-white small me-2">Hola, {user?.name || 'Usuario'}</span>
                                {/* Icono Usuario */}
                                <button className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-person-circle fs-4"></i>
                                </button>
                                <button onClick={logout} className="btn btn-outline-light btn-sm ms-2">
                                    Salir
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;