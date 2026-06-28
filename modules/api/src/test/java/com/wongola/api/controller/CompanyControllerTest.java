package com.wongola.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wongola.api.dto.CompanyRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

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
                "Wongola Ltda", "Wongola", "Médio",
                "Tecnologia", "São Paulo - SP", 150
        );

        mockMvc.perform(post("/api/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.razaoSocial").value("Wongola Ltda"))
                .andExpect(jsonPath("$.nomeFantasia").value("Wongola"))
                .andExpect(jsonPath("$.porte").value("Médio"))
                .andExpect(jsonPath("$.segmento").value("Tecnologia"))
                .andExpect(jsonPath("$.localizacaoMatriz").value("São Paulo - SP"))
                .andExpect(jsonPath("$.qtdColaboradores").value(150));
    }

    @Test
    void shouldReturn400WhenRazaoSocialIsBlank() throws Exception {
        CompanyRequest request = new CompanyRequest(
                "", "Wongola", "Médio",
                "Tecnologia", "São Paulo - SP", 150
        );

        mockMvc.perform(post("/api/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400WhenQtdColaboradoresIsNull() throws Exception {
        String json = """
                {
                  "razaoSocial": "Wongola Ltda",
                  "nomeFantasia": "Wongola",
                  "porte": "Médio",
                  "segmento": "Tecnologia",
                  "localizacaoMatriz": "São Paulo - SP"
                }
                """;

        mockMvc.perform(post("/api/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }
}
