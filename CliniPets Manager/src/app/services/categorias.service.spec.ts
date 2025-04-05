import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Producto } from '../models/producto.model';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private productosCollectionName = 'productos';
  private categoriasCollectionName = 'categorias'; // Nueva colección para categorías

  constructor(private firestore: AngularFirestore) {}

  // --- Operaciones para Productos ---
  agregarProducto(producto: Producto) {
    return this.firestore.collection<Producto>(this.productosCollectionName).add(producto);
  }

  obtenerProductos() {
    return this.firestore.collection<Producto>(this.productosCollectionName).snapshotChanges();
  }

  actualizarStock(id: string, nuevoStock: number) {
    return this.firestore.collection(this.productosCollectionName).doc(id).update({ stock: nuevoStock });
  }

  eliminarProducto(id: string) {
    return this.firestore.collection(this.productosCollectionName).doc(id).delete();
  }

  actualizarProducto(id: string, producto: Producto) {
    return this.firestore.collection<Producto>(this.productosCollectionName).doc(id).update(producto);
  }

  // --- Operaciones para Categorías ---
  agregarCategoria(categoria: Categoria) {
    return this.firestore.collection<Categoria>(this.categoriasCollectionName).add(categoria);
  }

  obtenerCategorias() {
    return this.firestore.collection<Categoria>(this.categoriasCollectionName).snapshotChanges();
  }

  actualizarCategoria(id: string, categoria: Categoria) {
    return this.firestore.collection<Categoria>(this.categoriasCollectionName).doc(id).update(categoria);
  }

  eliminarCategoria(id: string) {
    return this.firestore.collection<Categoria>(this.categoriasCollectionName).doc(id).delete();
  }

  obtenerProductosPorCategoria(categoria: string) {
    // Devuelve los productos asociados a una categoría específica
    return this.firestore
      .collection<Producto>(this.productosCollectionName, ref => ref.where('categoria', '==', categoria))
      .snapshotChanges();
  }
}
