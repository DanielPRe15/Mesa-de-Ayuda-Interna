package com.innovationlab.mesaayuda.backend.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Roles")
@Data
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRol;

    @Column(name = "NombreRol", nullable = false, length = 20)
    private String nombreRol;
}