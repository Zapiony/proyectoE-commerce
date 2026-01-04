export interface IProveedor {
    ruc: string;           // PRV_RUC
    razonSocial: string;   // PRV_RAZON_SOCIAL
    direccion: string;     // PRV_DIRECCION
    telefono: string;      // PRV_TELEFONO
    nombreContacto: string;// PRV_NOMBRE
}

export interface IProducto {
    codigo: string;        // PRD_CODIGO
    descripcion: string;   // PRD_DESCRIPCION
    precio: number;        // PRD_PRECIO
    categoria: string;     // PRD_CATEGORIA
    costo: number;         // PRD_COSTO_ADQUISICION
}