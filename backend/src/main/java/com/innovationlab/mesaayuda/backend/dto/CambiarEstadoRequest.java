package com.innovationlab.mesaayuda.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CambiarEstadoRequest {
    @NotBlank(message = "El estado es requerido")
    @Pattern(regexp = "^(Resuelto|Cerrado)$", message = "El estado debe ser Resuelto o Cerrado")
    private String estado;
}
