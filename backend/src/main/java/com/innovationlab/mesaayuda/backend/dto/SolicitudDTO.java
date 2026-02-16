package com.innovationlab.mesaayuda.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudDTO {
    private Integer idSolicitud;
    
    @NotBlank(message = "El título es requerido")
    @Size(min = 5, max = 100, message = "El título debe tener entre 5 y 100 caracteres")
    private String titulo;
    
    @NotBlank(message = "La descripción es requerida")
    @Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
    private String descripcion;
    
    @Pattern(regexp = "^(Alta|Media|Baja)$", message = "La prioridad debe ser Alta, Media o Baja")
    private String prioridad;
    
    private String estado;
    
    private Integer solicitanteId;
    
    private String solicitanteNombre;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
