package com.wongola.api.service;

import com.wongola.api.dto.CompanyRequest;
import com.wongola.core.entity.Company;
import com.wongola.core.repository.CompanyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
                "Wongola Ltda", "Wongola", "Médio",
                "Tecnologia", "São Paulo - SP", 150
        );

        Company saved = new Company();
        saved.setId(1L);
        saved.setRazaoSocial(request.razaoSocial());
        saved.setNomeFantasia(request.nomeFantasia());
        saved.setPorte(request.porte());
        saved.setSegmento(request.segmento());
        saved.setLocalizacaoMatriz(request.localizacaoMatriz());
        saved.setQtdColaboradores(request.qtdColaboradores());

        when(companyRepository.save(any(Company.class))).thenReturn(saved);

        Company result = companyService.create(request);

        assertNotNull(result.getId());
        assertEquals("Wongola Ltda", result.getRazaoSocial());
        assertEquals("Wongola", result.getNomeFantasia());
        assertEquals("Médio", result.getPorte());
        assertEquals("Tecnologia", result.getSegmento());
        assertEquals("São Paulo - SP", result.getLocalizacaoMatriz());
        assertEquals(150, result.getQtdColaboradores());
    }
}
