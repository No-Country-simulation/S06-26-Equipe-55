package com.wongola.api.dto;

import com.wongola.core.entity.Job;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Dados da vaga publicada")
public record JobResponse(
        Long id,
        Long empresaId,
        String titulo,
        String descricao,
        List<String> skills,
        String nivel,
        String regiao,
        List<String> gruposFoco,
        Integer diversidadeMinima,
        Boolean filtroAntiVies,
        LocalDateTime createdAt
) {
    public static JobResponse from(Job job) {
        return new JobResponse(
                job.getId(),
                job.getCompany().getId(),
                job.getTitulo(),
                job.getDescricao(),
                job.getSkills(),
                job.getNivel(),
                job.getRegiao(),
                job.getGruposFoco(),
                job.getDiversidadeMinima(),
                job.getFiltroAntiVies(),
                job.getCreatedAt()
        );
    }
}
