package com.innovationlab.mesaayuda.backend.enums;

public enum Prioridad {
    ALTA("Alta"),
    MEDIA("Media"),
    BAJA("Baja");

    private final String valor;

    Prioridad(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

}
