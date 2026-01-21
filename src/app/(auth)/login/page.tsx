'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from "@/components/ui/input";
import styles from './login.module.css';
import { loginAction } from '@/service/authDP';
import { useAuth } from "@/context/auth-context";
import Logo from '../../../../public/img/logoConLetras.png';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [userType, setUserType] = useState<'client' | 'employee'>('client');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginAction(username, password, userType);

      if (result.success && result.user) {
        login({
          ...result.user,
          role: userType
        });
        if (userType === 'client') {
          router.push('/productos');
        } else {
          router.push('/');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.overlay}></div>

      <div className={styles.loginCard}>
        <div className={styles.leftPanel}>
          <div className="mb-4">
            <Image src={Logo} alt="Logo" height={60} className={styles.logoImage} />
          </div>

          <h2 className="mb-4 fw-bold">Iniciar sesión</h2>

          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleBtn} ${userType === 'client' ? styles.active : ''}`}
              onClick={() => setUserType('client')}
              type="button"
            >
              Soy cliente
            </button>
            <button
              className={`${styles.toggleBtn} ${userType === 'employee' ? styles.active : ''}`}
              onClick={() => setUserType('employee')}
              type="button"
            >
              Soy empleado
            </button>
          </div>

          <form onSubmit={handleLogin} className="w-100">
            <Input
              label="Usuario"
              placeholder="Ingrese su usuario..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              labelClassName="text-light"
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingrese su contraseña..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className="alert alert-danger py-2 mt-3 text-center small">{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className={styles.linkText} onClick={() => router.push('/register')}>
            ¿Aún no tienes una cuenta? Da click aquí
          </p>
        </div>

        {/* Right Panel: Image */}
        <div className={styles.rightPanel}>
          <h3 className={styles.rightTitle}>
            Los productos más populares los encuentras en un solo lugar!
          </h3>
          <div className={styles.productImageContainer}>
            {/* Placeholder for the tech image. Since I don't have the file, 
                I will use a standard placeholder or just leave the yellow box. */}
            <div style={{ width: '100%', height: '250px', position: 'relative' }}>
              <Image
                src="/img/logoPrincipal.png"
                alt="Productos Tech"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}