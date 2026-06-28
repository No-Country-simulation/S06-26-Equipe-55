package com.wongola.core.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "razao_social", nullable = false)
    private String razaoSocial;

    @Column(name = "nome_fantasia", nullable = false)
    private String nomeFantasia;

    @Column(name = "porte", nullable = false)
    private String porte;

    @Column(name = "segmento", nullable = false)
    private String segmento;

    @Column(name = "localizacao_matriz", nullable = false)
    private String localizacaoMatriz;

    @Column(name = "qtd_colaboradores", nullable = false)
    private Integer qtdColaboradores;

    public Company() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }

    public String getPorte() { return porte; }
    public void setPorte(String porte) { this.porte = porte; }

    public String getSegmento() { return segmento; }
    public void setSegmento(String segmento) { this.segmento = segmento; }

    public String getLocalizacaoMatriz() { return localizacaoMatriz; }
    public void setLocalizacaoMatriz(String localizacaoMatriz) { this.localizacaoMatriz = localizacaoMatriz; }

    public Integer getQtdColaboradores() { return qtdColaboradores; }
    public void setQtdColaboradores(Integer qtdColaboradores) { this.qtdColaboradores = qtdColaboradores; }
}
