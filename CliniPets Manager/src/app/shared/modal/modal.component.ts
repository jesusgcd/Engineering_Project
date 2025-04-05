import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: false,

  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isVisible = false; // Controla la visibilidad del modal
  @Output() onClose = new EventEmitter<void>(); // Evento para notificar el cierre

  closeModal() {
    this.onClose.emit(); // Emite el evento de cierre
    this.isVisible = false;
  }
}
