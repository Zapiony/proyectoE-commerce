'use client';

import React, { useState } from 'react';
import styles from './admin-table.module.css';
import Input from '@/components/ui/input';
import ButtonGeneral from '@/components/ui/buttonGeneral';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
}

export interface FormOption {
    value: string;
    label: string;
}

export interface FormField {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'number' | 'tel' | 'password' | 'select' | 'date';
    required?: boolean;
    min?: string;
    options?: FormOption[];
}

interface GenericTableProps<T> {
    title: string;
    data: T[];
    columns: Column<T>[];
    formFields?: FormField[];
    onSearch: (searchTerm: string) => void;
    onSave?: (item: Partial<T>) => Promise<void | boolean>;
    onDelete?: (item: T) => void;
    onCreate?: () => void;
    customActions?: (item: T) => React.ReactNode;
    searchPlaceholder?: string;
    idField?: keyof T;
}

export function GenericTable<T extends Record<string, any>>({
    title,
    data,
    columns,
    formFields = [],
    onSearch,
    onSave,
    onDelete,
    onCreate,
    customActions,
    searchPlaceholder = "Buscar...",
    idField = 'id' as keyof T
}: GenericTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<T> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSearchClick = () => onSearch(searchTerm);
    const handleClear = () => { setSearchTerm(''); onSearch(''); };

    const openCreateModal = () => {
        setCurrentItem({});
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (item: T) => {
        setCurrentItem({ ...item });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onSave && currentItem) {
            setIsSaving(true);
            try {
                await onSave(currentItem);
                closeModal();
            } catch (error) {
                console.error("Error saving:", error);
                alert("Error al guardar los datos.");
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleInputChange = (name: string, value: string) => {
        setCurrentItem(prev => ({ ...prev!, [name]: value }));
    };

    return (
        <div className={styles.adminContainer}>
            {/* Header & Create Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 fw-bold text-dark m-0">{title}</h1>
                {(onSave || onCreate) && (
                    <ButtonGeneral
                        texto="NUEVO"
                        onClick={onCreate || openCreateModal}
                        className="btn-primary"
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                    </ButtonGeneral>
                )}
            </div>

            {/* Main Card */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    {/* Filters */}
                    <div className="row g-3 mb-4 align-items-center">
                        <div className="col-md-8 m-0">
                            {/* Reusing Input but overriding label color since this is a light page */}
                            <Input
                                label="Búsqueda"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                labelClassName="text-dark"
                                className="bg-white border"
                                style={{ padding: '8px 12px' }}
                            />
                        </div>
                        <div className="col-md-4 d-flex gap-2 m-0">
                            <ButtonGeneral texto="Buscar" onClick={handleSearchClick} className="btn-dark w-100" />
                            <ButtonGeneral texto="Limpiar" onClick={handleClear} className="btn-outline-secondary text-dark w-100 border-secondary" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className="text-secondary text-uppercase small fw-bold text-nowrap text-center">
                                            {col.header}
                                        </th>
                                    ))}
                                    {(onSave || onDelete || customActions) && (
                                        <th className="text-secondary text-uppercase small fw-bold text-center" style={{ width: '1%', whiteSpace: 'nowrap' }}>
                                            ACCIONES
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    data.map((item, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {columns.map((col, colIdx) => (
                                                <td key={colIdx} className="text-center">
                                                    {typeof col.accessor === 'function'
                                                        ? col.accessor(item)
                                                        : (item[col.accessor] as React.ReactNode)}
                                                </td>
                                            ))}
                                            {(onSave || onDelete || customActions) && (
                                                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    {customActions && customActions(item)}
                                                    {onSave && (
                                                        <ButtonGeneral
                                                            texto="EDITAR"
                                                            onClick={() => openEditModal(item)}
                                                            className="btn-warning btn-sm text-dark me-2"
                                                        />
                                                    )}
                                                    {onDelete && (
                                                        <ButtonGeneral
                                                            texto="ELIMINAR"
                                                            onClick={() => onDelete(item)}
                                                            className="btn-danger btn-sm"
                                                        />
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="text-center py-5 text-muted">
                                            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                            No se encontraron resultados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title fw-bold">
                                    {isEditing ? 'Editar Registro' : 'Nuevo Registro'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleFormSubmit}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        {formFields.map((field) => (
                                            <div className="col-12" key={field.name}>
                                                {field.type === 'select' ? (
                                                    <div className="mb-3">
                                                        <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                                                            {field.label} {field.required && <span className="text-danger">*</span>}
                                                        </label>
                                                        <select
                                                            className="form-select bg-white border"
                                                            required={field.required}
                                                            value={(currentItem as any)?.[field.name] || ''}
                                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                            disabled={(field.name === idField as string) && isEditing}
                                                            style={{ borderRadius: '8px', padding: '10px 15px', fontSize: '0.9rem' }}
                                                        >
                                                            <option value="">Seleccione una opción</option>
                                                            {field.options?.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <Input
                                                        label={field.label}
                                                        type={field.type || 'text'}
                                                        required={field.required}
                                                        min={field.min}
                                                        value={(currentItem as any)?.[field.name] || ''}
                                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                        disabled={(field.name === idField as string) && isEditing}
                                                        labelClassName="text-dark"
                                                        className="bg-white border"
                                                        onClick={(e) => field.type === 'date' && e.currentTarget.showPicker()}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <ButtonGeneral texto="Cancelar" type="button" onClick={closeModal} className="btn-secondary text-white" />
                                    <ButtonGeneral
                                        texto={isSaving ? 'Guardando...' : 'Guardar Datos'}
                                        type="submit"
                                        disabled={isSaving}
                                        className="btn-warning text-dark"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
