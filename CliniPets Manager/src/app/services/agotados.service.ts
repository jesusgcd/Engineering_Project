import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Agotado } from '../models/agotado.model';

@Injectable({
  providedIn: 'root',
})
export class AgotadosService {
  private collectionName = 'productos';

  constructor(private firestore: AngularFirestore) {}

  // Obtener productos agotados (stock = 0)
  obtenerProductosAgotados() {
    return this.firestore
      .collection<Agotado>(this.collectionName, (ref) => ref.where('stock', '==', 0))
      .snapshotChanges();
  }

  // Agregar un nuevo producto agotado
  agregarProductoAgotado(producto: Agotado) {
    const nuevoProducto: Agotado = {
      ...producto,
      stock: 0, // Aseguramos que el stock sea siempre 0
    };
    return this.firestore.collection<Agotado>(this.collectionName).add(nuevoProducto);
  }

  // Actualizar un producto agotado
  actualizarProductoAgotado(id: string, producto: Agotado) {
    return this.firestore
      .collection<Agotado>(this.collectionName)
      .doc(id) // Seleccionamos el documento usando el 'id'
      .update(producto); // Actualizamos el producto
  }

  eliminarProductoAgotado(id: string): Promise<void> {
    return this.firestore
      .collection<Agotado>(this.collectionName)
      .doc(id) // Aquí usas el 'id' para identificar el documento a eliminar
      .delete(); // Elimina el producto
  }
  
  

}
