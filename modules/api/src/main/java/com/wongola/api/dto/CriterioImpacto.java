package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Impacto de um critério no alcance de candidatos")
public record CriterioImpacto(

        @Schema(description = "Nome do critério", example = "Java")
        String criterio,

        @Schema(description = "Candidatos elegíveis se remover este critério")
        Integer semEsse,

        @Schema(description = "Ganho de candidatos ao remover este critério")
        Integer ganho
) {}
