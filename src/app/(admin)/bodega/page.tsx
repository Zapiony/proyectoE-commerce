'use client';

import { useState, useEffect } from 'react';
import { GenericTable, Column } from '@/components/admin/generic-table';
import { getBodegasAction, createBodegaAction, updateBodegaAction, deleteBodegaAction } from '@/service/bodegaDP';
import AlertModal from '@/components/ui/alert-modal';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { IBodega } from '@/types';

export default function BodegaPage() {
    const [data, setData] = useState<IBodega[]>([]);
    const [allData, setAllData] = useState<IBodega[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados del modal
    const [alertState, setAlertState] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'info'; message: string; }>({ isOpen: false, type: 'info', message: '' });
    const [confirmState, setConfirmState] = useState<{ isOpen: boolean; item: IBodega | null; message: string; }>({ isOpen: false, item: null, message: '' });

    // Valores ha obtener de la bdd para los campos de la tabla
    const columns: Column<IBodega>[] = [
        { header: 'CÓDIGO', accessor: 'BOD_CODIGO' },
        { header: 'DESCRIPCIÓN', accessor: 'BOD_DESCRIPCION' },
        { header: 'DIRECCIÓN', accessor: 'BOD_DIRECCION' },
        { header: 'ENCARGADO', accessor: 'BOD_NOMBRE_ENCARGADO' },
        { header: 'TELÉFONO', accessor: 'BOD_TELEFONO_ENCARGADO' },
    ];

    // Campos para la tabla
    const formFields = [
        { name: 'BOD_CODIGO', label: 'Código', required: true },
        { name: 'BOD_DESCRIPCION', label: 'Descripción', required: true },
        { name: 'BOD_DIRECCION', label: 'Dirección', required: true },
        { name: 'BOD_NOMBRE_ENCARGADO', label: 'Nombre Encargado', required: true },
        { name: 'BOD_TELEFONO_ENCARGADO', label: 'Teléfono Encargado', type: 'tel' as const, required: true },
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getBodegasAction();
                if (result.success && result.data) {
                    setData(result.data);
                    setAllData(result.data);
                }
            } catch (error) {
                console.error("Failed to load bodegas", error);
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
            item.BOD_DESCRIPCION.toLowerCase().includes(lowerTerm) ||
            item.BOD_NOMBRE_ENCARGADO.toLowerCase().includes(lowerTerm) ||
            item.BOD_CODIGO.toLowerCase().includes(lowerTerm)
        );
        setData(filtered);
    };

    const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
        setAlertState({ isOpen: true, type, message });
    };

    const handleSave = async (item: Partial<IBodega>) => {
        const newItem = item as IBodega;

        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(newItem.BOD_NOMBRE_ENCARGADO)) {
            showAlert('error', 'El nombre del encargado no puede contener números.');
            return;
        }

        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(newItem.BOD_TELEFONO_ENCARGADO)) {
            showAlert('error', 'El teléfono del encargado debe contener solo números enteros.');
            return;
        }

        const exists = allData.find(d => d.BOD_CODIGO === newItem.BOD_CODIGO);

        let result;
        if (exists) {
            result = await updateBodegaAction(newItem);
        } else {
            result = await createBodegaAction(newItem);
        }

        if (result.success) {
            const savedItem = (result as any).data || newItem;

            if (exists) {
                const updateList = (list: IBodega[]) => list.map(p => p.BOD_CODIGO === savedItem.BOD_CODIGO ? savedItem : p);
                setData(prev => updateList(prev));
                setAllData(prev => updateList(prev));
                showAlert('success', 'Bodega actualizada correctamente');
            } else {
                setData(prev => [...prev, savedItem]);
                setAllData(prev => [...prev, savedItem]);
                showAlert('success', 'Bodega creada correctamente');
            }
        } else {
            showAlert('error', result.message || 'Error desconocido');
        }

        return Promise.resolve();
    };

    const handleDeleteClick = (item: IBodega) => {
        setConfirmState({
            isOpen: true,
            item,
            message: `¿Estás seguro de que deseas eliminar la bodega "${item.BOD_DESCRIPCION}"?`
        });
    };

    const executeDelete = async () => {
        if (!confirmState.item) return;

        const result = await deleteBodegaAction(confirmState.item.BOD_CODIGO);

        if (result.success) {
            setData(prev => prev.filter(p => p.BOD_CODIGO !== confirmState.item!.BOD_CODIGO));
            setAllData(prev => prev.filter(p => p.BOD_CODIGO !== confirmState.item!.BOD_CODIGO));
            showAlert('success', 'Bodega eliminada correctamente');
        } else {
            showAlert('error', result.message || 'Error al eliminar');
        }
        setConfirmState({ ...confirmState, isOpen: false });
    };

    if (isLoading) return <div className="p-5 text-center">Cargando bodegas...</div>;

    return (
        <>
            <GenericTable<IBodega>
                title="Gestión de Bodegas"
                data={data}
                columns={columns}
                formFields={formFields}
                onSearch={handleSearch}
                onSave={handleSave}
                onDelete={handleDeleteClick}
                idField="BOD_CODIGO"
                searchPlaceholder="Buscar por descripción, encargado o código..."
                entityName="Bodega"
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
