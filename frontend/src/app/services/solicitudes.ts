import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../models/solicitud';
import { appSettings } from '../settings/appsettings';

@Injectable({
  providedIn: 'root',
})
export class Solicitudes {
  private apiUrl = appSettings.apiUrl + '/solicitudes';

  constructor(private http: HttpClient) {}

  crear(solicitud: Partial<Solicitud>): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, solicitud);
  }

  listar(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl);
  }

  obtenerDetalle(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.apiUrl}/${id}`);
  }

  editar(id: number, solicitud: Partial<Solicitud>): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/${id}`, solicitud);
  }

  cambiarEstado(id: number, estado: string): Observable<Solicitud> {
    return this.http.patch<Solicitud>(
      `${this.apiUrl}/${id}/cambiar-estado`,
      { estado }
    );
  }


  filtrar(
    titulo?: string,
    estado?: string,
    prioridad?: string,
    fechaInicio?: Date,
    fechaFin?: Date,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams();

    if (titulo?.trim()) {
      params = params.set('titulo', titulo);
    }
    if (estado?.trim()) {
      params = params.set('estado', estado);
    }
    if (prioridad?.trim()) {
      params = params.set('prioridad', prioridad);
    }
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio.toISOString().split('T')[0]);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin.toISOString().split('T')[0]);
    }
    
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/filtrar`, { params });
  }
}
