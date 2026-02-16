import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-cambio-estado',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-icon">
        <mat-icon *ngIf="data.estado === 'Resuelto'">check_circle</mat-icon>
        <mat-icon *ngIf="data.estado === 'Cerrado'">close</mat-icon>
      </div>
      <h2>¿Cambiar estado a <strong>{{ data.estado }}</strong>?</h2>
      <p>Esta acción no se puede deshacer.</p>
      <div class="dialog-actions">
        <button mat-stroked-button (click)="cancelar()">Cancelar</button>
        <button mat-raised-button [color]="data.estado === 'Resuelto' ? 'accent' : 'warn'" (click)="confirmar()">
          Confirmar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      text-align: center;
      padding: 20px;
    }
    .dialog-icon {
      margin: 20px 0;
    }
    .dialog-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #667eea;
    }
    h2 {
      margin: 20px 0 10px;
    }
    p {
      color: #999;
      margin: 0 0 20px;
    }
    .dialog-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }
  `]
})
export class ConfirmarCambioEstadoDialog {
  constructor(
    private dialogRef: MatDialogRef<ConfirmarCambioEstadoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { estado: string }
  ) {}

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
