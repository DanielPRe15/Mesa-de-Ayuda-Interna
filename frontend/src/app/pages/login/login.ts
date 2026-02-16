import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { LoginResponse } from '../../models/loginResponse';
import { HTTP_ERROR_MESSAGES, DEFAULT_ERROR } from '../../shared/constants/error.constants';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
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
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  private authService = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  cargando: boolean = false;
  mostrarPassword: boolean = false;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasError(fieldName: string, errorType: string): boolean {
    return this.loginForm.get(fieldName)?.hasError(errorType) ?? false;
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastService.error('Por favor completa todos los campos correctamente');
      return;
    }

    this.cargando = true;
    const { correo, password } = this.loginForm.value;

    this.authService.login({ correo, password })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleLoginSuccess(response),
        error: (error) => this.handleLoginError(error)
      });
  }

  private handleLoginSuccess(response: LoginResponse): void {
    this.cargando = false;

    if (!this.isValidResponse(response)) {
      this.toastService.error('Respuesta inválida del servidor');
      return;
    }

    this.guardarSesion(response);
    this.toastService.exito(`¡Bienvenido ${response.nombreCompleto}!`);
    this.router.navigate(['/solicitudes']);
  }

  private handleLoginError(error: any): void {
    this.cargando = false;
    console.error('Error en login:', error);

    const mensajeError = this.obtenerMensajeError(error);
    this.toastService.error(mensajeError);
  }

  private isValidResponse(response: LoginResponse): boolean {
    return response && !!response.token && !!response.idUsuario;
  }

  private guardarSesion(response: LoginResponse): void {
    sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('userId', response.idUsuario.toString());
    sessionStorage.setItem('userName', response.nombreCompleto);
    sessionStorage.setItem('userRole', response.rol);
  }

  private obtenerMensajeError(error: any): string {
    return HTTP_ERROR_MESSAGES[error.status] || DEFAULT_ERROR;
  }

  registrar() {
    this.router.navigate(['/register']);
  }

}

  


