package com.innovationlab.mesaayuda.backend.service;

import com.innovationlab.mesaayuda.backend.dto.AuthResponse;
import com.innovationlab.mesaayuda.backend.dto.LoginRequest;
import com.innovationlab.mesaayuda.backend.dto.RegisterRequest;
import com.innovationlab.mesaayuda.backend.entity.Rol;
import com.innovationlab.mesaayuda.backend.entity.Usuario;
import com.innovationlab.mesaayuda.backend.excepcion.ResourceNotFoundException;
import com.innovationlab.mesaayuda.backend.excepcion.ValidationException;
import com.innovationlab.mesaayuda.backend.repository.RolRepository;
import com.innovationlab.mesaayuda.backend.repository.UsuarioRepository;
import com.innovationlab.mesaayuda.backend.security.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        Usuario user = usuarioRepository.findByCorreo(request.getCorreo())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!user.getActivo()) {
            throw new ValidationException("El usuario está inactivo");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ValidationException("Contraseña incorrecta");
        }

        return generarResponseAutenticacion(user, "Login exitoso");
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new ValidationException("El correo ya está registrado");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombreCompleto(request.getNombreCompleto());
        nuevoUsuario.setCorreo(request.getCorreo());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        nuevoUsuario.setActivo(true);

        if (request.getIdRol() != null) {
            Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
            nuevoUsuario.setRol(rol);
        }

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        return generarResponseAutenticacion(usuarioGuardado, "Registro exitoso");
    }

    private AuthResponse generarResponseAutenticacion(Usuario usuario, String mensaje) {
        String nombreRol = extraerNombreRol(usuario);
        
        String token = jwtService.generateToken(
            usuario.getCorreo(),
            usuario.getIdUsuario(),
            nombreRol
        );

        return new AuthResponse(
            token,
            mensaje,
            usuario.getIdUsuario(),
            usuario.getNombreCompleto(),
            usuario.getCorreo(),
            nombreRol
        );
    }

    private String extraerNombreRol(Usuario usuario) {
        return usuario.getRol() != null ? usuario.getRol().getNombreRol() : "Usuario";
    }
}
