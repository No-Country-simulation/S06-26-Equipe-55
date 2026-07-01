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
                .filter(c -> hasSkillMatch(c, job))
                .map(c -> toMatch(c, job))
                .sorted(Comparator.comparingInt(CandidateMatch::score).reversed())
                .toList();

        long diversityCount = ranked.stream().filter(CandidateMatch::badgeDiversidade).count();
        int diversityPercent = ranked.isEmpty() ? 0 : (int) (diversityCount * 100 / ranked.size());

        return new MatchResponse(ranked, candidates.size(), diversityPercent);
    }

    private boolean hasSkillMatch(CandidateDTO candidate, Job job) {
        return candidate.skills().stream()
                .anyMatch(s -> job.getSkills().stream().anyMatch(js -> js.equalsIgnoreCase(s)));
    }

    private CandidateMatch toMatch(CandidateDTO candidate, Job job) {
        int score = 100 - candidate.gapPorcentual();

        boolean badge = false;
        if (job.getGruposFoco() != null && candidate.gruposDiversidade() != null) {
            badge = candidate.gruposDiversidade().stream()
                    .anyMatch(g -> job.getGruposFoco().contains(g));
        }

        return new CandidateMatch(
                candidate.id(),
                candidate.perfil(),
                Math.max(0, score),
                badge,
                candidate.skills(),
                candidate.nivel(),
                candidate.gapPorcentual()
        );
    }
}
