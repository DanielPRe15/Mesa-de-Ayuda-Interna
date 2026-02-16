import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Solicitudes } from '../../../services/solicitudes';
import { ToastService } from '../../../services/toast';
import { Solicitud } from '../../../models/solicitud';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { COLUMNAS_SOLICITUD, ESTADOS_SOLICITUD, PRIORIDADES_SOLICITUD } from '../../../shared/constants/solicitud.constants';
import { HTTP_ERROR_MESSAGES, DEFAULT_ERROR } from '../../../shared/constants/error.constants';

@Component({
  selector: 'app-listado',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './listado.html',
  styleUrl: './listado.css',
})
export class Listado implements OnInit, OnDestroy {
  private solicitudesService = inject(Solicitudes);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  solicitudes: Solicitud[] = [];
  dataSource = new MatTableDataSource<Solicitud>([]);
  cargando: boolean = true;
  sinPermiso: boolean = false;

  // Propiedades de paginación
  paginaActual: number = 0;
  pageSize: number = 10;
  pageSizeAnterior: number = 10;
  totalElementos: number = 0;

  // Propiedades de filtros
  filtroTitulo: string = '';
  filtroEstado: string = '';
  filtroPrioridad: string = '';
  filtroFechaInicio: Date | null = null;
  filtroFechaFin: Date | null = null;

  // Opciones para los selectores (desde constantes)
  estados: string[] = ESTADOS_SOLICITUD;
  prioridades: string[] = PRIORIDADES_SOLICITUD;

  displayedColumns: string[] = COLUMNAS_SOLICITUD;

  userName: string = '';
  userRole: string = '';

  ngOnInit() {
    this.validarToken();
    this.cargarDatosUsuario();
    this.cargarSolicitudes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private validarToken() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.toastService.error('No tienes sesión activa. Por favor inicia sesión.');
      this.router.navigate(['/login']);
      return;
    }
  }

  private cargarDatosUsuario() {
    this.userName = sessionStorage.getItem('userName') || 'Usuario';
    this.userRole = sessionStorage.getItem('userRole') || 'Usuario';
  }

  cargarSolicitudes() {
    // Cargar la primera página de solicitudes usando los filtros (sin valores iniciales)
    this.aplicarFiltros();
  }

  verDetalle(id: number) {
    this.router.navigate(['/solicitudes/detalle', id]);
  }

  editar(id: number) {
    this.router.navigate(['/solicitudes/editar', id]);
  }

  crearSolicitud() {
    this.router.navigate(['/solicitudes/crear']);
  }


  // Método para aplicar filtros (llamando al backend)
  aplicarFiltros() {
    this.paginaActual = 0;
    this.cargarFiltros();
  }

  // Método para cargar datos filtrados desde el backend
  private cargarFiltros() {
    this.cargando = true;
    const filtros = this.construirFiltros();

    this.solicitudesService.filtrar(
      filtros.titulo,
      filtros.estado,
      filtros.prioridad,
      filtros.fechaInicio,
      filtros.fechaFin,
      this.paginaActual,
      this.pageSize
    ).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => this.procesarRespuestaFiltros(response),
      error: (error) => this.procesarErrorFiltros(error)
    });
  }

  private construirFiltros() {
    return {
      titulo: this.filtroTitulo || undefined,
      estado: this.filtroEstado || undefined,
      prioridad: this.filtroPrioridad || undefined,
      fechaInicio: this.filtroFechaInicio || undefined,
      fechaFin: this.filtroFechaFin || undefined
    };
  }

  private procesarRespuestaFiltros(response: any) {
    this.cargando = false;
    this.totalElementos = response.totalElements;
    this.actualizarPaginador();
    this.asignarDatos(response.content);
    this.mostrarMensajeSiNoHayResultados(response.content);
    this.cdr.markForCheck();
  }

  private actualizarPaginador() {
    if (!this.paginator) return;
    this.paginator.length = this.totalElementos;
    this.paginator.pageIndex = this.paginaActual;
    this.paginator.pageSize = this.pageSize;
  }

  private asignarDatos(solicitudes: Solicitud[]) {
    this.dataSource.data = solicitudes;
    this.dataSource.paginator = this.paginator;
  }

  private mostrarMensajeSiNoHayResultados(solicitudes: Solicitud[]) {
    if (solicitudes.length === 0 && this.paginaActual === 0) {
      this.toastService.info('No hay resultados que coincidan con los filtros');
    }
  }

  private procesarErrorFiltros(error: any) {
    this.cargando = false;
    console.error('Error al aplicar filtros:', error);
    
    const mensaje = this.obtenerMensajeError(error);
    this.toastService.error(mensaje);
    
    if (error.status === 401 || error.status === 403) {
      this.sinPermiso = true;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
    
    this.cdr.markForCheck();
  }

  private obtenerMensajeError(error: any): string {
    const statusCode = error.status || 'unknown';
    return HTTP_ERROR_MESSAGES[statusCode] || DEFAULT_ERROR;
  }

  // Método para manejar el cambio de página
  onPaginaChange(event: PageEvent) {
    const cambioTamano = event.pageSize !== this.pageSizeAnterior;
    const cambioIndice = event.pageIndex !== this.paginaActual;
    
    if (cambioTamano) {
      this.actualizarTamanoYResetearPagina(event.pageSize);
    } else if (cambioIndice) {
      this.paginaActual = event.pageIndex;
    } else {
      return;
    }
    
    this.cargarFiltros();
  }

  private actualizarTamanoYResetearPagina(nuevoTamano: number) {
    this.pageSizeAnterior = nuevoTamano;
    this.pageSize = nuevoTamano;
    this.paginaActual = 0;
    
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

  limpiarFiltros() {
    this.filtroTitulo = '';
    this.filtroEstado = '';
    this.filtroPrioridad = '';
    this.filtroFechaInicio = null;
    this.filtroFechaFin = null;
    this.paginaActual = 0;
    this.pageSize = 10;
    this.pageSizeAnterior = 10;
    
    // Resetear el paginator
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 10;
    }
    
    this.aplicarFiltros();
    this.toastService.info('Filtros limpios');
  }

  logout() {
    this.limpiarSessionStorage();
    this.toastService.info('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }

  private limpiarSessionStorage() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userRole');
  }
}
