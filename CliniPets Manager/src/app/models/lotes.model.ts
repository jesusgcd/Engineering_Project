export interface Lote {
    [x: string]: any;
    id?: string;
    codigo: string;
    nombre: string;
    stock: number;
    fechaIngreso: string;
    fechaVencimiento: string;
    proveedor: string;
  }
  