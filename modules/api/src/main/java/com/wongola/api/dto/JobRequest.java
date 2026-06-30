package com.wongola.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.util.List;

@Schema(description = "Dados para publicação de vaga")
public record JobRequest(

        @NotNull
        @Schema(description = "ID da empresa", example = "1")
        Long empresaId,

        @NotBlank
        @Schema(description = "Título da vaga", example = "Dev Backend")
        String titulo,

        @NotBlank
        @Size(max = 3000)
        @Schema(description = "Descrição da vaga (até 3000 caracteres)", example = "Buscamos desenvolvedor backend com experiência em microsserviços...")
        String descricao,

        @NotEmpty
        @Schema(description = "Skills requeridas", example = "[\"Java\", \"Spring Boot\"]")
        List<String> skills,

        @NotBlank
        @Schema(description = "Nível da vaga", example = "Pleno")
        String nivel,

        @NotBlank
        @Schema(description = "Região da vaga", example = "SP")
        String regiao,

        @Schema(description = "Grupos de diversidade foco", example = "[\"PCD\", \"RACIAL\", \"GENERO\"]")
        List<String> gruposFoco,

        @Min(0) @Max(100)
        @Schema(description = "Percentual mínimo de diversidade", example = "40")
        Integer diversidadeMinima,

        @Schema(description = "Ativar filtro anti-viés", example = "true")
        Boolean filtroAntiVies
) {}
