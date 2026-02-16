package com.innovationlab.mesaayuda.backend.repository;

import com.innovationlab.mesaayuda.backend.entity.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {
    List<Solicitud> findByEstadoAndPrioridad(String estado, String prioridad);
}
