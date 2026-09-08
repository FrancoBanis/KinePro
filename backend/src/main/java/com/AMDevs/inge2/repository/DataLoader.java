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
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {

        if (usuarioRepository.count() == 0) {
            // 
            Usuario u1 = new Usuario("ADMIN", "ADMIN", "admin@email.com", LocalDate.of(2008, 1, 1), 111111, RolUsuarios.ROLE_ADMIN);
            Usuario u2 = new Usuario("PROFESIONAL", "PROFESIONAL", "profesional@email.com", LocalDate.of(2000, 1, 1), 111111, RolUsuarios.ROLE_PROFESIONALES);
            Usuario u3 = new Usuario("SECRETARIA", "SECRETARIA", "secretaria@email.com", LocalDate.of(2000, 1, 1), 111111, RolUsuarios.ROLE_SECRETARIA);
            Usuario u4 = new Usuario("PACIENTE", "PACIENTE", "paciente@email.com", LocalDate.of(2000, 1, 1), 111111, RolUsuarios.ROLE_PACIENTE);            
            usuarioRepository.saveAll(List.of(u1, u2, u3, u4));
            System.out.println(">> [DataLoader] Usuarios de prueba inicializados correctamente.");
        } else {
            System.out.println(">> [DataLoader] La tabla 'usuario' ya contiene registros. Omitiendo inicialización.");
        }
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