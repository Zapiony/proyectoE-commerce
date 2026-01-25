'use client';

import { useState, useEffect } from 'react';
import { GenericTable, Column } from '@/components/admin/generic-table';
import { getOrdenes, createOrden, recibirPedido, deleteOrden } from '@/service/ordenDP';
import { getSuppliers } from '@/service/proveedorDP';
import { getProducts } from '@/service/productoDP';
import AlertModal from '@/components/ui/alert-modal';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import ButtonGeneral from '@/components/ui/buttonGeneral';
import Input from '@/components/ui/input';
import { IDetalleOrdenCompra } from "@/service/ordenDP";
import { IOrdenCompra } from "@/service/ordenDP";
import { IProducto } from "@/service/productoDP";
import { IProveedor } from "@/service/proveedorDP";

export default function OrdenesPage() {
    const [data, setData] = useState<IOrdenCompra[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [alertState, setAlertState] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'info'; message: string; }>({ isOpen: false, type: 'info', message: '' });
    const [confirmState, setConfirmState] = useState<{ isOpen: boolean; title: string; message: string; action: 'DELETE' | 'RECEIVE' | null; targetId: number | null }>({
        isOpen: false, title: '', message: '', action: null, targetId: null
    });

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [proveedores, setProveedores] = useState<IProveedor[]>([]);
    const [productos, setProductos] = useState<IProducto[]>([]);

    const [newOrder, setNewOrder] = useState<Partial<IOrdenCompra>>({ PRV_RUC: '', ORD_FECHA_ENTREGA: '' });
    const [orderItems, setOrderItems] = useState<Partial<IDetalleOrdenCompra>[]>([]);

    const [currentItem, setCurrentItem] = useState<{ prdCode: string; qty: number }>({ prdCode: '', qty: 1 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token') || undefined;
        const [ordenesRes, provRes, prodRes] = await Promise.all([
            getOrdenes(token),
            getSuppliers(token),
            getProducts()
        ]);

        if (ordenesRes.success) setData(ordenesRes.data as IOrdenCompra[]);
        if (provRes.success) setProveedores(provRes.data as IProveedor[]);
        if (prodRes.success) setProductos(prodRes.data as IProducto[]);

        setIsLoading(false);
    };

    const handleSearch = (term: string) => {
    };

    const handleCreateOrder = async () => {
        if (!newOrder.PRV_RUC || !newOrder.ORD_FECHA_ENTREGA || orderItems.length === 0) {
            setAlertState({ isOpen: true, type: 'error', message: 'Complete todos los campos y agregue productos.' });
            return;
        }

        const details: IDetalleOrdenCompra[] = orderItems.map(item => {
            const prod = productos.find(p => p.PRD_CODIGO === item.PRD_CODIGO);
            return {
                PRD_CODIGO: item.PRD_CODIGO!,
                DET_ORD_COMPRA_CANTIDAD: item.DET_ORD_COMPRA_CANTIDAD!,
                DET_ORD_COMPRA_COSTO_UNITARIO: prod?.PRD_COSTO_ADQUISICION || 0
            };
        });

        const token = localStorage.getItem('token') || undefined;
        const res = await createOrden(newOrder as IOrdenCompra, details, token);
        if (res.success) {
            setAlertState({ isOpen: true, type: 'success', message: res.message! });
            setIsCreateOpen(false);
            setNewOrder({ PRV_RUC: '', ORD_FECHA_ENTREGA: '' });
            setOrderItems([]);
            loadData();
        } else {
            setAlertState({ isOpen: true, type: 'error', message: res.message! });
        }
    };

    const handleReceiveOrder = (orderId: number) => {
        setConfirmState({
            isOpen: true,
            title: 'Confirmar Recepción',
            message: '¿Está seguro de recibir este pedido? Esto actualizará el stock.',
            action: 'RECEIVE',
            targetId: orderId
        });
    };

    const handleDeleteOrder = (order: IOrdenCompra) => {
        setConfirmState({
            isOpen: true,
            title: 'Eliminar Orden',
            message: '¿Está seguro de eliminar esta orden? Se eliminarán también sus detalles.',
            action: 'DELETE',
            targetId: order.ORD_CODIGO!
        });
    };

    const performAction = async () => {
        setConfirmState({ ...confirmState, isOpen: false });

        const token = localStorage.getItem('token') || undefined;

        if (confirmState.action === 'RECEIVE' && confirmState.targetId) {
            const res = await recibirPedido(confirmState.targetId, token);
            if (res.success) {
                setAlertState({ isOpen: true, type: 'success', message: res.message! });
                loadData();
            } else {
                setAlertState({ isOpen: true, type: 'error', message: res.message! });
            }
        } else if (confirmState.action === 'DELETE' && confirmState.targetId) {
            const res = await deleteOrden(confirmState.targetId, token);
            if (res.success) {
                setAlertState({ isOpen: true, type: 'success', message: res.message! });
                loadData();
            } else {
                setAlertState({ isOpen: true, type: 'error', message: res.message! });
            }
        }
    };

    const handleEditOrder = async (item: Partial<IOrdenCompra>) => {
        setAlertState({ isOpen: true, type: 'info', message: 'La edición de órdenes solo permite cambios básicos por ahora.' });
    };

    const columns: Column<IOrdenCompra>[] = [
        { header: '# ORDEN', accessor: 'ORD_CODIGO' },
        { header: 'PROVEEDOR', accessor: 'PRV_NOMBRE' },
        { header: 'FECHA ENTREGA', accessor: (item) => new Date(item.ORD_FECHA_ENTREGA).toLocaleDateString() },
        {
            header: 'ESTADO',
            accessor: (item) => (
                <span className={`badge ${item.ORD_ESTADO === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {item.ORD_ESTADO}
                </span>
            )
        },
    ];

    const addItem = () => {
        if (!currentItem.prdCode || currentItem.qty <= 0) return;
        const prod = productos.find(p => p.PRD_CODIGO === currentItem.prdCode);
        if (!prod) return;

        setOrderItems(prev => [...prev, {
            PRD_CODIGO: currentItem.prdCode,
            DET_ORD_COMPRA_CANTIDAD: currentItem.qty,
            _prodName: prod.PRD_DESCRIPCION,
            _unitCos: prod.PRD_COSTO_ADQUISICION
        }]);
        setCurrentItem({ prdCode: '', qty: 1 });
    };

    const removeItem = (idx: number) => {
        setOrderItems(prev => prev.filter((_, i) => i !== idx));
    };

    const calculateTotal = () => {
        return orderItems.reduce((acc, item) => {
            const prod = productos.find(p => p.PRD_CODIGO === item.PRD_CODIGO);
            return acc + (item.DET_ORD_COMPRA_CANTIDAD || 0) * (prod?.PRD_COSTO_ADQUISICION || 0);
        }, 0);
    };

    return (
        <>

            <GenericTable<IOrdenCompra>
                title="Gestión de Ordenes de Compra"
                data={data}
                columns={columns}
                onSearch={handleSearch}
                onCreate={() => setIsCreateOpen(true)}
                onDelete={handleDeleteOrder}
                onSave={handleEditOrder}
                customActions={(item) => {
                    const today = new Date().toISOString().split('T')[0];
                    const deliveryDate = new Date(item.ORD_FECHA_ENTREGA).toISOString().split('T')[0];
                    const isToday = deliveryDate === today;

                    return (
                        <>
                            {item.ORD_ESTADO === 'EN ESPER' && (
                                <ButtonGeneral
                                    texto="RECIBIR"
                                    className="btn-success btn-sm me-2 text-white"
                                    onClick={() => handleReceiveOrder(item.ORD_CODIGO!)}
                                    disabled={!isToday}
                                />
                            )}
                        </>
                    );
                }}
                idField="ORD_CODIGO"
                // Basic form fields to enable the Edit Modal to at least show something if clicked
                formFields={[
                    { name: 'ORD_CODIGO', label: 'Código', type: 'number', required: true }, // Readonly usually dealt with by disabing in GenericTable if it matches idField
                    { name: 'PRV_RUC', label: 'Proveedor', type: 'select', options: proveedores.map(p => ({ value: p.PRV_RUC, label: p.PRV_NOMBRE })), required: true },
                    { name: 'ORD_FECHA_ENTREGA', label: 'Fecha Entrega', type: 'date', required: true, min: new Date().toISOString().split('T')[0] }
                ]}
                entityName="Orden"
            />



            {/* Custom Create Modal */}
            {isCreateOpen && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title fw-bold">Nueva Orden de Compra</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setIsCreateOpen(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small">PROVEEDOR</label>
                                        <select
                                            className="form-select"
                                            value={newOrder.PRV_RUC}
                                            onChange={e => setNewOrder({ ...newOrder, PRV_RUC: e.target.value })}
                                        >
                                            <option value="">Seleccione Proveedor...</option>
                                            {proveedores.map(p => (
                                                <option key={p.PRV_RUC} value={p.PRV_RUC}>{p.PRV_RAZON_SOCIAL}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <Input
                                            label="Fecha de Entrega"
                                            type="date"
                                            value={newOrder.ORD_FECHA_ENTREGA as string}
                                            onChange={e => setNewOrder({ ...newOrder, ORD_FECHA_ENTREGA: e.target.value })}
                                            onClick={(e) => e.currentTarget.showPicker()}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <h6 className="fw-bold">Productos</h6>
                                        <div className="d-flex gap-3 align-items-end">
                                            <div className="flex-grow-1">
                                                <label className="small text-muted">Producto</label>
                                                <select
                                                    className="form-select"
                                                    value={currentItem.prdCode}
                                                    onChange={e => setCurrentItem({ ...currentItem, prdCode: e.target.value })}
                                                >
                                                    <option value="">Seleccione Producto...</option>
                                                    {productos.map(p => (
                                                        <option key={p.PRD_CODIGO} value={p.PRD_CODIGO}>
                                                            {p.PRD_DESCRIPCION} (${p.PRD_COSTO_ADQUISICION})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div style={{ width: '100px' }}>
                                                <Input
                                                    label="Cant."
                                                    type="number"
                                                    min="1"
                                                    value={currentItem.qty}
                                                    onChange={e => setCurrentItem({ ...currentItem, qty: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <button type="button" className="btn btn-dark" onClick={addItem}>
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    <div className="col-12 mt-3">
                                        <table className="table table-sm table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="text-center">Producto</th>
                                                    <th className="text-center">Costo U.</th>
                                                    <th className="text-center">Cant.</th>
                                                    <th className="text-center">Total</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderItems.map((item, idx) => {
                                                    // @ts-ignore
                                                    const total = item.DET_ORD_COMPRA_CANTIDAD * item._unitCos;
                                                    return (
                                                        <tr key={idx}>
                                                            {/* @ts-ignore */}
                                                            <td>{item._prodName}</td>
                                                            {/* @ts-ignore */}
                                                            <td className="text-end">${item._unitCos}</td>
                                                            <td className="text-center">{item.DET_ORD_COMPRA_CANTIDAD}</td>
                                                            <td className="text-end fw-bold">${total.toFixed(2)}</td>
                                                            <td className="text-center">
                                                                <button onClick={() => removeItem(idx)} className="btn btn-sm btn-dark">
                                                                    <i className="fa-solid fa-minus"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {orderItems.length === 0 && (
                                                    <tr><td colSpan={5} className="text-center text-muted small p-3">No hay productos agregados</td></tr>
                                                )}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan={3} className="text-end fw-bold">TOTAL ESTIMADO:</td>
                                                    <td className="text-end fw-bold fs-5">${calculateTotal().toFixed(2)}</td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <ButtonGeneral texto="Cancelar" onClick={() => setIsCreateOpen(false)} className="btn-secondary" />
                                <ButtonGeneral texto="Confirmar Orden" onClick={handleCreateOrder} className="btn-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                type={alertState.type}
                message={alertState.message}
            />

            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
                onConfirm={performAction}
                title={confirmState.title}
                message={confirmState.message}
            />
        </>
    );
}
