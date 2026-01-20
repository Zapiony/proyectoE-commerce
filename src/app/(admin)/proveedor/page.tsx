'use client';

import { useState, useEffect } from 'react';
import { GenericTable, Column } from '@/components/admin/generic-table';
import { getProveedoresAction, createProveedorAction, updateProveedorAction, deleteProveedorAction } from '@/service/proveedorDP';
import AlertModal from '@/components/ui/alert-modal';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { IProveedor } from '@/types';

export default function ProveedorPage() {
    const [data, setData] = useState<IProveedor[]>([]);
    const [allData, setAllData] = useState<IProveedor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados del modal
    const [alertState, setAlertState] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'info'; message: string; }>({ isOpen: false, type: 'info', message: '' });
    const [confirmState, setConfirmState] = useState<{ isOpen: boolean; item: IProveedor | null; message: string; }>({ isOpen: false, item: null, message: '' });

    // Valores ha obtener de la bdd para los campos de la tabla
    const columns: Column<IProveedor>[] = [
        { header: 'RUC', accessor: 'PRV_RUC' },
        { header: 'RAZÓN SOCIAL', accessor: 'PRV_RAZON_SOCIAL' },
        { header: 'CONTACTO', accessor: 'PRV_NOMBRE' },
        { header: 'CORREO', accessor: 'PRV_CORREO' },
        { header: 'DIRECCIÓN', accessor: 'PRV_DIRECCION' },
        { header: 'TELÉFONO', accessor: 'PRV_TELEFONO' },
    ];

    // Campos para la tabla
    const formFields = [
        { name: 'PRV_RUC', label: 'RUC', required: true },
        { name: 'PRV_RAZON_SOCIAL', label: 'Razón Social', required: true },
        { name: 'PRV_NOMBRE', label: 'Nombre Contacto', required: true },
        { name: 'PRV_CORREO', label: 'Correo', type: 'email' as const, required: true },
        { name: 'PRV_DIRECCION', label: 'Dirección', required: true },
        { name: 'PRV_TELEFONO', label: 'Teléfono', type: 'tel' as const, required: true },
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getProveedoresAction();
                if (result.success && result.data) {
                    setData(result.data);
                    setAllData(result.data);
                }
            } catch (error) {
                console.error("Failed to load proveedores", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSearch = (term: string) => {
        if (!term) {
            setData(allData);
            return;
        }
        const lowerTerm = term.toLowerCase();
        const filtered = allData.filter(item =>
            item.PRV_NOMBRE.toLowerCase().includes(lowerTerm) ||
            item.PRV_RAZON_SOCIAL.toLowerCase().includes(lowerTerm) ||
            item.PRV_RUC.includes(lowerTerm) ||
            (item.PRV_CORREO && item.PRV_CORREO.toLowerCase().includes(lowerTerm))
        );
        setData(filtered);
    };

    const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
        setAlertState({ isOpen: true, type, message });
    };

    const handleSave = async (item: Partial<IProveedor>) => {
        const newItem = item as IProveedor;

        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(newItem.PRV_NOMBRE)) {
            showAlert('error', 'El nombre de contacto no puede contener números.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newItem.PRV_CORREO)) {
            showAlert('error', 'El correo electrónico no es válido.');
            return;
        }

        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(newItem.PRV_TELEFONO)) {
            showAlert('error', 'El teléfono debe contener solo números enteros.');
            return;
        }

        if (!phoneRegex.test(newItem.PRV_RUC)) {
            showAlert('error', 'El RUC debe contener solo números.');
            return;
        }

        const exists = allData.find(d => d.PRV_RUC === newItem.PRV_RUC);

        let result;
        if (exists) {
            result = await updateProveedorAction(newItem);
        } else {
            result = await createProveedorAction(newItem);
        }

        if (result.success) {
            const savedItem = (result as any).data || newItem;

            if (exists) {
                const updateList = (list: IProveedor[]) => list.map(p => p.PRV_RUC === savedItem.PRV_RUC ? savedItem : p);
                setData(prev => updateList(prev));
                setAllData(prev => updateList(prev));
                showAlert('success', 'Proveedor actualizado correctamente');
            } else {
                setData(prev => [...prev, savedItem]);
                setAllData(prev => [...prev, savedItem]);
                showAlert('success', 'Proveedor creado correctamente');
            }
        } else {
            showAlert('error', result.message || 'Error desconocido');
        }

        return Promise.resolve();
    };

    const handleDeleteClick = (item: IProveedor) => {
        setConfirmState({
            isOpen: true,
            item,
            message: `¿Estás seguro de que deseas eliminar al proveedor "${item.PRV_RAZON_SOCIAL}"?`
        });
    };

    const executeDelete = async () => {
        if (!confirmState.item) return;

        const result = await deleteProveedorAction(confirmState.item.PRV_RUC);

        if (result.success) {
            setData(prev => prev.filter(p => p.PRV_RUC !== confirmState.item!.PRV_RUC));
            setAllData(prev => prev.filter(p => p.PRV_RUC !== confirmState.item!.PRV_RUC));
            showAlert('success', 'Proveedor eliminado correctamente');
        } else {
            showAlert('error', result.message || 'Error al eliminar');
        }
        setConfirmState({ ...confirmState, isOpen: false });
    };

    if (isLoading) return <div className="p-5 text-center">Cargando proveedores...</div>;

    return (
        <>
            <GenericTable<IProveedor>
                title="Gestión de Proveedores"
                data={data}
                columns={columns}
                formFields={formFields}
                onSearch={handleSearch}
                onSave={handleSave}
                onDelete={handleDeleteClick}
                idField="PRV_RUC"
                searchPlaceholder="Buscar por nombre, razón social o RUC..."
                entityName="Proveedor"
            />

            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                type={alertState.type}
                message={alertState.message}
            />

            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
                onConfirm={executeDelete}
                message={confirmState.message}
            />
        </>
    );
}
