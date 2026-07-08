package com.wongola.api.service;

import com.wongola.api.dto.CandidateDTO;
import com.wongola.api.dto.CriterioImpacto;
import com.wongola.api.dto.JobRequest;
import com.wongola.api.dto.SimulationResponse;
import com.wongola.api.provider.CandidateProvider;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SimulationService {

    private final CandidateProvider candidateProvider;

    public SimulationService(CandidateProvider candidateProvider) {
        this.candidateProvider = candidateProvider;
    }

    public SimulationResponse simulate(JobRequest request) {
        List<CandidateDTO> allCandidates = candidateProvider.findAll();
        int total = allCandidates.size();

        List<String> skills = request.skills() != null
                ? request.skills().stream().filter(s -> s != null && !s.isBlank()).toList()
                : List.of();
        String nivel = (request.nivel() != null && !request.nivel().isBlank()) ? request.nivel() : null;
        String regiaoRaw = (request.regiao() != null && !request.regiao().isBlank() && !request.regiao().equalsIgnoreCase("BRASIL")) ? request.regiao() : null;
        List<String> regioes = regiaoRaw != null 
                ? List.of(regiaoRaw.split(",")).stream().map(String::trim).filter(s -> !s.isBlank()).toList()
                : List.of();

        List<String> criterios = new ArrayList<>(skills);
        if (nivel != null) criterios.add(nivel);

        // Região só entra como critério de impacto se está limitando o alcance
        boolean regiaoLimita = false;
        if (!regioes.isEmpty()) {
            long semRegiao = allCandidates.stream()
                    .filter(c -> matchesAll(c, skills, nivel, List.of()))
                    .count();
            long comRegiao = allCandidates.stream()
                    .filter(c -> matchesAll(c, skills, nivel, regioes))
                    .count();
            if (comRegiao < semRegiao) {
                regiaoLimita = true;
                criterios.add("Região (" + String.join(", ", regioes) + ")");
            }
        }

        if (criterios.isEmpty() && regioes.isEmpty()) {
            if (request.gruposFoco() != null && !request.gruposFoco().isEmpty()) {
                long diversityCount = allCandidates.stream()
                        .filter(c -> c.gruposDiversidade() != null &&
                                c.gruposDiversidade().stream().anyMatch(g -> request.gruposFoco().contains(g)))
                        .count();
                int diversidade = total > 0 ? (int) (diversityCount * 100 / total) : 0;
                return new SimulationResponse(total, total, List.of(), diversidade, total, 100);
            }
            return new SimulationResponse(total, total, List.of(), 0, total, 100);
        }

        // Candidatos elegíveis com todos os critérios
        long elegiveis = allCandidates.stream()
                .filter(c -> matchesAll(c, skills, nivel, regioes))
                .count();

        // Impacto de cada critério
        List<CriterioImpacto> impactos = new ArrayList<>();
        for (String criterio : criterios) {
            List<String> skillsSem = new ArrayList<>(skills);
            final String nivelSem;
            final List<String> regioesSem;

            if (skills.stream().anyMatch(s -> s.equalsIgnoreCase(criterio))) {
                skillsSem = skillsSem.stream()
                        .filter(s -> !s.equalsIgnoreCase(criterio))
                        .collect(Collectors.toList());
                nivelSem = nivel;
                regioesSem = regioes;
            } else if (nivel != null && nivel.equalsIgnoreCase(criterio)) {
                nivelSem = null;
                regioesSem = regioes;
            } else {
                nivelSem = nivel;
                regioesSem = List.of();
            }

            final List<String> finalSkillsSem = skillsSem;
            long semEsse = allCandidates.stream()
                    .filter(c -> matchesAll(c, finalSkillsSem, nivelSem, regioesSem))
                    .count();

            int ganho = (int) (semEsse - elegiveis);
            impactos.add(new CriterioImpacto(criterio, (int) semEsse, ganho));
        }

        // Ordenar por maior ganho
        impactos.sort((a, b) -> b.ganho() - a.ganho());

        // Diversidade estimada
        long diversityCount = allCandidates.stream()
                .filter(c -> matchesAll(c, skills, nivel, regioes))
                .filter(c -> request.gruposFoco() != null && c.gruposDiversidade() != null &&
                        c.gruposDiversidade().stream().anyMatch(g -> request.gruposFoco().contains(g)))
                .count();
        int diversidade = elegiveis > 0 ? (int) (diversityCount * 100 / elegiveis) : 0;

        // Calcular aderência média e candidatos parciais
        final List<String> finalSkills = skills;
        final String finalNivel = nivel;
        final List<String> finalRegioes = regioes;
        int totalCriterios = criterios.size();
        int somaAderencia = 0;
        int parciais = 0;

        for (CandidateDTO c : allCandidates) {
            int atendidos = 0;
            for (String skill : finalSkills) {
                if (c.skills().stream().anyMatch(cs -> cs.toLowerCase().contains(skill.toLowerCase()) || skill.toLowerCase().contains(cs.toLowerCase()))) {
                    atendidos++;
                }
            }
            if (finalNivel != null && (c.nivel().toLowerCase().contains(finalNivel.toLowerCase()) || finalNivel.toLowerCase().contains(c.nivel().toLowerCase()))) {
                atendidos++;
            }
            if (regiaoLimita && !finalRegioes.isEmpty() && c.cidade() != null && finalRegioes.stream().anyMatch(r -> c.cidade().endsWith("- " + r.toUpperCase()) || c.cidade().equalsIgnoreCase(r))) {
                atendidos++;
            }
            if (atendidos > 0) parciais++;
            somaAderencia += totalCriterios > 0 ? (atendidos * 100 / totalCriterios) : 0;
        }

        int aderenciaMedia = total > 0 ? somaAderencia / total : 0;

        return new SimulationResponse(total, (int) elegiveis, impactos, diversidade, parciais, aderenciaMedia);
    }

    private boolean matchesAll(CandidateDTO candidate, List<String> skills, String nivel, List<String> regioes) {
        boolean hasAllSkills = skills.isEmpty() || skills.stream()
                .allMatch(skill -> candidate.skills().stream()
                        .anyMatch(cs -> cs.toLowerCase().contains(skill.toLowerCase()) ||
                                skill.toLowerCase().contains(cs.toLowerCase())));

        boolean hasNivel = nivel == null || nivel.isBlank() ||
                candidate.nivel().toLowerCase().contains(nivel.toLowerCase()) ||
                nivel.toLowerCase().contains(candidate.nivel().toLowerCase());

        boolean hasRegiao = regioes.isEmpty() ||
                (candidate.cidade() != null && regioes.stream()
                        .anyMatch(r -> candidate.cidade().endsWith("- " + r.toUpperCase()) ||
                                candidate.cidade().equalsIgnoreCase(r)));

        return hasAllSkills && hasNivel && hasRegiao;
    }
}
