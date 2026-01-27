'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Input from "@/components/ui/input";
import styles from './register.module.css';
import { registerAction } from '@/service/authDP';
import Logo from '../../../../public/img/logoConLetras.png';
import AlertModal from '@/components/ui/alert-modal';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        identification: '',
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!formData.terms) {
            setError('Debes aceptar los términos y condiciones');
            return;
        }

        setLoading(true);
        try {
            const res = await registerAction({
                identification: formData.identification,
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (res.success) {
                setShowSuccessModal(true);
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        router.push('/login');
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.overlay}></div>

            <div className={styles.registerCard}>
                {/* Left Panel: Form (In Login it was Left, we keep it consistent) */}
                <div className={styles.leftPanel}>
                    <div className="mb-4 text-center">
                        {/* Logo */}
                        <div style={{ position: 'relative', width: '200px', height: '60px', margin: '0 auto 20px' }}>
                            <Image
                                src={Logo}
                                alt="Logo"
                                fill
                                className="object-fit-contain"
                                style={{ filter: 'brightness(0) invert(1)' }}
                            />
                        </div>
                        <h2 className="fw-bold fs-3">Registrarse</h2>
                    </div>

                    <form onSubmit={handleSubmit} className={`${styles.scrollableForm}`}>
                        <Input
                            label="Cédula / RUC *"
                            type="text"
                            name="identification"
                            placeholder="Ingrese su identificación..."
                            value={formData.identification}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Nombre completo *"
                            type="text"
                            name="name"
                            placeholder="Ingrese su nombre completo..."
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Usuario *"
                            type="text"
                            name="username"
                            placeholder="Ingrese un usuario..."
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Correo Electrónico *"
                            type="email"
                            name="email"
                            placeholder="Ingrese su correo..."
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Contraseña *"
                            type="password"
                            name="password"
                            placeholder="Ingrese una contraseña..."
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Reingrese su contraseña *"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña..."
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <div className="mb-3 form-check text-start">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="terms"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                            />
                            <label className="form-check-label small" htmlFor="terms">Aceptas el uso de términos y condiciones</label>
                        </div>

                        {error && <div className="alert alert-danger py-2 mb-3 text-center small">{error}</div>}

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>

                    <p className={styles.linkText} onClick={() => router.push('/login')}>
                        ¿Ya tienes una cuenta? Da click aquí
                    </p>
                </div>

                {/* Right Panel: Image/Welcome */}
                <div className={styles.rightPanel}>
                    <h3 className="fw-bold mb-3 fs-2 text-dark">Bienvenido a EZA!</h3>
                    <p className="text-secondary mb-4 fs-5">Somos la empresa de distribución #1 de tecnología en el Ecuador</p>
                    <div className={styles.productImageContainer}>
                        <Image
                            src="/img/logoPrincipal.png"
                            alt="Technology"
                            fill
                            className="object-fit-contain"
                        />
                    </div>
                </div>
            </div>

            <AlertModal
                isOpen={showSuccessModal}
                onClose={handleCloseModal}
                title="Registro Exitoso"
                message="¡Usuario creado correctamente! Ahora puedes iniciar sesión con tus credenciales."
                type="success"
            />
        </div>
    );
}
