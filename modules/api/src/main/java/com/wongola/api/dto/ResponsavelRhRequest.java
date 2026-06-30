package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Dados do responsável de RH")
public record ResponsavelRhRequest(

        @NotBlank
        @Schema(description = "Nome do responsável", example = "Ana Silva")
        String nome,

        @NotBlank @Email
        @Schema(description = "Email do responsável", example = "ana@wongola.com")
        String email,

        @NotBlank
        @Schema(description = "Cargo do responsável", example = "Head de Diversidade")
        String cargo
) {}
