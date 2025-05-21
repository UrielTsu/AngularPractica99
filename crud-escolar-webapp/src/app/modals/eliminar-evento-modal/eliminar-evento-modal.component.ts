import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-eliminar-evento-modal',
  templateUrl: './eliminar-evento-modal.component.html',
  styleUrls: ['./eliminar-evento-modal.component.scss']
})
export class EliminarEventoModalComponent {

  constructor(
    private eventosService: EventosService,
    private dialogRef: MatDialogRef<EliminarEventoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  cerrar_modal(): void {
    this.dialogRef.close({ isDelete: false });
  }

  eliminarEvento(): void {
    this.eventosService.eliminarEvento(this.data.id).subscribe(
      (response) => {
        console.log('Evento eliminado', response);
        this.dialogRef.close({ isDelete: true });
      },
      (error) => {
        console.error('Error al eliminar evento', error);
        this.dialogRef.close({ isDelete: false });
      }
    );
  }
}