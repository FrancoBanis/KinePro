package com.AMDevs.inge2.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.AMDevs.inge2.service.UsuarioService;


import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.frontend-url}")
    private String frontendUrl;
    private final JwtFilter jwtFilter;
    private final UsuarioService usuarioService;

    public SecurityConfig(JwtFilter jwtFilter, UsuarioService usuarioService) {
        this.jwtFilter = jwtFilter;
        this.usuarioService = usuarioService;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/login", "/api/auth/verify-token", "/api/auth/complete-registration").permitAll()
                
                .requestMatchers(HttpMethod.POST, "/api/**", "/pago-exitoso").permitAll()
                .requestMatchers(HttpMethod.GET,"/turnos/**", "/rutinas/**", "/actividades/**", "/turnos/mis-turnos", "/tipos-rutina/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/rutinas/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SECRETARIA")
                .requestMatchers("/tipos-rutina/admin").hasAnyAuthority("ROLE_ADMIN", "ROLE_SECRETARIA")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(usuarioService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                normalizeOrigin(frontendUrl)
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH" ,"DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private String normalizeOrigin(String url) {
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}
