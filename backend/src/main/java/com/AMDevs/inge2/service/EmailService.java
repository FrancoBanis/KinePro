package com.AMDevs.inge2.service;

import java.time.LocalDate;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendMessageMail(String email, String mensaje) { 
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setTo(email);
        message.setSubject("KinePro AVISO "+LocalDate.now());
        message.setText(mensaje);
        mailSender.send(message);
    }


}
