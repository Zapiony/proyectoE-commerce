export interface ICliente {
    CLI_CEDULA_RUC: string;
    CLI_NOMBRE: string;
    CLI_TELEFONO: string;
    CLI_CORREO: string;
}

export interface IProveedor {
    PRV_RUC: string;
    PRV_NOMBRE: string;
    PRV_DIRECCION: string;
    PRV_TELEFONO: string;
    PRV_CORREO: string;
    PRV_RAZON_SOCIAL: string;
}

export interface IBodega {
    BOD_CODIGO: string;
    BOD_DESCRIPCION: string;
    BOD_DIRECCION: string;
    BOD_NOMBRE_ENCARGADO: string;
    BOD_TELEFONO_ENCARGADO: string;
}

export interface IProducto {
    PRD_CODIGO: string;
    CAT_CODIGO: string;
    PRD_DESCRIPCION: string;
    PRD_PRECIO: number;
    PRD_COSTO_ADQUISICION: number;
}

export interface ICategoria {
    CAT_CODIGO: string;
    CAT_NOMBRE: string;
    CAT_DESCRIPCION: string;
}



export interface IOrdenCompra {
    ORD_CODIGO?: number; // Optional for creation if auto-generated
    PRV_RUC: string;
    PRV_NOMBRE?: string; // For display
    ORD_FECHA_ENTREGA: Date | string;
    ORD_ESTADO: string;
}

export interface IDetalleOrdenCompra {
    ORD_CODIGO?: number;
    PRD_CODIGO: string;
    DET_ORD_COMPRA_CANTIDAD: number;
    DET_ORD_COMPRA_COSTO_UNITARIO: number;
}