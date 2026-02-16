export interface LoginResponse {
    token: string;
    mensaje: string;
    idUsuario: number;
    nombreCompleto: string;
    correo: string;
    rol: string;
}