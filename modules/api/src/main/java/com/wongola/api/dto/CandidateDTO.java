package com.wongola.api.dto;

import java.util.List;

public record CandidateDTO(
        Long id,
        String nome,
        String perfil,
        String nivel,
        List<String> skills,
        String areaInteresse,
        List<String> gruposDiversidade,
        String email,
        String telefone,
        String cidade,
        String pais,
        Integer gapPorcentual
) {}
