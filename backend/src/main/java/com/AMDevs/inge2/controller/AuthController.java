package com.AMDevs.inge2.controller;

import com.AMDevs.inge2.dto.UsuarioDTO;
import com.AMDevs.inge2.entity.RolUsuarios;
import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.TurnoRepository;
import com.AMDevs.inge2.repository.UsuarioRepository;
import com.AMDevs.inge2.service.JwtService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.security.core.Authentication;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;


import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Map<String, PendingLogin> pendingLogins =
            new ConcurrentHashMap<>();

    @Autowired
    private UsuarioRepository repo;

    @Autowired
    private TurnoRepository turnoRepository;

    //@Autowired
    //private JavaMailSender mailSender;
    
    @Autowired 
    private JwtService jwtService;
    private final SecureRandom random = new SecureRandom();
        private UsuarioDTO mapToDTO(Usuario user) {
        return new UsuarioDTO(
                user.getId(),
                user.getNombre(),
                user.getApellido(),
                user.getEmail(),
                user.getRol(),
                user.getDni(),
                user.getFechaNacimiento()
        );
        }
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> body
    ) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email requerido"));
        }
        try {
            String token = generateToken();
            System.out.println("Generated token for " + email + ": " + token);
            pendingLogins.put(
                    email,
                    new PendingLogin(email,token,Instant.now().plus(30, ChronoUnit.SECONDS))
            );
            sendTokenEmail(email, token);
            return ResponseEntity.ok(
                    Map.of("email", email)
            );
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message","No se pudo enviar el token")
                    );
        }
    }

    @PostMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String token = body.get("token");
        if (email == null || token == null) {
            return ResponseEntity.badRequest()
                    .body(
                            Map.of("message", "Email y token son obligatorios")
                    );
        }
        PendingLogin pending = pendingLogins.get(email);
        if (pending == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of("message","No hay login pendiente")
                    );
        }

        if (Instant.now().isAfter(pending.expiresAt())) {
            pendingLogins.remove(email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of("message","Token expirado")
                    );
        }
        if (!token.equals(pending.token())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of("message","Token invalido")
                    );
        }
        Optional<Usuario> userOpt =
                repo.findByEmail(email);
        if (userOpt.isEmpty()) {
            pendingLogins.remove(email);
            return ResponseEntity.ok(
                    Map.of("registered", false,"email", email)
            );
        }
        Usuario user = userOpt.get();
        pendingLogins.remove(email);
        if ("desactivada".equals(user.getEstado())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Error al iniciar sesión. La cuenta fue desactivada."));
        }
        String jwt = jwtService.generateToken(user);
        return ResponseEntity.ok(Map.of(
                "token", jwt,
                "user", mapToDTO(user)
        ));
    }

    @PostMapping("/complete-registration")
    public ResponseEntity<?> completeRegistration(@RequestBody Usuario user) {
        try {
            Optional<Usuario> existing =
                    repo.findByEmail(user.getEmail());
            if (existing.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message","El usuario ya existe"));
            }
            user.setRol(RolUsuarios.ROLE_PACIENTE);
            user.setEstado("activa");
            Usuario saved = repo.save(user);
            String jwt = jwtService.generateToken(saved);
            return ResponseEntity.ok(Map.of("token", jwt, "user", mapToDTO(saved)));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message","Error al registrar usuario"));
        }
    }

    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam String q) {
        if (q == null || q.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ingrese un término de búsqueda"));
        }
        List<Usuario> results = repo.findByEmailContainingIgnoreCaseAndRolNotAndEstadoNot(q, RolUsuarios.ROLE_ADMIN, "desactivada");
        return ResponseEntity.ok(results);
    }

    @GetMapping("/users/profesionales")
    public ResponseEntity<?> getProfesionales() {
        List<Usuario> profesionales = repo.findByRolAndEstadoNot(RolUsuarios.ROLE_PROFESIONALES, "desactivada");
        return ResponseEntity.ok(profesionales);
    }

    @GetMapping("/users/employees")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Usuario>> listEmployees() {
        List<Usuario> employees = repo.findByRolInAndEstadoNotOrderByApellidoAscNombreAsc(
                List.of(RolUsuarios.ROLE_PROFESIONALES, RolUsuarios.ROLE_SECRETARIA),
                "desactivada"
        );
        return ResponseEntity.ok(employees);
    }

    @PutMapping("/users")
    public ResponseEntity<?> updateUser(
            @RequestBody UserUpdateRequest body,
            HttpSession session
    ) {

        Optional<Usuario> userOpt =
                repo.findByEmail(body.email());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of("message","Usuario no encontrado")
                    );
        }
        Usuario user = userOpt.get();
        user.setNombre(body.nombre());
        user.setApellido(body.apellido());
        user.setDni(body.dni());
        if (body.fechaNacimiento() != null) user.setFechaNacimiento(body.fechaNacimiento());
        if (body.rol() != null) user.setRol(RolUsuarios.valueOf(body.rol()));
        Usuario saved = repo.save(user);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/users/estado")
    public ResponseEntity<?> updateUserEstado(@RequestBody UserEstadoRequest body) {
        Optional<Usuario> userOpt = repo.findByEmail(body.email());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuario no encontrado"));
        }
        Usuario user = userOpt.get();
        if ("desactivada".equals(body.estado()) && turnoRepository.existsTurnoActivoParaUsuario(user)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "No se puede desactivar: el usuario tiene turnos o rutinas pendientes"));
        }
        user.setEstado(body.estado());
        Usuario saved = repo.save(user);
        return ResponseEntity.ok(saved);
    }


    @PatchMapping("/users/{id}/role")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateUserRole(
            @PathVariable("id") Long id,
            @RequestBody RoleUpdateRequest body
    ) {
        Usuario user = repo.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuario no encontrado"));
        }
        if (body.rol() == null || body.rol().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "El rol es obligatorio"));
        }

        try {
            RolUsuarios newRole = RolUsuarios.valueOf(body.rol());
            if (newRole == RolUsuarios.ROLE_ADMIN) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "No se puede asignar el rol Administrador"));
            }
            user.setRol(newRole);
            return ResponseEntity.ok(repo.save(user));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Rol no valido"));
        }
    }

    @PatchMapping("/users/{id}/desactivar")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable("id") Long id) {
        return desactivarUsuarioPorId(id);
    }

    @PatchMapping("/users/me/desactivar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deactivateOwnAccount(Authentication authentication) {
        Usuario usuarioAutenticado = (Usuario) authentication.getPrincipal();
        return desactivarUsuarioPorId(usuarioAutenticado.getId());
    }

    private ResponseEntity<?> desactivarUsuarioPorId(Long id) {
        Usuario user = repo.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuario no encontrado"));
        }
        if (user.getRol() == RolUsuarios.ROLE_ADMIN) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "No se puede desactivar un administrador"));
        }
        if (turnoRepository.existsTurnoActivoParaUsuario(user)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "No se puede desactivar al usuario porque tiene turnos activos."));
        }

        user.setEstado("desactivada");
        return ResponseEntity.ok(repo.save(user));
    }
    private String generateToken() {
        return String.format(
                "%06d",
                random.nextInt(1_000_000)
        );
    }
    private void sendTokenEmail(
            String email,
            String token
    ) {
        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);
        message.setSubject(
                "Tu token de acceso"
        );
        message.setText(
                "Tu token es: " + token + " (expira en 30 segundos)"
        );
        //mailSender.send(message);
    }
    private record UserUpdateRequest(
            String nombre,
            String apellido,
            Integer dni,
            java.time.LocalDate fechaNacimiento,
            String email,
            String rol
    ) {}
    private record UserEstadoRequest(
            String email,
            String estado
    ) {}
    private record RoleUpdateRequest(String rol) {}
    private record PendingLogin(
            String email,
            String token,
            Instant expiresAt
    ) {}
}
