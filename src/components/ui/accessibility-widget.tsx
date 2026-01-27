'use client';

import { useState, useEffect } from 'react';
import ButtonGeneral from './buttonGeneral';

export default function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);
    const [grayscale, setGrayscale] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        // Setting font-size percentage on HTML scales rem units
        // Default is usually 16px (100%). 110% = 17.6px, etc.
        html.style.fontSize = `${fontSize}%`;

        // Handle Classes
        if (highContrast) {
            html.classList.add('high-contrast');
        } else {
            html.classList.remove('high-contrast');
        }

        if (grayscale) {
            html.classList.add('grayscale-mode');
        } else {
            html.classList.remove('grayscale-mode');
        }

    }, [fontSize, highContrast, grayscale]);

    return (
        <div className="position-fixed bottom-0 start-0 p-3" style={{ zIndex: 1080 }}>
            {isOpen && (
                <div className="bg-white p-3 rounded-3 shadow-lg mb-2 border animate__animated animate__fadeInUp" style={{ width: '280px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold m-0 text-dark"><i className="fa-solid fa-universal-access me-2"></i>Accesibilidad</h6>
                        <button className="btn-close btn-sm" onClick={() => setIsOpen(false)}></button>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small text-muted fw-bold">Tamaño de letra</label>
                        <div className="d-flex gap-2 bg-light p-1 rounded">
                            <ButtonGeneral className="btn-sm btn-white border flex-fill fw-bold text-dark" onClick={() => setFontSize(Math.max(80, fontSize - 10))} title="Disminuir" texto="A-" />
                            <ButtonGeneral className="btn-sm btn-white border flex-fill small" onClick={() => setFontSize(100)} title="Restablecer" texto="100%" />
                            <ButtonGeneral className="btn-sm btn-white border flex-fill fw-bold text-dark" onClick={() => setFontSize(Math.min(130, fontSize + 10))} title="Aumentar" texto="A+" />
                        </div>
                    </div>

                    <div className="mb-2 form-check form-switch p-0 d-flex justify-content-between align-items-center custom-switch">
                        <label className="form-check-label small text-dark" htmlFor="hc-switch">Alto Contraste</label>
                        <input
                            className="form-check-input m-0"
                            type="checkbox"
                            id="hc-switch"
                            checked={highContrast}
                            onChange={(e) => setHighContrast(e.target.checked)}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>

                    <div className="mb-0 form-check form-switch p-0 d-flex justify-content-between align-items-center custom-switch">
                        <label className="form-check-label small text-dark" htmlFor="gs-switch">Escala de Grises</label>
                        <input
                            className="form-check-input m-0"
                            type="checkbox"
                            id="gs-switch"
                            checked={grayscale}
                            onChange={(e) => setGrayscale(e.target.checked)}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </div>
            )}
            <button
                className="bg-dark btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center border-2 border-white"
                style={{ width: '50px', height: '50px' }}
                onClick={() => setIsOpen(!isOpen)}
                title="Herramientas de Accesibilidad"
            >
                <i className="fa-solid fa-person-circle-exclamation fs-4"></i>
            </button>
        </div>
    )
}
