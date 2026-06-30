package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

@Schema(description = "Dados para cadastro de empresa")
public record CompanyRequest(

        @NotBlank
        @Schema(description = "CNPJ da empresa", example = "12.345.678/0001-90")
        String cnpj,

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
        @Schema(description = "Setor de atuação", example = "Fintech")
        String setorAtuacao,

        @NotBlank
        @Schema(description = "Localização da Matriz", example = "São Paulo - SP")
        String localizacaoMatriz,

        @NotEmpty
        @Schema(description = "Regiões de atuação", example = "[\"SP\", \"RJ\", \"MG\"]")
        List<String> regioesAtuacao,

        @NotNull
        @Positive
        @Schema(description = "Quantidade de colaboradores", example = "150")
        Integer qtdColaboradores,

        @Min(0) @Max(100)
        @Schema(description = "Meta de percentual de diversidade", example = "30")
        Integer percentualDiversidade,

        @Schema(description = "Prazo da meta ESG (YYYY-MM)", example = "2026-12")
        String prazoMetaEsg,

        @NotNull @Valid
        @Schema(description = "Responsável de RH")
        ResponsavelRhRequest responsavelRh
) {}
