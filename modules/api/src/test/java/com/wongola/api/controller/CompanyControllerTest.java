package com.wongola.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wongola.api.dto.CompanyRequest;
import com.wongola.api.dto.ResponsavelRhRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class CompanyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturn201WhenCompanyIsCreated() throws Exception {
        CompanyRequest request = new CompanyRequest(
                "12.345.678/0001-90", "Wongola Ltda", "Wongola", "Médio",
                "Tecnologia", "Fintech", "São Paulo - SP",
                List.of("SP", "RJ", "MG"), 150, 30, "2026-12",
                new ResponsavelRhRequest("Ana Silva", "ana@wongola.com", "Head de Diversidade")
        );

        mockMvc.perform(post("/api/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.cnpj").value("12.345.678/0001-90"))
                .andExpect(jsonPath("$.razaoSocial").value("Wongola Ltda"))
                .andExpect(jsonPath("$.setorAtuacao").value("Fintech"))
                .andExpect(jsonPath("$.regioesAtuacao[0]").value("SP"))
                .andExpect(jsonPath("$.percentualDiversidade").value(30))
                .andExpect(jsonPath("$.responsavelRh.nome").value("Ana Silva"));
    }

    @Test
    void shouldReturn400WhenCnpjIsBlank() throws Exception {
        CompanyRequest request = new CompanyRequest(
                "", "Wongola Ltda", "Wongola", "Médio",
                "Tecnologia", "Fintech", "São Paulo - SP",
                List.of("SP"), 150, 30, "2026-12",
                new ResponsavelRhRequest("Ana Silva", "ana@wongola.com", "Head de Diversidade")
        );

        mockMvc.perform(post("/api/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400WhenResponsavelRhEmailIsInvalid() throws Exception {
        CompanyRequest request = new CompanyRequest(
                "12.345.678/0001-90", "Wongola Ltda", "Wongola", "Médio",
                "Tecnologia", "Fintech", "São Paulo - SP",
                List.of("SP"), 150, 30, "2026-12",
                new ResponsavelRhRequest("Ana Silva", "email-invalido", "Head de Diversidade")
        );

        mockMvc.perform(post("/api/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400WhenRegioesAtuacaoIsEmpty() throws Exception {
        CompanyRequest request = new CompanyRequest(
                "12.345.678/0001-90", "Wongola Ltda", "Wongola", "Médio",
                "Tecnologia", "Fintech", "São Paulo - SP",
                List.of(), 150, 30, "2026-12",
                new ResponsavelRhRequest("Ana Silva", "ana@wongola.com", "Head de Diversidade")
        );

        mockMvc.perform(post("/api/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
