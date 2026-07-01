package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Dados para matching de candidatos")
public record MatchRequest(

        @NotNull
        @Schema(description = "ID da vaga para matching", example = "1")
        Long jobId
) {}
