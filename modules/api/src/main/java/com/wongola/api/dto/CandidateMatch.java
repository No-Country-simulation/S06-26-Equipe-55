package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Candidato com score de compatibilidade")
public record CandidateMatch(

        @Schema(description = "ID do candidato")
        Long id,

        @Schema(description = "Nome do candidato")
        String nome,

        @Schema(description = "Perfil do candidato")
        String perfil,

        @Schema(description = "Score de compatibilidade (0-100)")
        Integer score,

        @Schema(description = "Badge de diversidade")
        Boolean badgeDiversidade,

        @Schema(description = "Skills do candidato")
        List<String> skills,

        @Schema(description = "Nível do candidato")
        String nivel,

        @Schema(description = "Área de interesse")
        String areaInteresse,

        @Schema(description = "Email do candidato")
        String email,

        @Schema(description = "Telefone do candidato")
        String telefone,

        @Schema(description = "Cidade do candidato")
        String cidade,

        @Schema(description = "País do candidato")
        String pais,

        @Schema(description = "Gap porcentual")
        Integer gapPorcentual
) {}
