package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "Dados para cadastro de empresa")
public record CompanyRequest(

        @NotBlank
        @Schema(description = "Razão Social", example = "Wongola Ltda")
        String razaoSocial,

        @NotBlank
        @Schema(description = "Nome Fantasia", example = "Wongola")
        String nomeFantasia,

        @NotBlank
        @Schema(description = "Porte da Empresa", example = "Médio")
        String porte,

        @NotBlank
        @Schema(description = "Segmento de atuação", example = "Tecnologia")
        String segmento,

        @NotBlank
        @Schema(description = "Localização da Matriz", example = "São Paulo - SP")
        String localizacaoMatriz,

        @NotNull
        @Positive
        @Schema(description = "Quantidade de colaboradores", example = "150")
        Integer qtdColaboradores
) {}
