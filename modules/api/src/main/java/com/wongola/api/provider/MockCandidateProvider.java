package com.wongola.api.provider;

import com.wongola.api.dto.CandidateDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MockCandidateProvider implements CandidateProvider {

    @Override
    public List<CandidateDTO> findAll() {
        return List.of(
                new CandidateDTO(1L, "João Silva", "Backend Developer", "Pleno",
                        List.of("Java", "Spring Boot", "PostgreSQL"), "Microsserviços",
                        List.of("RACIAL"), "joao.silva@email.com", "11999990001", "São Paulo - SP", "Brasil", 10),

                new CandidateDTO(2L, "Maria Santos", "Frontend Developer", "Junior",
                        List.of("React", "TypeScript", "CSS"), "IA Aplicada",
                        List.of("GENERO"), "maria.santos@email.com", "21999990002", "Rio de Janeiro - RJ", "Brasil", 25),

                new CandidateDTO(3L, "Carlos Oliveira", "Fullstack Developer", "Pleno",
                        List.of("Java", "React", "Docker"), "Cloud",
                        List.of("PCD"), "carlos.oliveira@email.com", "31999990003", "Belo Horizonte - MG", "Brasil", 15),

                new CandidateDTO(4L, "Ana Souza", "Backend Developer", "Senior",
                        List.of("Java", "Spring Boot", "Kafka", "AWS"), "Arquitetura",
                        List.of("RACIAL", "PCD"), "ana.souza@email.com", "11999990004", "São Paulo - SP", "Brasil", 5),

                new CandidateDTO(5L, "Lúcia Ferreira", "Data Engineer", "Pleno",
                        List.of("Python", "SQL", "Spark"), "Big Data",
                        List.of("GENERO"), "lucia.ferreira@email.com", "41999990005", "Curitiba - PR", "Brasil", 30),

                new CandidateDTO(6L, "Pedro Lima", "Backend Developer", "Junior",
                        List.of("Java", "Spring Boot"), "APIs REST",
                        List.of("RACIAL"), "pedro.lima@email.com", "51999990006", "Porto Alegre - RS", "Brasil", 35),

                new CandidateDTO(7L, "Fernanda Costa", "Mobile Developer", "Pleno",
                        List.of("Kotlin", "Swift", "Flutter"), "Mobile",
                        List.of("PCD", "GENERO"), "fernanda.costa@email.com", "61999990007", "Brasília - DF", "Brasil", 20),

                new CandidateDTO(8L, "Marcos Pereira", "DevOps Engineer", "Senior",
                        List.of("Docker", "Kubernetes", "AWS", "Terraform"), "Infraestrutura",
                        List.of("RACIAL"), "marcos.pereira@email.com", "71999990008", "Salvador - BA", "Brasil", 8)
        );
    }
}
