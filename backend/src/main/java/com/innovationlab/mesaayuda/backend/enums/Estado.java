package com.innovationlab.mesaayuda.backend.enums;

import com.innovationlab.mesaayuda.backend.excepcion.ValidationException;

public enum Estado {
    NUEVO("Nuevo"),
    EN_PROCESO("En Progreso"),
    RESUELTO("Resuelto"),
    CERRADO("Cerrado");

    private final String valor;

    Estado(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static void validarCambioDeEstado(String estadoActual, String nuevoEstado) {
    if (Estado.CERRADO.getValor().equals(estadoActual)) {
        throw new ValidationException("No se puede cambiar el estado de una solicitud cerrada");
        }
    }
}
