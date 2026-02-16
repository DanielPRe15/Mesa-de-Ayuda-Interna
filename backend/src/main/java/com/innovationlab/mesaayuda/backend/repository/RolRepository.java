package com.innovationlab.mesaayuda.backend.repository;

import com.innovationlab.mesaayuda.backend.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
}
