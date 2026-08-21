package com.AMDevs.inge2.repository;

import com.AMDevs.inge2.entity.RolUsuarios;
import com.AMDevs.inge2.entity.TipoRutina;
import com.AMDevs.inge2.entity.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private TipoRutinaRepository tipoRutinaRepository;
    @Autowired
    private RutinaRepository rutinaRepository;
    @Autowired
    private TurnoRepository turnoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {

        // 1. Sembrado de Usuarios (Solo si la tabla está vacía)
        if (usuarioRepository.count() == 0) {
            Usuario u3 = new Usuario("felix", "alcaraz", "felix70x@hotmail.com", LocalDate.of(2008, 1, 1), 45928421, RolUsuarios.ROLE_ADMIN);
            Usuario u4 = new Usuario("Franco", "Banis", "franco.banis0@gmail.com", LocalDate.of(1950, 1, 1), 44444444, RolUsuarios.ROLE_ADMIN);
            Usuario u5 = new Usuario("Santiago", "Almada", "santiagoalmada111@hotmail.com", LocalDate.of(2001, 1, 1), 45928421, RolUsuarios.ROLE_SECRETARIA);
            Usuario u6 = new Usuario("Tomas", "Ressia", "ressiagf@gmail.com", LocalDate.of(1950, 1, 1), 42244444, RolUsuarios.ROLE_PROFESIONALES);
            Usuario u7 = new Usuario("Franco", "Banis", "franbsso123@gmail.com", LocalDate.of(1950, 1, 1), 44444444, RolUsuarios.ROLE_ADMIN);
            
            usuarioRepository.saveAll(List.of(u3, u4, u5, u6, u7));
            System.out.println(">> [DataLoader] Usuarios de prueba inicializados correctamente.");
        } else {
            System.out.println(">> [DataLoader] La tabla 'usuario' ya contiene registros. Omitiendo inicialización.");
        }

        // 2. Sembrado de Tipos de Rutina (Solo si la tabla está vacía)
        if (tipoRutinaRepository.count() == 0) {
            TipoRutina tipo1 = new TipoRutina("Fuerza", "Ejercicios fuerza");
            TipoRutina tipo2 = new TipoRutina("Cardio", "Ejercicios para bienestar cardiovascular");
            TipoRutina tipo3 = new TipoRutina("Relajacion", "Ejercicios de relajacion");
            
            tipoRutinaRepository.saveAll(List.of(tipo1, tipo2, tipo3));
            System.out.println(">> [DataLoader] Tipos de rutina inicializados correctamente.");
        } else {
            System.out.println(">> [DataLoader] La tabla 'tipo_rutina' ya contiene registros. Omitiendo inicialización.");
        }
    }
}