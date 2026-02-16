package com.innovationlab.mesaayuda.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Solicitudes")
@Data
public class Solicitud {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSolicitud;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private String prioridad; 

    @Column(nullable = false)
    private String estado = "Nuevo"; 

    @ManyToOne
    @JoinColumn(name = "SolicitanteId")
    private Usuario solicitante;

    private LocalDateTime fechaCreacion; 
    private LocalDateTime fechaActualizacion; 

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}