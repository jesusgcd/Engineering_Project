export interface Proveedores {    
  id?: string;
  nombreProveedor: string;    
  descripcion: string;    
  cedulaJuridica: string;     
  estado: 'Activo' | 'Inactivo'; // Estatus del proveedor 
  direccion: string; 
  telefonoPrincipal: string;
  correoElectronico: string;
  // Atributo adicional
  paginaWeb: string;
}

//que otro atributo podria tener un proveedor?



