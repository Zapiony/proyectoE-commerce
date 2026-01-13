'use client';

import React from 'react';
import ButtonGeneral from './buttonGeneral';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmación',
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-warning text-dark border-0">
                        <h5 className="modal-title fw-bold"><i className="bi bi-exclamation-circle-fill me-2"></i>{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body py-4">
                        <p className="mb-0 fs-5 text-center text-body" style={{ color: "black" }}>{message}</p>
                    </div>
                    <div className="modal-footer bg-light justify-content-center">
                        <ButtonGeneral texto={cancelText} onClick={onClose} className="btn-secondary text-white me-2" />
                        <ButtonGeneral texto={confirmText} onClick={onConfirm} className="btn-danger" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
