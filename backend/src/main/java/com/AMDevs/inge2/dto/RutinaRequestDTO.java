package com.AMDevs.inge2.dto;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

public class RutinaRequestDTO {
    private String nombre;
    private Long tipoRutinaId;
    private String nombresDeProfesionales;
    private DayOfWeek diaSemana;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private Integer cupoMaxPacientesPorTurno;
    private Integer cupoMaxRutina;
    private Boolean activa;
    private Double costoPorTurno;

    public RutinaRequestDTO() {}

    public RutinaRequestDTO(String nombre, Long tipoRutinaId, String nombresDeProfesionales, DayOfWeek diaSemana,
            LocalDate fechaInicio, LocalDate fechaFin, LocalTime horaInicio, LocalTime horaFin,
            Integer cupoMaxPacientesPorTurno, Integer cupoMaxRutina, Boolean activa, Double costoPorTurno) {
        this.nombre = nombre;
        this.tipoRutinaId = tipoRutinaId;
        this.nombresDeProfesionales = nombresDeProfesionales;
        this.diaSemana = diaSemana;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.cupoMaxPacientesPorTurno = cupoMaxPacientesPorTurno;
        this.cupoMaxRutina = cupoMaxRutina;
        this.activa = activa;
        this.costoPorTurno = costoPorTurno;
    }

    public String getNombre() {
        return nombre;
    }
 
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
 
    public Long getTipoRutinaId() {
        return tipoRutinaId;
    }
 
    public void setTipoRutinaId(Long tipoRutinaId) {
        this.tipoRutinaId = tipoRutinaId;
    }
 
    public String getNombresDeProfesionales() {
        return nombresDeProfesionales;
    }
 
    public void setNombresDeProfesionales(String nombresDeProfesionales) {
        this.nombresDeProfesionales = nombresDeProfesionales;
    }
 
    public DayOfWeek getDiaSemana() {
        return diaSemana;
    }
 
    public void setDiaSemana(DayOfWeek diaSemana) {
        this.diaSemana = diaSemana;
    }
 
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
 
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
 
    public LocalDate getFechaFin() {
        return fechaFin;
    }
 
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
 
    public LocalTime getHoraInicio() {
        return horaInicio;
    }
 
    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }
 
    public LocalTime getHoraFin() {
        return horaFin;
    }
 
    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }
 
    public Integer getCupoMaxPacientesPorTurno() {
        return cupoMaxPacientesPorTurno;
    }
 
    public void setCupoMaxPacientesPorTurno(Integer cupoMaxPacientesPorTurno) {
        this.cupoMaxPacientesPorTurno = cupoMaxPacientesPorTurno;
    }

    public Integer getCupoMaxRutina() {
        return cupoMaxRutina;
    }

    public void setCupoMaxRutina(Integer cupoMaxRutina) {
        this.cupoMaxRutina = cupoMaxRutina;
    }

    public Boolean getActiva() {
        return activa;
    }
 
    public void setActiva(Boolean activa) {
        this.activa = activa;
    }
 
    public Double getCostoPorTurno() {
        return costoPorTurno;
    }
 
    public void setCostoPorTurno(Double costoPorTurno) {
        this.costoPorTurno = costoPorTurno;
    }

}
