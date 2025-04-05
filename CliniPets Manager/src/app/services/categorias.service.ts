// categoria.model.ts
export interface Categoria {
  id?: string;
  nombre: string;
  stock: number;
}

// productos.model.ts (if needed for the 'Ver' button)
export interface Producto {
  codigo: string;
  nombre: string;
  categoria: string;
}

// categoria.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })

export class CategoriaService {
  constructor(private firestore: AngularFirestore) {}

  obtenerCategorias() {
    return this.firestore.collection('categorias').snapshotChanges();
  }

  agregarCategoria(categoria: Categoria) {
    return this.firestore.collection('categorias').add(categoria);
  }

  actualizarCategoria(id: string, data: Partial<Categoria>) {
    return this.firestore.collection('categorias').doc(id).update(data);
  }

  eliminarCategoria(id: string) {
    return this.firestore.collection('categorias').doc(id).delete();
  }

  obtenerProductosPorCategoria(categoria: string) {
    return this.firestore
      .collection('productos', (ref) => ref.where('categoria', '==', categoria))
      .snapshotChanges();
  }
  obtenerTodosLosProductos() {
    return this.firestore.collection('productos').snapshotChanges();
  }
  
}