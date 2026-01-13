'use client';

import React from 'react';
import ButtonGeneral from './buttonGeneral';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'info';
}

const AlertModal = ({ isOpen, onClose, title, message, type = 'info' }: AlertModalProps) => {
    if (!isOpen) return null;

    const getHeaderColor = () => {
        switch (type) {
            case 'success': return 'bg-success';
            case 'error': return 'bg-danger';
            default: return 'bg-primary';
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content border-0 shadow-lg overflow-hidden">
                    <div className={`modal-header ${getHeaderColor()} text-white py-2`}>
                        <h6 className="modal-title fw-bold">{title || (type === 'error' ? 'Error' : 'Información')}</h6>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center py-4 text-body">
                        {type === 'success' && <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>}
                        {type === 'error' && <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>}
                        <p className="mb-0 fw-medium text-body">{message}</p>
                    </div>
                    <div className="modal-footer justify-content-center bg-light py-2">
                        <ButtonGeneral texto="Aceptar" onClick={onClose} className={`btn-sm ${type === 'error' ? 'btn-danger' : 'btn-primary'}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
