export interface Factura {
  id?: string;
  numeroFactura: string;
  cliente: string;
  fecha: Date;
  notas: string;
  total: number;
  estado: string;
}
