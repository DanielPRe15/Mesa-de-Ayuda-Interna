import { Component, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Solicitudes } from '../../../services/solicitudes';
import { ToastService } from '../../../services/toast';
import { Solicitud } from '../../../models/solicitud';
import { HTTP_ERROR_MESSAGES, DEFAULT_ERROR } from '../../../shared/constants/error.constants';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmarCambioEstadoDialog } from './confirmar-cambio-estado.dialog';

@Component({
  selector: 'app-detalle',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule
  ],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class Detalle implements OnDestroy {
  private solicitudesService = inject(Solicitudes);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  solicitud: Solicitud | null = null;
  cargando: boolean = true;
  id: number = 0;
  esOperador: boolean = false;
  cambioEnProgreso: boolean = false;
  esSolicitante: boolean = false;
  usuarioActualId: number = 0;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor() {
    this.validarToken();
    this.verificarRol();
    this.cargarSolicitud();
  }

  private verificarRol() {
    const rol = sessionStorage.getItem('userRole');
    console.log('Rol del usuario:', rol);
    this.esOperador = rol?.toUpperCase() === 'OPERADOR';
    console.log('¿Es operador?:', this.esOperador);
    
    const userId = sessionStorage.getItem('userId');
    this.usuarioActualId = userId ? parseInt(userId, 10) : 0;
    console.log('ID del usuario actual:', this.usuarioActualId);
  }

  private validarToken() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.toastService.error('No tienes sesión activa');
      this.router.navigate(['/login']);
    }
  }

  private cargarSolicitud() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

    if (this.id === 0) {
      this.toastService.error('Solicitud no encontrada');
      this.router.navigate(['/solicitudes']);
      return;
    }

    this.solicitudesService.obtenerDetalle(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (solicitud: Solicitud) => {
          this.cargando = false;
          this.solicitud = solicitud;
          this.esSolicitante = solicitud.solicitanteId === this.usuarioActualId;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.cargando = false;
          const mensaje = this.obtenerMensajeError(error);
          this.toastService.error(mensaje);
          this.router.navigate(['/solicitudes']);
        }
      });
  }

  editar() {
    this.router.navigate(['/solicitudes/editar', this.id]);
  }

  volver() {
    this.router.navigate(['/solicitudes']);
  }



  formatearFecha(fecha: any): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  abrirModalCambiarEstado(nuevoEstado: string) {
    const dialogRef = this.dialog.open(ConfirmarCambioEstadoDialog, {
      width: '400px',
      data: { estado: nuevoEstado }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resultado) => {
        if (resultado) {
          this.cambiarEstado(nuevoEstado);
        }
      });
  }

  private cambiarEstado(nuevoEstado: string) {
    this.cambioEnProgreso = true;
    this.solicitudesService.cambiarEstado(this.id, nuevoEstado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (solicitudActualizada: Solicitud) => {
          this.cambioEnProgreso = false;
          this.toastService.exito(`Solicitud marcada como ${nuevoEstado}`);
          this.router.navigate(['/solicitudes']);
        },
        error: (error) => {
          this.cambioEnProgreso = false;
          const mensaje = this.obtenerMensajeError(error);
          this.toastService.error(mensaje);
        }
      });
  }

  private obtenerMensajeError(error: any): string {
    const statusCode = error.status || 'unknown';
    return HTTP_ERROR_MESSAGES[statusCode] || DEFAULT_ERROR;
  }
}
