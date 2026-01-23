'use client';

import { useState, useEffect } from 'react';
import { GenericTable, Column } from '@/components/admin/generic-table';
import { getFacturas, anularFactura } from '@/service/facturaDP';
import AlertModal from '@/components/ui/alert-modal';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { IFactura } from "@/service/facturaDP";
import ButtonGeneral from '@/components/ui/buttonGeneral';

export default function FacturasPage() {
    const [data, setData] = useState<IFactura[]>([]);
    const [allData, setAllData] = useState<IFactura[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados del modal
    const [alertState, setAlertState] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'info'; message: string; }>({ isOpen: false, type: 'info', message: '' });
    const [confirmState, setConfirmState] = useState<{ isOpen: boolean; item: IFactura | null; message: string; }>({ isOpen: false, item: null, message: '' });

    // Columnas de la tabla
    const columns: Column<IFactura>[] = [
        { header: 'CÓDIGO', accessor: 'FAC_CODIGO' },
        { header: 'CLIENTE', accessor: 'CLI_CEDULA_RUC' },
        { header: 'FECHA', accessor: (item) => new Date(item.FAC_FECHA).toLocaleDateString() },
        { header: 'MÉTODO PAGO', accessor: 'FAC_METODO_PAGO' },
        { header: 'SUBTOTAL', accessor: (item) => `$${Number(item.FAC_SUBTOTAL).toFixed(2)}` },
        { header: 'IVA', accessor: (item) => `$${Number(item.FAC_IVA).toFixed(2)}` },
        { header: 'TOTAL', accessor: (item) => `$${Number(item.FAC_MONTO_TOTAL).toFixed(2)}` },
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getFacturas();
                if (result.success && result.data) {
                    setData(result.data);
                    setAllData(result.data);
                }
            } catch (error) {
                console.error("Failed to load facturas", error);
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
            item.CLI_CEDULA_RUC.includes(lowerTerm) ||
            item.FAC_CODIGO.toString().includes(lowerTerm) ||
            item.FAC_METODO_PAGO.toLowerCase().includes(lowerTerm)
        );
        setData(filtered);
    };

    const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
        setAlertState({ isOpen: true, type, message });
    };

    const handleAnularClick = (item: IFactura) => {
        setConfirmState({
            isOpen: true,
            item,
            message: `¿Estás seguro de que deseas anular la factura #${item.FAC_CODIGO}? Esta acción no se puede deshacer.`
        });
    };

    const executeAnular = async () => {
        if (!confirmState.item) return;

        // SIMULATION: Do not call backend for now
        // const result = await anularFacturaAction(confirmState.item.FAC_CODIGO);
        const result = { success: true, message: '' };

        if (result.success) {
            setData(prev => prev.filter(f => f.FAC_CODIGO !== confirmState.item!.FAC_CODIGO));
            setAllData(prev => prev.filter(f => f.FAC_CODIGO !== confirmState.item!.FAC_CODIGO));
            showAlert('success', 'Factura anulada correctamente');
        } else {
            showAlert('error', result.message || 'Error al anular');
        }
        setConfirmState({ ...confirmState, isOpen: false });
    };

    if (isLoading) return <div className="p-5 text-center">Cargando facturas...</div>;

    return (
        <>
            <GenericTable<IFactura>
                title="Gestión de Facturas"
                data={data}
                columns={columns}
                formFields={[]} // No creation/edition
                onSearch={handleSearch}
                // No onSave or props that imply editing/creating
                customActions={(item) => (
                    <ButtonGeneral
                        texto="ANULAR"
                        onClick={() => handleAnularClick(item)}
                        className="btn-danger btn-sm"
                    />
                )}
                idField="FAC_CODIGO"
                searchPlaceholder="Buscar por cliente, código..."
                entityName="Factura"
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
                onConfirm={executeAnular}
                message={confirmState.message}
            />
        </>
    );
}
