package com.AMDevs.inge2.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @Column(name = "id_rol")
    private RolUsuarios rol;

    private String nombre;

    private String apellido;

    @Column(unique = true)
    private String email;

    private LocalDate fechaNacimiento;

    private Integer dni;

    private String loginToken;

    private Instant tokenExpiresAt;

    private String estado = "activa";

    protected Usuario() {
    }

    public Usuario (String nombre, String apellido, String email, LocalDate fechaNacimiento, int dni, RolUsuarios rol) {
        this.nombre=nombre;
        this.apellido=apellido;
        this.email=email;
        this.fechaNacimiento=fechaNacimiento;
        this.dni=dni;
        this.rol=rol;
    }

    public Usuario (String nombre, String apellido, String email, LocalDate fechaNacimiento, int dni, RolUsuarios rol, String estado) {
        this.nombre=nombre;
        this.apellido=apellido;
        this.email=email;
        this.fechaNacimiento=fechaNacimiento;
        this.dni=dni;
        this.rol=rol;
        this.estado=estado;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(rol.name()));
    }
    @Override
    public String getPassword() {
        return null;
    }
    @Override
    public String getUsername() {
        return email;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return "activa".equals(estado);
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RolUsuarios getRol() {
        return rol;
    }

    public void setRol(RolUsuarios rol) {
        this.rol = rol; 
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public Integer getDni() {
        return dni;
    }

    public void setDni(Integer dni) {
        this.dni = dni;
    }

    public String getLoginToken() {
        return loginToken;
    }

    public void setLoginToken(String loginToken) {
        this.loginToken = loginToken;
    }

    public Instant getTokenExpiresAt() {
        return tokenExpiresAt;
    }

    public void setTokenExpiresAt(Instant tokenExpiresAt) {
        this.tokenExpiresAt = tokenExpiresAt;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}