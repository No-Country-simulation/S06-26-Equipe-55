package com.wongola.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cnpj", nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(name = "razao_social", nullable = false)
    private String razaoSocial;

    @Column(name = "nome_fantasia", nullable = false)
    private String nomeFantasia;

    @Column(name = "porte", nullable = false)
    private String porte;

    @Column(name = "segmento", nullable = false)
    private String segmento;

    @Column(name = "setor_atuacao", nullable = false)
    private String setorAtuacao;

    @Column(name = "localizacao_matriz", nullable = false)
    private String localizacaoMatriz;

    @ElementCollection
    @CollectionTable(name = "company_regioes", joinColumns = @JoinColumn(name = "company_id"))
    @Column(name = "regiao")
    private List<String> regioesAtuacao;

    @Column(name = "qtd_colaboradores", nullable = false)
    private Integer qtdColaboradores;

    @Column(name = "percentual_diversidade")
    private Integer percentualDiversidade;

    @Column(name = "prazo_meta_esg", length = 7)
    private String prazoMetaEsg;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "responsavel_rh_id")
    private ResponsavelRh responsavelRh;

    @JsonIgnore
    @Column(name = "senha", nullable = false)
    private String senha;

    public Company() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }

    public String getPorte() { return porte; }
    public void setPorte(String porte) { this.porte = porte; }

    public String getSegmento() { return segmento; }
    public void setSegmento(String segmento) { this.segmento = segmento; }

    public String getSetorAtuacao() { return setorAtuacao; }
    public void setSetorAtuacao(String setorAtuacao) { this.setorAtuacao = setorAtuacao; }

    public String getLocalizacaoMatriz() { return localizacaoMatriz; }
    public void setLocalizacaoMatriz(String localizacaoMatriz) { this.localizacaoMatriz = localizacaoMatriz; }

    public List<String> getRegioesAtuacao() { return regioesAtuacao; }
    public void setRegioesAtuacao(List<String> regioesAtuacao) { this.regioesAtuacao = regioesAtuacao; }

    public Integer getQtdColaboradores() { return qtdColaboradores; }
    public void setQtdColaboradores(Integer qtdColaboradores) { this.qtdColaboradores = qtdColaboradores; }

    public Integer getPercentualDiversidade() { return percentualDiversidade; }
    public void setPercentualDiversidade(Integer percentualDiversidade) { this.percentualDiversidade = percentualDiversidade; }

    public String getPrazoMetaEsg() { return prazoMetaEsg; }
    public void setPrazoMetaEsg(String prazoMetaEsg) { this.prazoMetaEsg = prazoMetaEsg; }

    public ResponsavelRh getResponsavelRh() { return responsavelRh; }
    public void setResponsavelRh(ResponsavelRh responsavelRh) { this.responsavelRh = responsavelRh; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}
