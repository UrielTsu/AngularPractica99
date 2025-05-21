import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Evento } from '../screens/eventos-screen/eventos-screen.component';


const jsonHeaders = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  // Validación para el formulario de evento (Opción A: llaves alineadas)
  public validarEvento(evento: any, editar: boolean): any {
    console.log("Validando evento...", evento);
    let error: any = {};

    if (!this.validatorService.required(evento["nombre"])) {
      error["nombre"] = this.errorService.required;
    }
    if (!this.validatorService.required(evento["tipo"])) {
      error["tipo"] = this.errorService.required;
    }
    if (!this.validatorService.required(evento["fecha"])) {
      error["fecha"] = this.errorService.required;
    }
    if (!this.validatorService.required(evento["hora_inicio"])) {
      error["hora_inicio"] = this.errorService.required;
    }
    if (!this.validatorService.required(evento["hora_final"])) {
      error["hora_final"] = this.errorService.required;
    }
    if (!this.validatorService.required(evento["lugar"])) {
      error["lugar"] = this.errorService.required;
    }
    if (!this.validatorService.required(evento["publico"])) {
      error["publico"] = this.errorService.required;
    } else if (
      Array.isArray(evento["publico"]) &&
      evento["publico"].includes("Estudiantes") &&
      !this.validatorService.required(evento["programa"])
    ) {
      error["programa"] = this.errorService.required;
    }
    if (!this.validatorService.required(evento["responsable"])) {
      error["responsable"] = this.errorService.required;
    }
    if (!this.validatorService.required(evento["descripcion"])) {
      error["descripcion"] = this.errorService.required;
    }
    if (!this.validatorService.required(evento["cupo"])) {
      error["cupo"] = this.errorService.required;
    }
    return error;
  }

  // Servicio para registrar un nuevo evento
  public registrarEvento(evento: any): Observable<any> {
    return this.http.post<any>(
      `${environment.url_api}/eventos/`,
      evento,
      jsonHeaders
    );
  }

  // Servicio para editar un evento existente
  public editarEvento(evento: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.put<any>(
      `${environment.url_api}/eventos-edit/`,
      evento,
      { headers }
    );
  }

  // Servicio para obtener un evento por su ID
  public getEventoById(id: any): Observable<any> {
    return this.http.get<any>(
      `${environment.url_api}/eventos/?id=${id}`,
      jsonHeaders
    );
  }

  // Servicio para eliminar un evento
  public eliminarEvento(id: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.delete<any>(
      `${environment.url_api}/eventos-edit/?id=${id}`,
      { headers }
    );
  }

  // Servicio para obtener la lista de eventos registrados
  public obtenerListaEventos(): Observable<Evento[]> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get<Evento[]>(
      `${environment.url_api}/lista-eventos/`,
      { headers }
    );
  }
}