package com.wongola.api.provider;

import com.wongola.api.dto.CandidateDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MockCandidateProvider implements CandidateProvider {

    @Override
    public List<CandidateDTO> findAll() {
        return List.of(
                new CandidateDTO(1L, "Backend Developer", "Pleno",
                        List.of("Java", "Spring Boot", "PostgreSQL"), "Microsserviços",
                        List.of("RACIAL"), "joao@email.com", "11999990001", "Brasil", 10),

                new CandidateDTO(2L, "Frontend Developer", "Junior",
                        List.of("React", "TypeScript", "CSS"), "IA Aplicada",
                        List.of("GENERO"), "maria@email.com", "11999990002", "Brasil", 25),

                new CandidateDTO(3L, "Fullstack Developer", "Pleno",
                        List.of("Java", "React", "Docker"), "Cloud",
                        List.of("PCD"), "carlos@email.com", "11999990003", "Brasil", 15),

                new CandidateDTO(4L, "Backend Developer", "Senior",
                        List.of("Java", "Spring Boot", "Kafka", "AWS"), "Arquitetura",
                        List.of("RACIAL", "PCD"), "ana@email.com", "11999990004", "Brasil", 5),

                new CandidateDTO(5L, "Data Engineer", "Pleno",
                        List.of("Python", "SQL", "Spark"), "Big Data",
                        List.of("GENERO"), "lucia@email.com", "11999990005", "Brasil", 30),

                new CandidateDTO(6L, "Backend Developer", "Junior",
                        List.of("Java", "Spring Boot"), "APIs REST",
                        List.of("RACIAL"), "pedro@email.com", "11999990006", "Brasil", 35),

                new CandidateDTO(7L, "Mobile Developer", "Pleno",
                        List.of("Kotlin", "Swift", "Flutter"), "Mobile",
                        List.of("PCD", "GENERO"), "fernanda@email.com", "11999990007", "Brasil", 20),

                new CandidateDTO(8L, "DevOps Engineer", "Senior",
                        List.of("Docker", "Kubernetes", "AWS", "Terraform"), "Infraestrutura",
                        List.of("RACIAL"), "marcos@email.com", "11999990008", "Brasil", 8)
        );
    }
}
