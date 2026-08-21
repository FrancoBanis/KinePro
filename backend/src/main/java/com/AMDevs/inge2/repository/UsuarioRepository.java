package com.AMDevs.inge2.repository;

import com.AMDevs.inge2.entity.RolUsuarios;
import com.AMDevs.inge2.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	Optional<Usuario> findByEmail(String email);
	List<Usuario> findByRol(RolUsuarios rol);
	List<Usuario> findByEmailContainingIgnoreCaseAndRolNotAndEstadoNot(String email, RolUsuarios rol, String estado);
	List<Usuario> findByRolAndEstadoNot(RolUsuarios rol, String estado); 
	List<Usuario> findByRolInAndEstadoNotOrderByApellidoAscNombreAsc(List<RolUsuarios> roles, String estado);
}
