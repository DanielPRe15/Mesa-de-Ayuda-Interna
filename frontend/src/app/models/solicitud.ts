export interface Solicitud {
    idSolicitud: number;
    titulo: string;
    descripcion: string;
    prioridad: string;
    estado: string;
    solicitanteId: number;
    solicitanteNombre?: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
