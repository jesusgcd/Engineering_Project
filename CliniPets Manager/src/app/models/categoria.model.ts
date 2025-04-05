// categoria.model.ts
export interface Categoria {
  id?: string;
  nombre: string;
  stock: number;
}

export interface Producto {
  codigo: string;
  nombre: string;
  categoria: string;
}
