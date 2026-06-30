package com.wongola.core.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "descricao", nullable = false, length = 3000)
    private String descricao;

    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> skills;

    @Column(name = "nivel", nullable = false)
    private String nivel;

    @Column(name = "regiao", nullable = false)
    private String regiao;

    @ElementCollection
    @CollectionTable(name = "job_grupos_foco", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "grupo")
    private List<String> gruposFoco;

    @Column(name = "diversidade_minima")
    private Integer diversidadeMinima;

    @Column(name = "filtro_anti_vies")
    private Boolean filtroAntiVies;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Job() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }

    public String getRegiao() { return regiao; }
    public void setRegiao(String regiao) { this.regiao = regiao; }

    public List<String> getGruposFoco() { return gruposFoco; }
    public void setGruposFoco(List<String> gruposFoco) { this.gruposFoco = gruposFoco; }

    public Integer getDiversidadeMinima() { return diversidadeMinima; }
    public void setDiversidadeMinima(Integer diversidadeMinima) { this.diversidadeMinima = diversidadeMinima; }

    public Boolean getFiltroAntiVies() { return filtroAntiVies; }
    public void setFiltroAntiVies(Boolean filtroAntiVies) { this.filtroAntiVies = filtroAntiVies; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
