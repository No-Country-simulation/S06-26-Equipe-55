package com.wongola.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wongola.api.dto.LoginRequest;
import com.wongola.core.entity.Company;
import com.wongola.core.entity.ResponsavelRh;
import com.wongola.core.repository.CompanyRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
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
        "spring.datasource.url=jdbc:h2:mem:auth_test;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private void createCompany() {
        Company company = new Company();
        company.setCnpj("11.111.111/0001-11");
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
        company.setSenha(passwordEncoder.encode("senha123"));

        ResponsavelRh rh = new ResponsavelRh();
        rh.setNome("Ana Silva");
        rh.setEmail("ana@wongola.com");
        rh.setCargo("Head de Diversidade");
        company.setResponsavelRh(rh);

        companyRepository.saveAndFlush(company);
    }

    @Test
    void shouldReturn200WithTokenWhenCredentialsAreValid() throws Exception {
        createCompany();

        LoginRequest request = new LoginRequest("ana@wongola.com", "senha123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.empresaId").exists())
                .andExpect(jsonPath("$.nomeFantasia").value("Wongola"));
    }

    @Test
    void shouldReturn400WhenEmailNotFound() throws Exception {
        LoginRequest request = new LoginRequest("naoexiste@email.com", "senha123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0]").value("Credenciais inválidas"));
    }

    @Test
    void shouldReturn400WhenPasswordIsWrong() throws Exception {
        createCompany();

        LoginRequest request = new LoginRequest("ana@wongola.com", "senhaerrada");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0]").value("Credenciais inválidas"));
    }

    @Test
    void shouldReturn400WhenEmailIsInvalid() throws Exception {
        LoginRequest request = new LoginRequest("email-invalido", "senha123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
