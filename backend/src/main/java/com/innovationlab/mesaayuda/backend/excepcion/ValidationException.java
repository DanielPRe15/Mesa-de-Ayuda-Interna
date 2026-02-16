package com.innovationlab.mesaayuda.backend.excepcion;

public class ValidationException extends RuntimeException {
    public ValidationException(String mensaje) {
        super(mensaje);
    }
}
