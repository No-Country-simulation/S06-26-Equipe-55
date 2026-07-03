package com.wongola.api.service;

import com.wongola.api.dto.CandidateDTO;
import com.wongola.api.dto.JobRequest;
import com.wongola.api.dto.SimulationResponse;
import com.wongola.api.provider.CandidateProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SimulationServiceTest {

    @Mock
    private CandidateProvider candidateProvider;

    @InjectMocks
    private SimulationService simulationService;

    private List<CandidateDTO> mockCandidates() {
        return List.of(
                new CandidateDTO(1L, "João", "Backend", "Pleno", List.of("Java", "Spring Boot"), "Micro", List.of("RACIAL"), "j@e.com", "11999", "São Paulo - SP", "Brasil", 10),
                new CandidateDTO(2L, "Maria", "Frontend", "Junior", List.of("React", "TypeScript"), "IA", List.of("GENERO"), "m@e.com", "21999", "Rio de Janeiro - RJ", "Brasil", 25),
                new CandidateDTO(3L, "Carlos", "Fullstack", "Pleno", List.of("Java", "React"), "Cloud", List.of("PCD"), "c@e.com", "31999", "Belo Horizonte - MG", "Brasil", 15),
                new CandidateDTO(4L, "Ana", "Backend", "Senior", List.of("Java", "Spring Boot", "AWS"), "Arq", List.of("RACIAL", "PCD"), "a@e.com", "11999", "São Paulo - SP", "Brasil", 5)
        );
    }

    @Test
    void shouldReturnAllCandidatesWhenNoCriteria() {
        when(candidateProvider.findAll()).thenReturn(mockCandidates());
        JobRequest request = new JobRequest(1L, "test", "test", List.of(), null, null, null, null, null, null);
        SimulationResponse response = simulationService.simulate(request);
        assertEquals(4, response.totalCandidatos());
        assertEquals(4, response.candidatosElegiveis());
        assertTrue(response.impactoPorCriterio().isEmpty());
    }

    @Test
    void shouldFilterBySkill() {
        when(candidateProvider.findAll()).thenReturn(mockCandidates());
        JobRequest request = new JobRequest(1L, "test", "test", List.of("Java"), null, null, null, null, null, null);
        SimulationResponse response = simulationService.simulate(request);
        assertEquals(4, response.totalCandidatos());
        assertEquals(3, response.candidatosElegiveis());
    }

    @Test
    void shouldFilterByNivel() {
        when(candidateProvider.findAll()).thenReturn(mockCandidates());
        JobRequest request = new JobRequest(1L, "test", "test", List.of(), "Pleno", null, null, null, null, null);
        SimulationResponse response = simulationService.simulate(request);
        assertEquals(2, response.candidatosElegiveis());
    }

    @Test
    void shouldFilterByRegion() {
        when(candidateProvider.findAll()).thenReturn(mockCandidates());
        JobRequest request = new JobRequest(1L, "test", "test", List.of(), null, "SP", null, null, null, null);
        SimulationResponse response = simulationService.simulate(request);
        assertEquals(2, response.candidatosElegiveis());
    }

    @Test
    void shouldReturnZeroForNonExistentRegion() {
        when(candidateProvider.findAll()).thenReturn(mockCandidates());
        JobRequest request = new JobRequest(1L, "test", "test", List.of(), null, "AC", null, null, null, null);
        SimulationResponse response = simulationService.simulate(request);
        assertEquals(0, response.candidatosElegiveis());
    }

    @Test
    void shouldCalculateImpactPerCriteria() {
        when(candidateProvider.findAll()).thenReturn(mockCandidates());
        JobRequest request = new JobRequest(1L, "test", "test", List.of("Java"), "Pleno", "SP", null, null, null, null);
        SimulationResponse response = simulationService.simulate(request);
        assertEquals(1, response.candidatosElegiveis());
        assertFalse(response.impactoPorCriterio().isEmpty());
    }

    @Test
    void shouldCalculateDiversityPercentage() {
        when(candidateProvider.findAll()).thenReturn(mockCandidates());
        JobRequest request = new JobRequest(1L, "test", "test", List.of("Java"), null, null, List.of("PCD"), null, null, null);
        SimulationResponse response = simulationService.simulate(request);
        assertEquals(3, response.candidatosElegiveis());
        assertEquals(66, response.diversidadeEstimada());
    }

    @Test
    void shouldIgnoreBrasilAsRegion() {
        when(candidateProvider.findAll()).thenReturn(mockCandidates());
        JobRequest request = new JobRequest(1L, "test", "test", List.of(), null, "BRASIL", null, null, null, null);
        SimulationResponse response = simulationService.simulate(request);
        assertEquals(4, response.totalCandidatos());
        assertEquals(4, response.candidatosElegiveis());
    }
}
