import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.models';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TaskServiceService } from '../services/task-service.service';
import { TaskEndService } from '../services/task-end.service';

@Component({
  selector: 'app-to-do-list',
  standalone: false,

  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent implements OnInit{
  tasks: Task[] = [];
  userId: string | null = null;
  taskFormVisible: boolean = false;
  taskToEdit: Task | null = null;

  modalVisible: boolean = false; // Controla la visibilidad del modal
  completeModalVisible: boolean = false; // Controla la visibilidad del modal de completar tarea
  selectedTask: Task | null = null; // Almacena la tarea seleccionada para eliminar
  updateModalVisible: boolean = false; // Controla la visibilidad del modal de actualización

  currentPage: number = 1; // Página actual
  tasksPerPage: number = 7; // Número máximo de tareas por página
  paginatedTasks: Task[] = []; // Tareas mostradas en la página actual

  itemsPerPage: number = 7; // Cantidad máxima de elementos por página
  paginatedItems: any[] = []; // Elementos visibles en la página actual
  totalPages: number = 0; // Total de páginas calculadas


  newTask: Task = {
    userId: '',
    name: '',
    description: '',
    status: 'Activo',
    createdAt: new Date(),
  };

  constructor(private taskService: TaskServiceService, private auth: AngularFireAuth,private taskEndService: TaskEndService,) {}

  ngOnInit(): void {
    // Verifica el usuario autenticado y carga las tareas asociadas
    this.auth.currentUser.then((user) => {
      if (user) {
        this.userId = user.uid; // Obtiene el UID del usuario autenticado
        this.loadTasks(); // Carga las tareas del usuario
      } else {
        console.error('Usuario no autenticado');
      }
    }).catch((error) => {
      console.error('Error al obtener el usuario autenticado:', error);
    });
  }

  confirmMarkAsDone(): void {
    if (this.selectedTask && this.userId) {
      // Cambiar el estado de la tarea a "Finalizado" (literal válido para el modelo)
      const updatedTask: Task = {
        ...this.selectedTask,
        status: 'Finalizado', // Literal compatible con el modelo
      };

      // Mueve la tarea a `task-end` y elimina de `tasks`
      this.taskEndService.addCompletedTask(updatedTask).then(() => {
        if (this.selectedTask?.id) {
          this.taskService.deleteTask(this.selectedTask.id).then(() => {
            this.mostrarMensajeDinamico(`Tarea "${this.selectedTask?.name}" marcada como realizada.`);
            this.tasks = this.tasks.filter((task) => task.id !== this.selectedTask?.id);
            this.closeCompleteModal(); // Cierra el modal
          });
        }
      });
    }
  }

  cancelComplete(): void {
    this.closeCompleteModal(); // Cierra el modal sin realizar cambios
  }

  closeCompleteModal(): void {
    this.completeModalVisible = false;
    this.selectedTask = null; // Resetea la tarea seleccionada
  }

loadTasks(): void {
  if (this.userId) {
    this.taskService.getTasksByUser(this.userId).subscribe((tasks) => {
      this.tasks = tasks.map((task) => ({
        ...task,
        createdAt: (task.createdAt as any).toDate
          ? (task.createdAt as any).toDate()
          : task.createdAt,
      }));
      this.updatePaginatedTasks(); // Actualiza las tareas visibles
    });
  }
}

updatePaginatedTasks(): void {
  const startIndex = (this.currentPage - 1) * this.tasksPerPage;
  const endIndex = startIndex + this.tasksPerPage;
  this.paginatedTasks = this.tasks.slice(startIndex, endIndex);
}


  openTaskForm(): void {
    this.taskFormVisible = true;
    this.taskToEdit = null; // Resetear edición
  }

  closeTaskForm(): void {
    this.taskFormVisible = false;
    this.newTask = {
      userId: this.userId!,
      name: '',
      description: '',
      status: 'Activo',
      createdAt: new Date(),
    };
  }

  saveTask(): void {
    if (this.taskToEdit) {
      this.updateModalVisible = true; // Abre el modal de confirmación
    } else if (this.userId) {
      this.newTask.userId = this.userId; // Asigna el userId
      this.taskService.addTask(this.newTask).then(() => {
        this.closeTaskForm(); // Cerrar el formulario
        this.mostrarMensajeDinamico(`Tarea agregada exitosamente.`); // Mostrar mensaje dinámico
        this.loadTasks(); // Recargar las tareas
      }).catch((error) => {
        console.error('Error al agregar tarea:', error);
        this.mostrarMensajeDinamico('Ocurrió un error al agregar la tarea. Intenta de nuevo.');
      });
    }
  }


  confirmUpdate(): void {
    if (this.taskToEdit && this.userId) {
      this.taskService.updateTask(this.taskToEdit.id!, this.newTask).then(() => {
        this.mostrarMensajeDinamico(`Tarea ${this.taskToEdit?.name} actualizada.`);
        this.closeUpdateModal(); // Cierra el modal
        this.closeTaskForm(); // Cierra el formulario
      });
    }
  }

  cancelUpdate(): void {
    this.closeUpdateModal(); // Cierra el modal sin realizar cambios
  }

  closeUpdateModal(): void {
    this.updateModalVisible = false; // Oculta el modal
  }

  editTask(task: Task): void {
    this.taskToEdit = task;
    this.newTask = { ...task };
    this.taskFormVisible = true;
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).then(() => {
      console.log('Tarea eliminada');
    });
  }

  confirmDelete(): void {
    if (this.selectedTask?.id) {
      this.taskService.deleteTask(this.selectedTask.id).then(() => {
        this.mostrarMensajeDinamico(`Tarea ${this.selectedTask?.name} eliminada.`);
        this.tasks = this.tasks.filter(
          (task) => task.id !== this.selectedTask?.id
        ); // Actualiza la lista local
        this.closeModal(); // Cierra el modal
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

  openDeleteModal(task: Task): void {
    this.selectedTask = task; // Almacena la tarea seleccionada
    this.modalVisible = true; // Muestra el modal
  }

  openCompleteModal(task: Task): void {
    this.selectedTask = task; // Almacena la tarea seleccionada
    this.completeModalVisible = true; // Muestra el modal de completar tarea
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedTasks();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.tasks.length / this.tasksPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedTasks();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTasks();
    }
  }

  generatePageNumbers(): number[] {
    return Array(this.getTotalPages())
      .fill(0)
      .map((_, i) => i + 1); // Genera números de página
  }

  mensajeDinamico: string = ''; // Variable para el mensaje dinámico

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

  isFormValid(): boolean {
    return this.newTask.name.trim() !== '' && this.newTask.description.trim() !== '';
  }


}
