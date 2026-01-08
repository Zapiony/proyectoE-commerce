'use server';

import { getAllCategorias } from '@/lib/models/categoriaMD';

export async function getCategoriasAction() {
    try {
        const categorias = await getAllCategorias();
        return { success: true, data: categorias };
    } catch (error) {
        console.error('Error fetching categorias:', error);
        return { success: false, message: 'Error al obtener categorías' };
    }
}
