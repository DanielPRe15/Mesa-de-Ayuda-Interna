package com.innovationlab.mesaayuda.backend.controllers;

import com.innovationlab.mesaayuda.backend.dto.SolicitudDTO;
import com.innovationlab.mesaayuda.backend.dto.CambiarEstadoRequest;
import com.innovationlab.mesaayuda.backend.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    @PostMapping
    @PreAuthorize("hasRole('USUARIO') or hasRole('OPERADOR')")
    public ResponseEntity<SolicitudDTO> crear(@Valid @RequestBody SolicitudDTO solicitudDTO) {
        SolicitudDTO solicitudCreada = solicitudService.crearSolicitud(solicitudDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitudCreada);
    }

    @GetMapping
    @PreAuthorize("hasRole('USUARIO') or hasRole('OPERADOR')")
    public ResponseEntity<List<SolicitudDTO>> listar(Authentication authentication) {
        List<SolicitudDTO> solicitudes = solicitudService.listarTodas();
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/filtrar")
    @PreAuthorize("hasRole('USUARIO') or hasRole('OPERADOR')")
    public ResponseEntity<Page<SolicitudDTO>> filtrar(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String prioridad,
            @RequestParam(required = false) LocalDate fechaInicio,
            @RequestParam(required = false) LocalDate fechaFin,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SolicitudDTO> solicitudes = solicitudService.filtrar(
            titulo, estado, prioridad, fechaInicio, fechaFin, pageable
        );
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USUARIO') or hasRole('OPERADOR')")
    public ResponseEntity<SolicitudDTO> obtenerDetalle(@PathVariable Integer id) {
        SolicitudDTO solicitud = solicitudService.obtenerDetalle(id);
        return ResponseEntity.ok(solicitud);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USUARIO') or hasRole('OPERADOR')")
    public ResponseEntity<SolicitudDTO> editar(
            @PathVariable Integer id,
            @Valid @RequestBody SolicitudDTO solicitudDTO,
            Authentication authentication) {
        SolicitudDTO solicitudActualizada = solicitudService.editar(id, solicitudDTO, authentication);
        return ResponseEntity.ok(solicitudActualizada);
    }

    @PatchMapping("/{id}/cambiar-estado")
    @PreAuthorize("hasRole('OPERADOR')")
    public ResponseEntity<SolicitudDTO> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambiarEstadoRequest request) {
        SolicitudDTO solicitudActualizada = solicitudService.cambiarEstado(id, request.getEstado());
        return ResponseEntity.ok(solicitudActualizada);
    }
}
