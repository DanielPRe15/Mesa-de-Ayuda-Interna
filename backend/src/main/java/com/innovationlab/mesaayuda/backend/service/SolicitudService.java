package com.innovationlab.mesaayuda.backend.service;

import com.innovationlab.mesaayuda.backend.dto.SolicitudDTO;
import com.innovationlab.mesaayuda.backend.entity.Solicitud;
import com.innovationlab.mesaayuda.backend.entity.Usuario;
import com.innovationlab.mesaayuda.backend.enums.Estado;
import com.innovationlab.mesaayuda.backend.excepcion.ResourceNotFoundException;
import com.innovationlab.mesaayuda.backend.repository.SolicitudRepository;
import com.innovationlab.mesaayuda.backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Crear una nueva solicitud
    public SolicitudDTO crearSolicitud(SolicitudDTO solicitudDTO) {
        // Las validaciones y trim se hacen automáticamente en el controller con @Valid y @Trimmed
        Solicitud solicitud = new Solicitud();
        solicitud.setTitulo(solicitudDTO.getTitulo());
        solicitud.setDescripcion(solicitudDTO.getDescripcion());
        solicitud.setPrioridad(solicitudDTO.getPrioridad());
        solicitud.setEstado("Nuevo");

        Usuario usuario = usuarioRepository.findById(solicitudDTO.getSolicitanteId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + solicitudDTO.getSolicitanteId() + " no encontrado"));
        solicitud.setSolicitante(usuario);

        Solicitud solicitudGuardada = solicitudRepository.save(solicitud);
        return convertirADTO(solicitudGuardada);
    }

    // Listar todas las solicitudes
    public List<SolicitudDTO> listarTodas() {
        return solicitudRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener detalle de una solicitud por ID
    public SolicitudDTO obtenerDetalle(Integer id) {
        return solicitudRepository.findById(id)
                .map(this::convertirADTO)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud con ID " + id + " no encontrada"));
    }

    // Editar una solicitud existente
    public SolicitudDTO editar(Integer id, SolicitudDTO solicitudDTO, Authentication authentication) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud con ID " + id + " no encontrada"));

        boolean esOperador = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_OPERADOR"));

        if (!esOperador) {
            String usuarioActual = authentication.getName();
            Usuario usuarioActualEntity = usuarioRepository.findByCorreo(usuarioActual)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            Integer solicitanteId = solicitud.getSolicitante().getIdUsuario();
            
            if (!solicitanteId.equals(usuarioActualEntity.getIdUsuario())) {
                throw new AccessDeniedException("No tienes permiso para editar esta solicitud");
            }
        }

        if (solicitudDTO.getTitulo() != null) {
            solicitud.setTitulo(solicitudDTO.getTitulo());
        }
        if (solicitudDTO.getDescripcion() != null) {
            solicitud.setDescripcion(solicitudDTO.getDescripcion());
        }
        if (solicitudDTO.getPrioridad() != null) {
            solicitud.setPrioridad(solicitudDTO.getPrioridad());
        }
        
        Solicitud actualizada = solicitudRepository.save(solicitud);
        return convertirADTO(actualizada);
    }

    // Cambiar el estado de una solicitud
    public SolicitudDTO cambiarEstado(Integer id, String nuevoEstado) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud con ID " + id + " no encontrada"));

        Estado.validarCambioDeEstado(solicitud.getEstado(), nuevoEstado);

        solicitud.setEstado(nuevoEstado);
        Solicitud actualizada = solicitudRepository.save(solicitud);
        return convertirADTO(actualizada);
    }


    public Page<SolicitudDTO> filtrar(String titulo, String estado, String prioridad, 
                                      LocalDate fechaInicio, LocalDate fechaFin, Pageable pageable) {
        
        List<SolicitudDTO> solicitudes = solicitudRepository.findAll()
                .stream()
                .filter(s -> titulo == null || s.getTitulo().toLowerCase().contains(titulo.toLowerCase()))
                .filter(s -> estado == null || s.getEstado().equals(estado))
                .filter(s -> prioridad == null || s.getPrioridad().equals(prioridad))
                .filter(s -> fechaInicio == null || !s.getFechaCreacion().toLocalDate().isBefore(fechaInicio))
                .filter(s -> fechaFin == null || !s.getFechaCreacion().toLocalDate().isAfter(fechaFin))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        
        // Aplicar paginación manual
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), solicitudes.size());
        
        List<SolicitudDTO> pageContent = solicitudes.subList(start, end);
        return new PageImpl<>(pageContent, pageable, solicitudes.size());
    }

    // Convertir entidad a DTO
    private SolicitudDTO convertirADTO(Solicitud solicitud) {
        SolicitudDTO dto = new SolicitudDTO();
        dto.setIdSolicitud(solicitud.getIdSolicitud());
        dto.setTitulo(solicitud.getTitulo());
        dto.setDescripcion(solicitud.getDescripcion());
        dto.setPrioridad(solicitud.getPrioridad());
        dto.setEstado(solicitud.getEstado());
        if (solicitud.getSolicitante() != null) {
            dto.setSolicitanteId(solicitud.getSolicitante().getIdUsuario());
            dto.setSolicitanteNombre(solicitud.getSolicitante().getNombreCompleto());
        }
        dto.setFechaCreacion(solicitud.getFechaCreacion());
        dto.setFechaActualizacion(solicitud.getFechaActualizacion());
        return dto;
    }
}
