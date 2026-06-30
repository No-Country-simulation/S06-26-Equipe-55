package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response do login")
public record LoginResponse(

        @Schema(description = "Token JWT")
        String token,

        @Schema(description = "ID da empresa")
        Long empresaId,

        @Schema(description = "Nome fantasia da empresa")
        String nomeFantasia
) {}
