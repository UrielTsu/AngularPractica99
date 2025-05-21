import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventosService } from 'src/app/services/eventos.service';
import { MaestrosService } from 'src/app/services/maestros.service';

declare var $: any;

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss']
})
export class RegistroEventosComponent implements OnInit {

  @Input() datos_user: any = {};
  public evento: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public fechaHoy = new Date();

  public tiposEvento: string[] = ['Conferencia', 'Taller', 'Seminario', 'Concurso'];
  public publicos: string[] = ['Estudiantes', 'Profesores', 'Público general'];
  public programas: string[] = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];

  public lista_responsables: any[] = [];
Array: any;

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private eventosService: EventosService,
    public maestrosService: MaestrosService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtenerResponsables();

    // Editar evento
    const idEvento = this.activatedRoute.snapshot.params['id'];
    if (idEvento) {
      this.editar = true;
      this.obtenerEventoPorId(idEvento);
    } else {
      this.evento = {
        nombre: '',
        tipo: '',
        fecha: '',
        hora_inicio: '',
        hora_final: '',
        lugar: '',
        publico: [],
        programa: '',
        responsable: '',
        descripcion: '',
        cupo: ''
      };
    }
  }

  obtenerResponsables(): void {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_responsables = response.map((usuario: any) => {
          return {
            first_name: usuario.user.first_name,
            last_name: usuario.user.last_name
          };
        });
      },
      (error) => {
        alert('No se pudo obtener la lista de responsables.');
      }
    );
  }

  checkboxPublicoChange(event: any): void {
    const value = event.source.value;
    if (event.checked) {
      this.evento.publico.push(value);
    } else {
      const index = this.evento.publico.indexOf(value);
      if (index > -1) {
        this.evento.publico.splice(index, 1);
      }
    }
  }

  validarHorario(): boolean {
    const inicio = new Date(`1970-01-01T${this.evento.hora_inicio}:00`).getTime();
    const final = new Date(`1970-01-01T${this.evento.hora_final}:00`).getTime();
    if (inicio >= final) {
      this.errors.hora_inicio = 'La hora de inicio debe ser menor que la hora de finalización.';
      this.errors.hora_final = 'La hora de finalización debe ser mayor que la hora de inicio.';
      return false;
    }
    delete this.errors.hora_inicio;
    delete this.errors.hora_final;
    return true;
  }

  // Dentro de RegistroEventosComponent

registrar(): void {
  this.errors = this.eventosService.validarEvento(this.evento, false);
  if (!this.validarHorario() || !$.isEmptyObject(this.errors)) return;

  // Construimos el payload con los nombres y formatos que el backend espera:
  const payload = {
    nombre:             this.evento.nombre,
    tipo_evento:        this.evento.tipo,
    fecha:              (this.evento.fecha as Date).toISOString().split('T')[0],
    hora_inicio:        this.evento.hora_inicio,
    hora_fin:           this.evento.hora_final,
    lugar:              this.evento.lugar,
    es_publico:         this.evento.publico.includes('Público general'),
    programa_educativo: this.evento.programa,
    responsable:        this.evento.responsable,       // ¡Asegúrate de esto!
    descripcion:        this.evento.descripcion,
    cupo_maximo:        Number(this.evento.cupo)
  };

  // Verifica en consola el JSON que vas a enviar:
  console.log('→ Payload a enviar:', JSON.stringify(payload));

  this.eventosService.registrarEvento(payload).subscribe(
    () => {
      alert('Evento registrado correctamente');
      this.router.navigate(['home']);
    },
    (err) => {
      console.error('Error al registrar:', err);
      alert('Error al registrar el evento');
    }
  );
}

actualizar(): void {
  this.errors = this.eventosService.validarEvento(this.evento, true);
  if (!this.validarHorario() || !$.isEmptyObject(this.errors)) return;

  // Mismo mapeo para la actualización
  const payload = {
    id:                 this.evento.id,
    nombre:             this.evento.nombre,
    tipo_evento:        this.evento.tipo,
    fecha: this.evento.fecha instanceof Date 
  ? this.evento.fecha.toISOString().split('T')[0] 
  : new Date(this.evento.fecha).toISOString().split('T')[0],
    hora_inicio:        this.evento.hora_inicio,
    hora_fin:           this.evento.hora_final,
    lugar:              this.evento.lugar,
    descripcion:        this.evento.descripcion,
    programa_educativo: this.evento.programa,
    cupo_maximo:        Number(this.evento.cupo),
    es_publico:         Array.isArray(this.evento.publico) && this.evento.publico.includes('Público general')
  };

  console.log('→ Payload a enviar para actualizar:', JSON.stringify(payload));

  this.eventosService.editarEvento(payload).subscribe(
    () => {
      alert('Evento actualizado correctamente');
      this.router.navigate(['home']);
    },
    (err) => {
      console.error('Error al actualizar:', err);
      alert('Error al actualizar el evento');
    }
  );
}


  obtenerEventoPorId(id: any): void {
    this.eventosService.getEventoById(id).subscribe(
      (response) => {
        this.evento = response;
        // Mapea correctamente el campo del backend al frontend
        this.evento.publico = Array.isArray(response.publico_objetivo) ? response.publico_objetivo : [];
      },
      (error) => {
        alert('No se pudo obtener el evento');
      }
    );
  }

  regresar(): void {
    this.location.back();
  }

  soloLetrasYNumeros(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      !(charCode >= 48 && charCode <= 57) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }

  letrasNumerosEspacios(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      !(charCode >= 48 && charCode <= 57) &&  // Números
      charCode !== 32 &&                     // Espacio
      charCode !== 46 &&                    // Punto
      charCode !== 44 &&                    // Coma
      charCode !== 45 &&                    // Guion
      charCode !== 95                      // Guion bajo
    ) {
      event.preventDefault();
    }
  }

  validarAlfanumerico(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      !(charCode >= 48 && charCode <= 57) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
}
