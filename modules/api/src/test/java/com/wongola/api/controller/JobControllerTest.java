package com.wongola.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wongola.api.dto.JobRequest;
import com.wongola.core.entity.Company;
import com.wongola.core.entity.ResponsavelRh;
import com.wongola.core.repository.CompanyRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:job_test;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CompanyRepository companyRepository;

    private Long createCompany() {
        Company company = new Company();
        company.setCnpj("99.999.999/0001-99");
        company.setRazaoSocial("Wongola Ltda");
        company.setNomeFantasia("Wongola");
        company.setPorte("Médio");
        company.setSegmento("Tecnologia");
        company.setSetorAtuacao("Fintech");
        company.setLocalizacaoMatriz("São Paulo - SP");
        company.setRegioesAtuacao(List.of("SP", "RJ"));
        company.setQtdColaboradores(150);
        company.setPercentualDiversidade(30);
        company.setPrazoMetaEsg("2026-12");

        ResponsavelRh rh = new ResponsavelRh();
        rh.setNome("Ana Silva");
        rh.setEmail("ana@wongola.com");
        rh.setCargo("Head de Diversidade");
        company.setResponsavelRh(rh);

        return companyRepository.saveAndFlush(company).getId();
    }

    @Test
    void shouldReturn201WhenJobIsCreated() throws Exception {
        Long companyId = createCompany();

        JobRequest request = new JobRequest(
                companyId, "Dev Backend",
                "Buscamos desenvolvedor backend com experiência em microsserviços",
                List.of("Java", "Spring Boot"), "Pleno", "SP",
                List.of("PCD", "RACIAL"), 40, true
        );

        mockMvc.perform(post("/api/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.empresaId").value(companyId))
                .andExpect(jsonPath("$.titulo").value("Dev Backend"))
                .andExpect(jsonPath("$.skills[0]").value("Java"))
                .andExpect(jsonPath("$.gruposFoco[0]").value("PCD"))
                .andExpect(jsonPath("$.createdAt").exists());
    }

    @Test
    void shouldReturn400WhenEmpresaIdNotFound() throws Exception {
        JobRequest request = new JobRequest(
                999L, "Dev Backend",
                "Descrição da vaga",
                List.of("Java"), "Pleno", "SP",
                List.of("PCD"), 40, true
        );

        mockMvc.perform(post("/api/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400WhenDescricaoExceeds3000Chars() throws Exception {
        Long companyId = createCompany();
        String longDescription = "x".repeat(3001);

        JobRequest request = new JobRequest(
                companyId, "Dev Backend", longDescription,
                List.of("Java"), "Pleno", "SP",
                List.of("PCD"), 40, true
        );

        mockMvc.perform(post("/api/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
