package com.wongola.api.dto;

import java.util.List;

public record CandidateDTO(
        Long id,
        String perfil,
        String nivel,
        List<String> skills,
        String areaInteresse,
        List<String> gruposDiversidade,
        String email,
        String telefone,
        String pais,
        Integer gapPorcentual
) {}
