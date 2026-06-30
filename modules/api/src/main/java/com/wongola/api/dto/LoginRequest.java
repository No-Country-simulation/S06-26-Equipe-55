package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Dados para login")
public record LoginRequest(

        @NotBlank @Email
        @Schema(description = "Email do responsável de RH", example = "ana@wongola.com")
        String email,

        @NotBlank
        @Schema(description = "Senha", example = "senha123")
        String senha
) {}
