package com.AMDevs.inge2.service;

import com.AMDevs.inge2.entity.TipoRutina;
import com.AMDevs.inge2.repository.RutinaRepository;
import com.AMDevs.inge2.repository.TipoRutinaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoRutinaService {

    private final TipoRutinaRepository tipoRutinaRepository;
    private final RutinaRepository rutinaRepository;

    public TipoRutinaService(TipoRutinaRepository tipoRutinaRepository, RutinaRepository rutinaRepository) {
        this.tipoRutinaRepository = tipoRutinaRepository;
        this.rutinaRepository = rutinaRepository;
    }

    public List<TipoRutina> listarTodos() {
        return tipoRutinaRepository.findAll();
    }

    public Optional<TipoRutina> buscarPorId(Long id) {
        return tipoRutinaRepository.findById(id);
    }

    public TipoRutina buscarTipoRutina(Long id) {
        return tipoRutinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de rutina no encontrado " + id));
    }

    public TipoRutina crearTipoRutina(TipoRutina tipoRutina) {
        if (tipoRutinaRepository.existsByNombreIgnoreCase(tipoRutina.getNombre().trim())) {
            throw new RuntimeException("Ya existe un tipo de rutina con ese nombre");
        }
        tipoRutina.setNombre(tipoRutina.getNombre().trim());
        return tipoRutinaRepository.save(tipoRutina);
    }
    

    public TipoRutina modificarTipoRutina(Long id, TipoRutina tipoRutina) {
        TipoRutina existente = buscarTipoRutina(id);
        String nombreNuevo = tipoRutina.getNombre().trim();

        if (tipoRutinaRepository.existsByNombreIgnoreCaseAndIdNot(nombreNuevo,id)) {
            throw new RuntimeException("Ya existe un tipo de rutina con ese nombre");
        }

        existente.setNombre(nombreNuevo);
        existente.setDescripcion(tipoRutina.getDescripcion());
        return tipoRutinaRepository.save(existente);
    }

    public void eliminarTipoRutina(Long id) {
        if (rutinaRepository.existsByTipoIdAndActiva(id,true)) { 
            throw new RuntimeException("No se puede eliminar el tipo de rutina porque tiene rutinas asociadas");
        }
        tipoRutinaRepository.deleteById(id);
    }
}