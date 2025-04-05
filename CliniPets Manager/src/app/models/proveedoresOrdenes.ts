export interface ProveedoresOrdenes {    
  id?: string;
  proveedorEmpresaNombre: string;
  numeroOrden: string;
  listaProductos: string;    
  fechaCreacion: string;
  fechaEntrega: string;
  estadoOrden: 'Pendiente' | 'Completado' | 'Cancelado';       
  montoAproximado: string;
  notas: string;
}



