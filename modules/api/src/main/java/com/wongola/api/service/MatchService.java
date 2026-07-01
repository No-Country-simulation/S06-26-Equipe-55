package com.wongola.api.service;

import com.wongola.api.dto.CandidateDTO;
import com.wongola.api.dto.CandidateMatch;
import com.wongola.api.dto.MatchResponse;
import com.wongola.api.provider.CandidateProvider;
import com.wongola.core.entity.Job;
import com.wongola.core.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class MatchService {

    private final JobRepository jobRepository;
    private final CandidateProvider candidateProvider;

    public MatchService(JobRepository jobRepository, CandidateProvider candidateProvider) {
        this.jobRepository = jobRepository;
        this.candidateProvider = candidateProvider;
    }

    public MatchResponse match(Long jobId, Long companyId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Vaga não encontrada com id: " + jobId));

        if (!job.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Vaga não pertence à empresa autenticada");
        }

        List<CandidateDTO> candidates = candidateProvider.findAll();

        List<CandidateMatch> ranked = candidates.stream()
                .map(c -> toMatch(c, job))
                .filter(c -> c.score() > 0)
                .sorted(Comparator.comparingInt(CandidateMatch::score).reversed())
                .toList();

        long diversityCount = ranked.stream().filter(CandidateMatch::badgeDiversidade).count();
        int diversityPercent = ranked.isEmpty() ? 0 : (int) (diversityCount * 100 / ranked.size());

        return new MatchResponse(ranked, candidates.size(), diversityPercent);
    }

    private CandidateMatch toMatch(CandidateDTO candidate, Job job) {
        int totalCriterios = job.getSkills().size() + 1; // skills + nível
        int atendidos = 0;

        // Skills em comum
        for (String skill : job.getSkills()) {
            if (candidate.skills().stream().anyMatch(s -> s.equalsIgnoreCase(skill))) {
                atendidos++;
            }
        }

        // Nível compatível
        if (candidate.nivel().equalsIgnoreCase(job.getNivel())) {
            atendidos++;
        }

        int score = (atendidos * 100) / totalCriterios;
        int gap = 100 - score;

        boolean badge = false;
        if (job.getGruposFoco() != null && candidate.gruposDiversidade() != null) {
            badge = candidate.gruposDiversidade().stream()
                    .anyMatch(g -> job.getGruposFoco().contains(g));
        }

        return new CandidateMatch(
                candidate.id(),
                candidate.nome(),
                candidate.perfil(),
                score,
                badge,
                candidate.skills(),
                candidate.nivel(),
                candidate.areaInteresse(),
                candidate.email(),
                candidate.telefone(),
                candidate.cidade(),
                candidate.pais(),
                gap
        );
    }
}
