'use server';

export async function getCategoriasAction() {
    try {
        const response = await fetch(`${process.env.API_URL}/categories`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const rawData = await response.json();

        // Map API response to ICategoria
        const categorias = rawData.map((item: any) => ({
            CAT_CODIGO: item.CAT_CODIGO,
            CAT_NOMBRE: item.CAT_NOMBRE,
            CAT_DESCRIPCION: item.CAT_DESCRIPCION || ''
        }));

        return { success: true, data: categorias };
    } catch (error) {
        console.error('Error fetching categorias:', error);
        return { success: false, message: 'Error al obtener categorías' };
    }
}
