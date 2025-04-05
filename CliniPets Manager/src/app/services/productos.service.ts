import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Producto } from '../models/producto.model';


@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  obtenerProductosPorCategoria(categoriaId: string) {
    throw new Error('Method not implemented.');
  }
  private collectionName = 'productos';

  constructor(private firestore: AngularFirestore) {}

  agregarProducto(producto: Producto) {
    return this.firestore.collection<Producto>(this.collectionName).add(producto);
  }

  obtenerProductos() {
    return this.firestore.collection<Producto>(this.collectionName).snapshotChanges();
  }

  actualizarStock(id: string, nuevoStock: number) {
    return this.firestore.collection(this.collectionName).doc(id).update({ stock: nuevoStock });
  }
  eliminarProducto(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
  actualizarProducto(id: string, producto: Producto) {
    return this.firestore.collection('productos').doc(id).update(producto);
  }
  obtenerCategorias() {
    return this.firestore.collection('categorias').snapshotChanges();
  }
  
}
