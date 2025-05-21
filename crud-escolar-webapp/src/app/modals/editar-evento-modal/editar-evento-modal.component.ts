import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-editar-evento-modal',
  templateUrl: './editar-evento-modal.component.html',
  styleUrls: ['./editar-evento-modal.component.scss']
})
export class EditarEventoModalComponent implements OnInit{

  constructor(
    public eventosService: EventosService,
    private dialogRef: MatDialogRef<EditarEventoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { evento: any, id: number },
  ){}

  ngOnInit(): void {
    
  }
  
  confirmEdit() {
    this.dialogRef.close({ isEdit: true }); // Confirmar la edición
  }

  public cerrar_modal(){
    this.dialogRef.close({isEdit:false});
  }

  public editarEvento() {
    this.dialogRef.close({ isEdit: true, evento: this.data.evento }); // Confirmar la edición

  }
}