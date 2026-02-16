import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  private defaultConfigError: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: ['toast-error']
  };

  private defaultConfigExito: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: ['toast-exito']
  };

  private defaultConfigInfo: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: ['toast-info']
  };

  private defaultConfigAdvertencia: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: ['toast-advertencia']
  };

  error(mensaje: string, config?: MatSnackBarConfig) {
    this.snackBar.open(mensaje, 'Cerrar', { ...this.defaultConfigError, ...config });
  }

  exito(mensaje: string, config?: MatSnackBarConfig) {
    this.snackBar.open(mensaje, 'Cerrar', { ...this.defaultConfigExito, ...config });
  }

  info(mensaje: string, config?: MatSnackBarConfig) {
    this.snackBar.open(mensaje, 'Cerrar', { ...this.defaultConfigInfo, ...config });
  }

  advertencia(mensaje: string, config?: MatSnackBarConfig) {
    this.snackBar.open(mensaje, 'Cerrar', { ...this.defaultConfigAdvertencia, ...config });
  }
}
