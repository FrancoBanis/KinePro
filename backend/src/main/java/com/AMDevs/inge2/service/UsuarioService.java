package com.AMDevs.inge2.service;

import org.springframework.stereotype.Service;

import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.UsuarioRepository;

@Service
public class UsuarioService {


    private final UsuarioRepository usuarioRepository ;
    public UsuarioService (UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
        public Usuario buscarPorId (Long id) {
            return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
}