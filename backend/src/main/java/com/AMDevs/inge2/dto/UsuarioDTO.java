package com.AMDevs.inge2.dto;

import com.AMDevs.inge2.entity.RolUsuarios;
import java.time.LocalDate;

public record UsuarioDTO(
    Long id,
    String nombre,
    String apellido,
    String email,
    RolUsuarios rol,
    Integer dni,
    LocalDate fechaNacimiento
) {}