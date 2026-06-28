package com.wongola.api.service;

import com.wongola.api.dto.CompanyRequest;
import com.wongola.core.entity.Company;
import com.wongola.core.repository.CompanyRepository;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company create(CompanyRequest request) {
        Company company = new Company();
        company.setRazaoSocial(request.razaoSocial());
        company.setNomeFantasia(request.nomeFantasia());
        company.setPorte(request.porte());
        company.setSegmento(request.segmento());
        company.setLocalizacaoMatriz(request.localizacaoMatriz());
        company.setQtdColaboradores(request.qtdColaboradores());
        return companyRepository.save(company);
    }
}
