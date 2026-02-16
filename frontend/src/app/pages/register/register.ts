import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { RegisterResponse } from '../../models/registerResponse';
import { HTTP_ERROR_MESSAGES, DEFAULT_ERROR } from '../../shared/constants/error.constants';
import { Rol } from '../../models/rol';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnDestroy {

  private authService = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  registerForm: FormGroup = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmarPassword: ['', Validators.required],
    idRol: [1, Validators.required]
  }, { validators: this.passwordMatchValidator });

  cargando: boolean = false;
  mostrarPassword: boolean = false;
  mostrarConfirmarPassword: boolean = false;

  roles: Rol[] = [
    { id: 1, nombre: 'Usuario' },
    { id: 2, nombre: 'Operador' }
  ];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasError(fieldName: string, errorType: string): boolean {
    return this.registerForm.get(fieldName)?.hasError(errorType) ?? false;
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmarPassword = control.get('confirmarPassword')?.value;

    if (!password || !confirmarPassword) {
      return null;
    }

    return password === confirmarPassword ? null : { passwordMismatch: true };
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleMostrarConfirmarPassword() {
    this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
  }

  register() {
    if (this.registerForm.invalid) {
      this.toastService.error('Por favor completa todos los campos correctamente');
      return;
    }

    if (this.registerForm.hasError('passwordMismatch')) {
      this.toastService.error('Las contraseñas no coinciden');
      return;
    }

    this.cargando = true;
    const registerData = this.registerForm.value;

    this.authService.register(registerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleRegisterSuccess(response),
        error: (error) => this.handleRegisterError(error)
      });
  }

  private handleRegisterSuccess(response: RegisterResponse): void {
    this.cargando = false;

    if (!this.isValidResponse(response)) {
      this.toastService.error('Respuesta inválida del servidor');
      return;
    }

    this.guardarSesion(response);
    this.toastService.exito('¡Cuenta creada exitosamente! Por favor inicia sesión con tus credenciales.');
    this.router.navigate(['/login']);
  }

  private handleRegisterError(error: any): void {
    this.cargando = false;
    console.error('Error en registro:', error);

    const mensajeError = this.obtenerMensajeErrorRegistro(error);
    this.toastService.error(mensajeError);
  }

  private isValidResponse(response: RegisterResponse): boolean {
    return response && !!response.token;
  }

  private guardarSesion(response: RegisterResponse): void {
    sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('userId', response.idUsuario?.toString() || '');
    sessionStorage.setItem('userName', response.nombreCompleto || '');
    sessionStorage.setItem('userRole', response.rol || '');
  }

  private obtenerMensajeErrorRegistro(error: any): string {
    if (error.error?.mensaje) {
      return error.error.mensaje;
    }
    return HTTP_ERROR_MESSAGES[error.status] || DEFAULT_ERROR;
  }

  volver() {
    this.router.navigate(['/login']);
  }
}
