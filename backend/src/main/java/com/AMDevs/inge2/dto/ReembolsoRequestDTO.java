package com.AMDevs.inge2.dto;

public class ReembolsoRequestDTO {
    private boolean permitido;
    private double monto;
    private String mensaje;
    private double costoOriginal;

    
    public ReembolsoRequestDTO(boolean permitido, double monto, double costoOriginal, String mensaje) {
        this.permitido = permitido;
        this.monto = monto;
        this.costoOriginal = costoOriginal;
        this.mensaje = mensaje;
    }
    
    public boolean isPermitido() {
        return permitido;
    }
    public void setPermitido(boolean permitido) {
        this.permitido = permitido;
    }
    public double getMonto() {
        return monto;
    }
    public void setMonto(double monto) {
        this.monto = monto;
    }
    public String getMensaje() {
        return mensaje;
    }
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public double getCostoOriginal() {
        return costoOriginal;
    }

    public void setCostoOriginal(double costoOriginal) {
        this.costoOriginal = costoOriginal;
    }

}
