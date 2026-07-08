package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Resultado da simulação de impacto da vaga")
public record SimulationResponse(

        @Schema(description = "Total de candidatos na base")
        Integer totalCandidatos,

        @Schema(description = "Candidatos elegíveis com todos os critérios")
        Integer candidatosElegiveis,

        @Schema(description = "Impacto de cada critério no alcance")
        List<CriterioImpacto> impactoPorCriterio,

        @Schema(description = "% de diversidade estimada no resultado")
        Integer diversidadeEstimada,

        @Schema(description = "Candidatos que atendem pelo menos 1 critério")
        Integer candidatosParciais,

        @Schema(description = "% média de critérios atendidos por todos os candidatos")
        Integer aderenciaMedia
) {}
