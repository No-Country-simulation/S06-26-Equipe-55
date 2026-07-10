package com.wongola.api.config;

import com.wongola.core.entity.Company;
import com.wongola.core.entity.Job;
import com.wongola.core.entity.ResponsavelRh;
import com.wongola.core.repository.CompanyRepository;
import com.wongola.core.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(JobRepository jobRepository, CompanyRepository companyRepository, PasswordEncoder passwordEncoder) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (companyRepository.count() > 0) return;

        Company company = createSeedCompany();
        companyRepository.save(company);

        List<Job> jobs = List.of(
            createJob(company, "Dev Backend", "Vaga backend Java", List.of("Java", "Spring Boot"), "Pleno", "SP", List.of("PCD", "RACIAL"), 30, false),
            createJob(company, "Dev Frontend", "Vaga frontend React", List.of("React", "TypeScript"), "Junior", "RJ", List.of("GENERO"), 50, false),
            createJob(company, "DevOps Engineer", "Vaga DevOps com AWS", List.of("Docker", "Kubernetes", "AWS"), "Senior", "SP,RJ", List.of("RACIAL"), 20, false),
            createJob(company, "Data Engineer", "Engenheiro de dados com Python e SQL", List.of("Python", "SQL", "Spark"), "Pleno", "SP", List.of("GENERO"), 40, false),
            createJob(company, "Mobile Developer", "Desenvolvedor mobile Flutter", List.of("Flutter", "Kotlin", "Swift"), "Pleno", "DF", List.of("PCD"), 25, false),
            createJob(company, "Arquiteto Cloud", "Arquiteto de solucoes AWS", List.of("AWS", "Terraform", "Docker", "Kubernetes"), "Senior", "SP,RJ", List.of("RACIAL"), 30, false),
            createJob(company, "QA Automation", "Analista de qualidade com automacao", List.of("Selenium", "Java", "Cypress"), "Pleno", "MG", List.of("PCD", "GENERO"), 35, false),
            createJob(company, "Tech Lead", "Lider tecnico fullstack", List.of("Java", "React", "AWS", "Docker"), "Senior", "SP", List.of("RACIAL", "PCD"), 40, false),
            createJob(company, "Product Designer", "Designer de produto UX/UI", List.of("Figma", "CSS", "React"), "Pleno", "RJ", List.of("GENERO", "LGBTQIA"), 50, true),
            createJob(company, "SRE Engineer", "Site Reliability Engineer", List.of("Docker", "Kubernetes", "Terraform", "AWS"), "Senior", "BRASIL", List.of("RACIAL"), 20, false),
            createJob(company, "Analista de Dados", "Analista de dados com foco em BI", List.of("SQL", "Python", "Power BI"), "Junior", "PR", List.of("PCD"), 30, false),
            createJob(company, "Scrum Master", "Facilitador agil com experiencia em squads", List.of("Scrum", "Kanban", "Jira"), "Pleno", "SP,MG", List.of("GENERO", "RACIAL"), 45, false),
            createJob(company, "Backend Kotlin", "Desenvolvedor backend Kotlin", List.of("Kotlin", "Spring Boot", "PostgreSQL"), "Pleno", "RS", List.of("PCD", "RACIAL"), 35, false),
            createJob(company, "Engenheiro ML", "Machine Learning Engineer", List.of("Python", "TensorFlow", "MLOps", "Docker"), "Senior", "SP", List.of("RACIAL"), 30, false),
            createJob(company, "Dev Rust", "Desenvolvedor Rust para sistemas de alta performance", List.of("Rust", "C++", "Linux"), "Senior", "BA", List.of("PCD"), 25, false),
            createJob(company, "Dev Go", "Desenvolvedor Go para microservicos", List.of("Go", "gRPC", "Kubernetes", "PostgreSQL"), "Pleno", "PR", List.of("GENERO"), 40, false),
            createJob(company, "iOS Developer", "Desenvolvedor iOS nativo", List.of("Swift", "UIKit", "CoreData"), "Pleno", "SC", List.of("PCD", "GENERO"), 35, false),
            createJob(company, "Blockchain Dev", "Desenvolvedor Web3 e Smart Contracts", List.of("Solidity", "Ethereum", "Node.js"), "Senior", "DF", List.of("RACIAL", "LGBTQIA"), 30, true),
            createJob(company, "Fullstack Node", "Fullstack com Node.js e Angular", List.of("Node.js", "Angular", "MongoDB", "TypeScript"), "Pleno", "MG,RJ", List.of("GENERO", "PCD"), 45, false)
        );

        jobRepository.saveAll(jobs);
    }

    private Company createSeedCompany() {
        ResponsavelRh rh = new ResponsavelRh();
        rh.setNome("Ana Silva");
        rh.setEmail("ana@appbit.com");
        rh.setCargo("Head de Diversidade");

        Company company = new Company();
        company.setCnpj("12.345.678/0001-90");
        company.setRazaoSocial("App Bit Ltda");
        company.setNomeFantasia("App Bit");
        company.setPorte("Médio");
        company.setSegmento("Tecnologia");
        company.setSetorAtuacao("Fintech");
        company.setLocalizacaoMatriz("SP");
        company.setRegioesAtuacao(List.of("SP", "RJ", "MG"));
        company.setQtdColaboradores(150);
        company.setPercentualDiversidade(30);
        company.setPrazoMetaEsg("2026-12");
        company.setResponsavelRh(rh);
        company.setSenha(passwordEncoder.encode("senha123"));
        return company;
    }

    private Job createJob(Company company, String titulo, String descricao, List<String> skills, String nivel, String regiao, List<String> gruposFoco, Integer diversidadeMinima, Boolean exclusivo) {
        Job job = new Job();
        job.setCompany(company);
        job.setTitulo(titulo);
        job.setDescricao(descricao);
        job.setSkills(skills);
        job.setNivel(nivel);
        job.setRegiao(regiao);
        job.setGruposFoco(gruposFoco);
        job.setDiversidadeMinima(diversidadeMinima);
        job.setExclusivo(exclusivo);
        return job;
    }
}
