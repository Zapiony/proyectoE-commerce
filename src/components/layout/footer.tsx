'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faXTwitter, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Logo from '../../../public/img/logoConLetras.png';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          {/* Column 1: Logo and Contact Info */}
          <div className="col-md-4 mb-4">
            <div className="mb-3">
              <Image src={Logo} alt="EZA Logo" height={40} className="mb-2" />
            </div>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <FontAwesomeIcon icon={faPhone} className="me-2" style={{ color: 'var(--highlight)' }} />
                <span>+593 99-999-9999</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" style={{ color: 'var(--highlight)' }} />
                <span>eza@hotmail.com</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FontAwesomeIcon icon={faMapLocationDot} className="me-2" style={{ color: 'var(--highlight)' }} />
                <span>Calle Arizona y 10 de agosto</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Enlaces</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/" className="text-decoration-none text-white hover-highlight">
                  Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/productos" className="text-decoration-none text-white hover-highlight">
                  Productos & servicios
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/encuesta" className="text-decoration-none text-white hover-highlight">
                  Encuesta de satisfacción
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Redes sociales</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none">
                <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: 'var(--highlight)' }} />
              </a>
              <a href="#" className="text-decoration-none">
                <FontAwesomeIcon icon={faXTwitter} size="2x" style={{ color: 'var(--highlight)' }} />
              </a>
              <a href="#" className="text-decoration-none">
                <FontAwesomeIcon icon={faInstagram} size="2x" style={{ color: 'var(--highlight)' }} />
              </a>
              <a href="#" className="text-decoration-none">
                <FontAwesomeIcon icon={faWhatsapp} size="2x" style={{ color: 'var(--highlight)' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="small mb-0 opacity-75 fw-bold">
              @2025 EZA. Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
