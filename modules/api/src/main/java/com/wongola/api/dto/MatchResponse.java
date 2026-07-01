package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Resultado do matching de candidatos")
public record MatchResponse(

        @Schema(description = "Lista de candidatos ranqueados")
        List<CandidateMatch> candidatos,

        @Schema(description = "Total de candidatos analisados")
        Integer totalAnalisados,

        @Schema(description = "Percentual de diversidade no resultado")
        Integer diversidadeResultado
) {}
