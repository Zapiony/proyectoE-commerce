'use client';

import { useState, useEffect } from 'react';
import { GenericTable, Column } from '@/components/admin/generic-table';
import { getClientesAction, createClientAction, updateClientAction, deleteClientAction } from '@/service/clienteDP';
import AlertModal from '@/components/ui/alert-modal';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { ICliente } from '@/types';

export default function UsuariosPage() {
    const [data, setData] = useState<ICliente[]>([]);
    const [allData, setAllData] = useState<ICliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados del modal
    const [alertState, setAlertState] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'info'; message: string; }>({ isOpen: false, type: 'info', message: '' });
    const [confirmState, setConfirmState] = useState<{ isOpen: boolean; item: ICliente | null; message: string; }>({ isOpen: false, item: null, message: '' });

    // Valores ha obtener de la bdd para los campos de la tabla
    const columns: Column<ICliente>[] = [
        { header: 'IDENTIFICACIÓN / RUC', accessor: 'CLI_CEDULA_RUC' },
        { header: 'NOMBRE', accessor: 'CLI_NOMBRE' },
        { header: 'TELÉFONO', accessor: 'CLI_TELEFONO' },
        { header: 'CORREO', accessor: 'CLI_CORREO' },
    ];

    // Campos para la tabla
    const formFields = [
        { name: 'CLI_CEDULA_RUC', label: 'Cédula / RUC', required: true },
        { name: 'CLI_NOMBRE', label: 'Nombre Completo', required: true },
        { name: 'CLI_TELEFONO', label: 'Teléfono', type: 'tel' as const, required: true },
        { name: 'CLI_CORREO', label: 'Correo Electrónico', type: 'email' as const, required: true },
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getClientesAction();
                if (result.success && result.data) {
                    setData(result.data);
                    setAllData(result.data);
                }
            } catch (error) {
                console.error("Failed to load clients", error);
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
            item.CLI_NOMBRE.toLowerCase().includes(lowerTerm) ||
            item.CLI_CORREO.toLowerCase().includes(lowerTerm) ||
            item.CLI_CEDULA_RUC.includes(lowerTerm)
        );
        setData(filtered);
    };

    const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
        setAlertState({ isOpen: true, type, message });
    };

    const handleSave = async (item: Partial<ICliente>) => {
        const newItem = item as ICliente;

        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(newItem.CLI_NOMBRE)) {
            showAlert('error', 'El nombre no puede contener números.');
            return;
        }

        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(newItem.CLI_TELEFONO)) {
            showAlert('error', 'El teléfono debe contener solo números enteros.');
            return;
        }

        if (!phoneRegex.test(newItem.CLI_CEDULA_RUC)) {
            showAlert('error', 'La Cédula/RUC debe contener solo números.');
            return;
        }

        const exists = allData.find(d => d.CLI_CEDULA_RUC === newItem.CLI_CEDULA_RUC);

        let result;
        if (exists) {
            result = await updateClientAction(newItem);
        } else {
            result = await createClientAction(newItem);
        }

        if (result.success) {
            const savedItem = (result as any).data || newItem;

            if (exists) {
                const updateList = (list: ICliente[]) => list.map(p => p.CLI_CEDULA_RUC === savedItem.CLI_CEDULA_RUC ? savedItem : p);
                setData(prev => updateList(prev));
                setAllData(prev => updateList(prev));
                showAlert('success', 'Cliente actualizado correctamente');
            } else {
                setData(prev => [...prev, savedItem]);
                setAllData(prev => [...prev, savedItem]);
                showAlert('success', 'Cliente creado correctamente');
            }
        } else {
            showAlert('error', result.message || 'Error desconocido');
        }

        return Promise.resolve();
    };

    const handleDeleteClick = (item: ICliente) => {
        setConfirmState({
            isOpen: true,
            item,
            message: `¿Estás seguro de que deseas eliminar al cliente "${item.CLI_NOMBRE}"?`
        });
    };

    const executeDelete = async () => {
        if (!confirmState.item) return;

        const result = await deleteClientAction(confirmState.item.CLI_CEDULA_RUC);

        if (result.success) {
            setData(prev => prev.filter(p => p.CLI_CEDULA_RUC !== confirmState.item!.CLI_CEDULA_RUC));
            setAllData(prev => prev.filter(p => p.CLI_CEDULA_RUC !== confirmState.item!.CLI_CEDULA_RUC));
            showAlert('success', 'Cliente eliminado correctamente');
        } else {
            showAlert('error', result.message || 'Error al eliminar');
        }
        setConfirmState({ ...confirmState, isOpen: false });
    };

    if (isLoading) return <div className="p-5 text-center">Cargando clientes...</div>;

    return (
        <>
            <GenericTable<ICliente>
                title="Gestión de Clientes"
                data={data}
                columns={columns}
                formFields={formFields}
                onSearch={handleSearch}
                onSave={handleSave}
                onDelete={handleDeleteClick}
                idField="CLI_CEDULA_RUC"
                searchPlaceholder="Buscar por nombre, correo o cédula..."
                entityName="Cliente"
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
