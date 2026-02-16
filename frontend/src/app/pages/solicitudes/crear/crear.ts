import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Solicitudes } from '../../../services/solicitudes';
import { ToastService } from '../../../services/toast';
import { HTTP_ERROR_MESSAGES, DEFAULT_ERROR } from '../../../shared/constants/error.constants';
import { ESTADOS_SOLICITUD, PRIORIDADES_SOLICITUD } from '../../../shared/constants/solicitud.constants';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-crear',
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
  templateUrl: './crear.html',
  styleUrl: './crear.css',
})
export class Crear implements OnDestroy {
  
  private solicitudesService = inject(Solicitudes);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  crearForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    prioridad: ['Media', Validators.required],
    estado: ['Nuevo', Validators.required]
  });

  cargando: boolean = false;

  // Opciones
  prioridades = PRIORIDADES_SOLICITUD;
  estados = ESTADOS_SOLICITUD;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasError(fieldName: string, errorType: string): boolean {
    return this.crearForm.get(fieldName)?.hasError(errorType) ?? false;
  }

  crearSolicitud() {
    if (this.crearForm.invalid) {
      this.toastService.error('Todos los campos son requeridos y válidos');
      return;
    }

    this.cargando = true;

    const { titulo, descripcion, prioridad, estado } = this.crearForm.value;
    const solicitanteId = sessionStorage.getItem('userId');

    if (!solicitanteId) {
      this.toastService.error('Usuario no identificado');
      this.cargando = false;
      return;
    }

    const nuevaSolicitud = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      prioridad,
      estado,
      solicitanteId: parseInt(solicitanteId, 10)
    };

    this.solicitudesService.crear(nuevaSolicitud)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleCreateSuccess(response),
        error: (error) => this.handleCreateError(error)
      });
  }

  private handleCreateSuccess(response: any) {
    this.cargando = false;
    this.toastService.exito('Solicitud creada exitosamente');
    this.router.navigate(['/solicitudes']);
  }

  private handleCreateError(error: any) {
    this.cargando = false;
    const mensaje = this.obtenerMensajeError(error);
    this.toastService.error(mensaje);
  }

  private obtenerMensajeError(error: any): string {
    const statusCode = error.status || 0;
    return HTTP_ERROR_MESSAGES[statusCode] || DEFAULT_ERROR;
  }

  cancelar() {
    this.router.navigate(['/solicitudes']);
  }
}
