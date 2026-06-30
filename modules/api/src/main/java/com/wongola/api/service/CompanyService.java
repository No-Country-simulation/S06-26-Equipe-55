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
}
