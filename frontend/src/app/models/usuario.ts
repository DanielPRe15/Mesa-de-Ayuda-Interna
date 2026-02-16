export interface Usuario {

    idUsuario: number;
    nombreCompleto: string;
    correo: string;
    password: string;
    activo: boolean;
    fechaRegistro: Date;
    rolId: number;
}