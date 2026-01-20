'use client';

import { useState, useEffect } from 'react';
import { GenericTable, Column, FormOption } from '@/components/admin/generic-table';
import { getProductosAction, createProductoAction, updateProductoAction, deleteProductoAction } from '@/service/productoDP';
import { getCategoriasAction } from '@/service/categoriaDP';
import AlertModal from '@/components/ui/alert-modal';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { IProducto, ICategoria } from '@/types';

export default function ProductosAdminPage() {
  const [data, setData] = useState<IProducto[]>([]);
  const [allData, setAllData] = useState<IProducto[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<FormOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del modal
  const [alertState, setAlertState] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'info'; message: string; }>({ isOpen: false, type: 'info', message: '' });
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; item: IProducto | null; message: string; }>({ isOpen: false, item: null, message: '' });

  // Valores a obtener de la bdd para los campos de la tabla
  const columns: Column<IProducto>[] = [
    { header: 'CÓDIGO', accessor: 'PRD_CODIGO' },
    {
      header: 'CATEGORÍA',
      accessor: (item) => {
        const cat = categorias.find(c => c.CAT_CODIGO === item.CAT_CODIGO);
        return cat ? `${cat.CAT_NOMBRE}` : item.CAT_CODIGO;
      }
    },
    { header: 'DESCRIPCIÓN', accessor: 'PRD_DESCRIPCION' },
    { header: 'PRECIO', accessor: (item) => `$${Number(item.PRD_PRECIO).toFixed(2)}` },
    { header: 'COSTO', accessor: (item) => `$${Number(item.PRD_COSTO_ADQUISICION).toFixed(2)}` },
  ];

  // Campos para la tabla
  const formFields = [
    { name: 'PRD_CODIGO', label: 'Código', required: true },
    {
      name: 'CAT_CODIGO',
      label: 'Categoría',
      type: 'select' as const,
      required: true,
      options: categoryOptions
    },
    { name: 'PRD_DESCRIPCION', label: 'Descripción', required: true },
    { name: 'PRD_PRECIO', label: 'Precio', type: 'number' as const, required: true },
    { name: 'PRD_COSTO_ADQUISICION', label: 'Costo Adquisición', type: 'number' as const, required: true },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Products
        const productsResult = await getProductosAction();
        if (productsResult.success && productsResult.data) {
          setData(productsResult.data);
          setAllData(productsResult.data);
        }

        // Fetch Categories
        const categoriesResult = await getCategoriasAction();
        if (categoriesResult.success && categoriesResult.data) {
          setCategorias(categoriesResult.data);
          // Map categories to FormOptions
          const options = categoriesResult.data.map((c: ICategoria) => ({
            value: c.CAT_CODIGO,
            label: `${c.CAT_NOMBRE} (${c.CAT_CODIGO})`
          }));
          setCategoryOptions(options);
        }

      } catch (error) {
        console.error("Failed to load data", error);
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
      item.PRD_DESCRIPCION.toLowerCase().includes(lowerTerm) ||
      item.PRD_CODIGO.toLowerCase().includes(lowerTerm) ||
      item.CAT_CODIGO.toLowerCase().includes(lowerTerm)
    );
    setData(filtered);
  };

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlertState({ isOpen: true, type, message });
  };

  const handleSave = async (item: Partial<IProducto>) => {
    const newItem = item as IProducto;

    // Validations
    if (Number(newItem.PRD_PRECIO) < 0) {
      showAlert('error', 'El precio no puede ser negativo.');
      return;
    }
    if (Number(newItem.PRD_COSTO_ADQUISICION) < 0) {
      showAlert('error', 'El costo no puede ser negativo.');
      return;
    }

    const exists = allData.find(d => d.PRD_CODIGO === newItem.PRD_CODIGO);

    let result;
    if (exists) {
      result = await updateProductoAction(newItem);
    } else {
      result = await createProductoAction(newItem);
    }

    if (result.success) {
      const savedItem = (result as any).data || newItem;

      if (exists) {
        const updateList = (list: IProducto[]) => list.map(p => p.PRD_CODIGO === savedItem.PRD_CODIGO ? savedItem : p);
        setData(prev => updateList(prev));
        setAllData(prev => updateList(prev));
        showAlert('success', 'Producto actualizado correctamente');
      } else {
        setData(prev => [...prev, savedItem]);
        setAllData(prev => [...prev, savedItem]);
        showAlert('success', 'Producto creado correctamente');
      }
    } else {
      showAlert('error', result.message || 'Error desconocido');
    }

    return Promise.resolve();
  };

  const handleDeleteClick = (item: IProducto) => {
    setConfirmState({
      isOpen: true,
      item,
      message: `¿Estás seguro de que deseas eliminar el producto "${item.PRD_DESCRIPCION}"?`
    });
  };

  const executeDelete = async () => {
    if (!confirmState.item) return;

    const result = await deleteProductoAction(confirmState.item.PRD_CODIGO);

    if (result.success) {
      setData(prev => prev.filter(p => p.PRD_CODIGO !== confirmState.item!.PRD_CODIGO));
      setAllData(prev => prev.filter(p => p.PRD_CODIGO !== confirmState.item!.PRD_CODIGO));
      showAlert('success', 'Producto eliminado correctamente');
    } else {
      showAlert('error', result.message || 'Error al eliminar');
    }
    setConfirmState({ ...confirmState, isOpen: false });
  };

  if (isLoading) return <div className="p-5 text-center">Cargando productos...</div>;

  return (
    <>
      <GenericTable<IProducto>
        title="Gestión de Productos"
        data={data}
        columns={columns}
        formFields={formFields}
        onSearch={handleSearch}
        onSave={handleSave}
        onDelete={handleDeleteClick}
        idField="PRD_CODIGO"
        searchPlaceholder="Buscar por descripción, código o categoría..."
        entityName="Producto"
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