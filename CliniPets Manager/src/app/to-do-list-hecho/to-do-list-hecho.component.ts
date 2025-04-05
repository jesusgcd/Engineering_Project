import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TaskEndService } from '../services/task-end.service';
import { Task } from '../models/task.models';

@Component({
  selector: 'app-to-do-list-hecho',
  standalone: false,

  templateUrl: './to-do-list-hecho.component.html',
  styleUrl: './to-do-list-hecho.component.css'
})
export class ToDoListHechoComponent {
  tasks: Task[] = [];
  userId: string | null = null;

  modalVisible: boolean = false; // Controla la visibilidad del modal
  selectedTask: Task | null = null; // Almacena la tarea seleccionada para eliminar

  currentPage: number = 1; // Página actual
  tasksPerPage: number = 7; // Número máximo de tareas por página

  paginatedTasks: Task[] = []; // Tareas visibles en la página actual

  constructor(private taskEndService: TaskEndService, private auth: AngularFireAuth) {}

  ngOnInit(): void {
    this.auth.currentUser
      .then((user) => {
        if (user) {
          this.userId = user.uid; // Obtiene el UID del usuario autenticado
          this.loadCompletedTasks(); // Carga las tareas completadas del usuario
        } else {
          console.error('Usuario no autenticado');
        }
      })
      .catch((error) => {
        console.error('Error al obtener el usuario autenticado:', error);
      });
  }

  //Funcion que carga todas las tareas que tiene segun el usuario
  loadCompletedTasks(): void {
    if (this.userId) {
      this.taskEndService.getCompletedTasksByUser(this.userId).subscribe((tasks) => {
        this.tasks = tasks.map((task) => ({
          ...task,
          createdAt: (task.createdAt as any).toDate ? (task.createdAt as any).toDate() : task.createdAt,
        }));
        this.updatePaginatedTasks(); // Actualiza las tareas visibles
      });
    }
  }

  //Funcion que actualiza el páginado
  updatePaginatedTasks(): void {
    const startIndex = (this.currentPage - 1) * this.tasksPerPage;
    const endIndex = startIndex + this.tasksPerPage;
    this.paginatedTasks = this.tasks.slice(startIndex, endIndex);
  }

  //Funcion para ir a una pagina en especifico
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedTasks();
    }
  }

  //FUnciion que obtiene la cantidad de paginas
  getTotalPages(): number {
    return Math.ceil(this.tasks.length / this.tasksPerPage);
  }

  //Funcion que lleva a la siguiente pagina
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedTasks();
    }
  }

  //Funcion que lleva a la pagina anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTasks();
    }
  }

  //Funcion que genera la cantidad de paginas que existen
  generatePageNumbers(): number[] {
    return Array(this.getTotalPages())
      .fill(0)
      .map((_, i) => i + 1); // Genera números de página
  }
//Funcion que elimina una tarea deseada
  deleteTask(taskId: string): void {
    this.taskEndService.deleteCompletedTask(taskId).then(() => {
      console.log(`Tarea con ID ${taskId} eliminada exitosamente.`);
      // Opcional: mostrar un mensaje de éxito al usuario
      this.tasks = this.tasks.filter(task => task.id !== taskId); // Actualiza la lista local
    }).catch(error => {
      console.error('Error al eliminar la tarea:', error);
    });
  }

  //Funcion que abre un modal
  openDeleteModal(task: Task): void {
    this.selectedTask = task; // Almacena la tarea seleccionada
    this.modalVisible = true; // Muestra el modal
  }

  //Funcion que le permite al usuario realizar una eliminacion de una tarea
  confirmDelete(): void {
    if (this.selectedTask?.id) {
      this.taskEndService.deleteCompletedTask(this.selectedTask.id).then(() => {
        this.tasks = this.tasks.filter(task => task.id !== this.selectedTask?.id); // Actualiza la lista
        this.closeModal(); // Cierra el modal
        this.mostrarMensajeDinamico(`Tarea finalizada, eliminada con éxito!.`);
      }).catch((error) => {
        console.error('Error al eliminar la tarea:', error);
        this.closeModal();
      });
    }
  }

  cancelDelete(): void {
    this.closeModal(); // Cierra el modal sin eliminar
  }

  closeModal(): void {
    this.modalVisible = false;
    this.selectedTask = null; // Resetea la tarea seleccionada
  }

  mensajeDinamico: string = ''; // Variable para el mensaje dinámico

  //Mensaje dinamico para informar al usuario de la accion
  mostrarMensajeDinamico(mensaje: string, cerrarFormulario: boolean = false, callback?: () => void) {
    if (this.mensajeDinamico) {
      // Evita que se muestre dos veces si ya hay un mensaje activo
      return;
    }

    this.mensajeDinamico = mensaje; // Asignar mensaje dinámico
    setTimeout(() => {
      this.mensajeDinamico = ''; // Limpiar el mensaje
      if (cerrarFormulario && callback) {
        callback(); // Ejecutar la función de cierre si se proporciona
      }
    }, 2000);
  }

}
