import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Solicitudes } from '../../../services/solicitudes';
import { ToastService } from '../../../services/toast';
import { Solicitud } from '../../../models/solicitud';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HTTP_ERROR_MESSAGES, DEFAULT_ERROR } from '../../../shared/constants/error.constants';
import { ESTADOS_SOLICITUD, PRIORIDADES_SOLICITUD } from '../../../shared/constants/solicitud.constants';

@Component({
  selector: 'app-editar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatToolbarModule
  ],
  templateUrl: './editar.html',
  styleUrl: './editar.css',
})
export class Editar implements OnInit, OnDestroy {
  private solicitudesService = inject(Solicitudes);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  editarForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    prioridad: ['Media', Validators.required],
    estado: ['Nuevo', Validators.required]
  });

  id: number = 0;
  solicitanteId: number = 0;
  usuarioActualId: number = 0;
  esOperador: boolean = false;
  
  cargando: boolean = true;
  guardando: boolean = false;

  // Opciones
  prioridades = PRIORIDADES_SOLICITUD;
  estados = ESTADOS_SOLICITUD;

  ngOnInit() {
    this.validarToken();
    this.inicializarUsuario();
    this.cargarSolicitud();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private inicializarUsuario() {
    const rol = sessionStorage.getItem('userRole');
    this.esOperador = rol?.toUpperCase() === 'OPERADOR';
    this.usuarioActualId = this.obtenerIdUsuario();
  }

  private obtenerIdUsuario(): number {
    const userId = sessionStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : 0;
  }

  private validarToken() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.toastService.error('No tienes sesión activa');
      this.router.navigate(['/login']);
    }
  }

  private cargarSolicitud() {
    const idSolicitud = this.extraerIdSolicitud();
    
    if (!this.validarIdSolicitud(idSolicitud)) {
      return;
    }

    this.id = idSolicitud;
    this.solicitudesService.obtenerDetalle(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (solicitud) => this.procesarSolicitudCargada(solicitud),
        error: (error) => this.procesarErrorCarga(error)
      });
  }

  private extraerIdSolicitud(): number {
    return parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
  }

  private validarIdSolicitud(id: number): boolean {
    if (id === 0) {
      this.toastService.error('Solicitud no encontrada');
      this.router.navigate(['/solicitudes']);
      return false;
    }
    return true;
  }

  private procesarSolicitudCargada(solicitud: Solicitud) {
    if (!this.usuarioPuedeEditar(solicitud)) {
      return;
    }

    this.cargando = false;
    this.asignarDatosFormulario(solicitud);
    this.cdr.markForCheck();
  }

  private usuarioPuedeEditar(solicitud: Solicitud): boolean {
    const esSolicitante = solicitud.solicitanteId === this.usuarioActualId;
    
    if (esSolicitante || this.esOperador) {
      return true;
    }

    this.toastService.error('No tienes permiso para editar esta solicitud');
    this.router.navigate(['/solicitudes']);
    return false;
  }

  private asignarDatosFormulario(solicitud: Solicitud) {
    this.solicitanteId = solicitud.solicitanteId;
    this.editarForm.patchValue({
      titulo: solicitud.titulo,
      descripcion: solicitud.descripcion,
      prioridad: solicitud.prioridad,
      estado: solicitud.estado
    });
  }

  private procesarErrorCarga(error: any) {
    this.cargando = false;
    console.error('Error al cargar solicitud:', error);
    const mensaje = this.obtenerMensajeErrorCarga(error);
    this.toastService.error(mensaje);
    this.router.navigate(['/solicitudes']);
  }

  private obtenerMensajeErrorCarga(error: any): string {
    const statusCode = error.status || 'unknown';
    return HTTP_ERROR_MESSAGES[statusCode] || DEFAULT_ERROR;
  }

  guardarCambios() {
    if (this.editarForm.invalid) {
      this.toastService.error('Todos los campos son requeridos y válidos');
      return;
    }

    this.guardando = true;
    const solicitudActualizada = this.construirSolicitudActualizada();

    this.solicitudesService.editar(this.id, solicitudActualizada)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.procesarGuardoExitoso(),
        error: (error) => this.procesarErrorGuardo(error)
      });
  }

  private construirSolicitudActualizada() {
    const { titulo, descripcion, prioridad, estado } = this.editarForm.value;
    return {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      prioridad,
      estado
    };
  }

  private procesarGuardoExitoso() {
    this.guardando = false;
    this.cdr.markForCheck();
    this.toastService.exito('¡Solicitud actualizada correctamente!');
    
    setTimeout(() => {
      this.router.navigate(['/solicitudes']);
    }, 1500);
  }

  private procesarErrorGuardo(error: any) {
    this.guardando = false;
    this.cdr.markForCheck();
    console.error('Error al actualizar solicitud:', error);

    const mensaje = this.obtenerMensajeErrorGuardo(error);
    this.toastService.error(mensaje);
  }

  private obtenerMensajeErrorGuardo(error: any): string {
    const statusCode = error.status || 'unknown';
    return HTTP_ERROR_MESSAGES[statusCode] || DEFAULT_ERROR;
  }

  hasError(fieldName: string, errorType: string): boolean {
    return this.editarForm.get(fieldName)?.hasError(errorType) ?? false;
  }

  cancelar() {
    this.router.navigate(['/solicitudes']);
  }
}
