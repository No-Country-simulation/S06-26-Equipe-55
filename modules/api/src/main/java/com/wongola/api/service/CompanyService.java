package com.wongola.api.service;

import com.wongola.api.dto.CompanyRequest;
import com.wongola.core.entity.Company;
import com.wongola.core.entity.ResponsavelRh;
import com.wongola.core.repository.CompanyRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    public CompanyService(CompanyRepository companyRepository, PasswordEncoder passwordEncoder) {
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Company create(CompanyRequest request) {
        Company company = new Company();
        company.setCnpj(request.cnpj());
        company.setRazaoSocial(request.razaoSocial());
        company.setNomeFantasia(request.nomeFantasia());
        company.setPorte(request.porte());
        company.setSegmento(request.segmento());
        company.setSetorAtuacao(request.setorAtuacao());
        company.setLocalizacaoMatriz(request.localizacaoMatriz());
        company.setRegioesAtuacao(request.regioesAtuacao());
        company.setQtdColaboradores(request.qtdColaboradores());
        company.setPercentualDiversidade(request.percentualDiversidade());
        company.setPrazoMetaEsg(request.prazoMetaEsg());
        company.setSenha(passwordEncoder.encode(request.senha()));

        ResponsavelRh responsavel = new ResponsavelRh();
        responsavel.setNome(request.responsavelRh().nome());
        responsavel.setEmail(request.responsavelRh().email());
        responsavel.setCargo(request.responsavelRh().cargo());
        company.setResponsavelRh(responsavel);

        return companyRepository.save(company);
    }

    public Company findById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));
    }

    public Company update(Long id, CompanyRequest request) {
        Company company = findById(id);

        if (request.razaoSocial() != null) company.setRazaoSocial(request.razaoSocial());
        if (request.nomeFantasia() != null) company.setNomeFantasia(request.nomeFantasia());
        if (request.porte() != null) company.setPorte(request.porte());
        if (request.segmento() != null) company.setSegmento(request.segmento());
        if (request.setorAtuacao() != null) company.setSetorAtuacao(request.setorAtuacao());
        if (request.localizacaoMatriz() != null) company.setLocalizacaoMatriz(request.localizacaoMatriz());
        if (request.regioesAtuacao() != null) company.setRegioesAtuacao(request.regioesAtuacao());
        if (request.qtdColaboradores() != null) company.setQtdColaboradores(request.qtdColaboradores());
        if (request.percentualDiversidade() != null) company.setPercentualDiversidade(request.percentualDiversidade());
        if (request.prazoMetaEsg() != null) company.setPrazoMetaEsg(request.prazoMetaEsg());
        if (request.senha() != null && !request.senha().isBlank()) {
            company.setSenha(passwordEncoder.encode(request.senha()));
        }
        if (request.responsavelRh() != null) {
            ResponsavelRh rh = company.getResponsavelRh();
            if (request.responsavelRh().nome() != null) rh.setNome(request.responsavelRh().nome());
            if (request.responsavelRh().email() != null) rh.setEmail(request.responsavelRh().email());
            if (request.responsavelRh().cargo() != null) rh.setCargo(request.responsavelRh().cargo());
        }

        return companyRepository.save(company);
    }
}
