package com.AMDevs.inge2.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.AMDevs.inge2.entity.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;
    
    @Value("${jwt.expiration}")
    private Long jwtExpiration;


    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }
    public String buildToken(Usuario usuario){
        return Jwts.builder()
            .id(usuario.getId().toString())
            .subject(usuario.getEmail())
            .claims(Map.of(
                "nombre", usuario.getNombre(),
                "rol", usuario.getRol().name()
            ))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSigningKey())
            .compact();
    }

    public String generateToken(Usuario usuario) {
        return buildToken(usuario);
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }
    public boolean isTokenValid(String token, Usuario usuario) {
        final String email = extractEmail(token);
        return email.equals(usuario.getEmail()) && !isTokenExpired(token);
    }
    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
    private Claims extractClaims (String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}


