package com.AMDevs.inge2.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.UsuarioRepository;

@Service
public class UsuarioService implements UserDetailsService{


    private final UsuarioRepository usuarioRepository ;
    public UsuarioService (UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
        public Usuario buscarPorId (Long id) {
            return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado : "+ email));
    }
}