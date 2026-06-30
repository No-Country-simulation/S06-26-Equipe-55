package com.wongola.api.service;

import com.wongola.api.dto.CompanyRequest;
import com.wongola.api.dto.ResponsavelRhRequest;
import com.wongola.core.entity.Company;
import com.wongola.core.entity.ResponsavelRh;
import com.wongola.core.repository.CompanyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyService companyService;

    @Test
    void shouldCreateCompanySuccessfully() {
        CompanyRequest request = new CompanyRequest(
                "12.345.678/0001-90", "Wongola Ltda", "Wongola", "Médio",
                "Tecnologia", "Fintech", "São Paulo - SP",
                List.of("SP", "RJ", "MG"), 150, 30, "2026-12",
                new ResponsavelRhRequest("Ana Silva", "ana@wongola.com", "Head de Diversidade")
        );

        Company saved = new Company();
        saved.setId(1L);
        saved.setCnpj(request.cnpj());
        saved.setRazaoSocial(request.razaoSocial());
        saved.setNomeFantasia(request.nomeFantasia());
        saved.setPorte(request.porte());
        saved.setSegmento(request.segmento());
        saved.setSetorAtuacao(request.setorAtuacao());
        saved.setLocalizacaoMatriz(request.localizacaoMatriz());
        saved.setRegioesAtuacao(request.regioesAtuacao());
        saved.setQtdColaboradores(request.qtdColaboradores());
        saved.setPercentualDiversidade(request.percentualDiversidade());
        saved.setPrazoMetaEsg(request.prazoMetaEsg());

        ResponsavelRh responsavel = new ResponsavelRh();
        responsavel.setNome("Ana Silva");
        responsavel.setEmail("ana@wongola.com");
        responsavel.setCargo("Head de Diversidade");
        saved.setResponsavelRh(responsavel);

        when(companyRepository.save(any(Company.class))).thenReturn(saved);

        Company result = companyService.create(request);

        assertNotNull(result.getId());
        assertEquals("12.345.678/0001-90", result.getCnpj());
        assertEquals("Wongola Ltda", result.getRazaoSocial());
        assertEquals("Fintech", result.getSetorAtuacao());
        assertEquals(List.of("SP", "RJ", "MG"), result.getRegioesAtuacao());
        assertEquals(30, result.getPercentualDiversidade());
        assertEquals("Ana Silva", result.getResponsavelRh().getNome());
        assertEquals("ana@wongola.com", result.getResponsavelRh().getEmail());
    }
}
