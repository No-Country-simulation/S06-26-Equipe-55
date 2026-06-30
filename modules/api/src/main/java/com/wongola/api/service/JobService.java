package com.wongola.api.service;

import com.wongola.api.dto.JobRequest;
import com.wongola.core.entity.Company;
import com.wongola.core.entity.Job;
import com.wongola.core.repository.CompanyRepository;
import com.wongola.core.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public JobService(JobRepository jobRepository, CompanyRepository companyRepository) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
    }

    public Job create(JobRequest request) {
        Company company = companyRepository.findById(request.empresaId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada com id: " + request.empresaId()));

        Job job = new Job();
        job.setCompany(company);
        job.setTitulo(request.titulo());
        job.setDescricao(request.descricao());
        job.setSkills(request.skills());
        job.setNivel(request.nivel());
        job.setRegiao(request.regiao());
        job.setGruposFoco(request.gruposFoco());
        job.setDiversidadeMinima(request.diversidadeMinima());
        job.setFiltroAntiVies(request.filtroAntiVies());

        return jobRepository.save(job);
    }

    public List<Job> findByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }
}
