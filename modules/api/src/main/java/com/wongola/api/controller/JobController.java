package com.wongola.api.controller;

import com.wongola.api.dto.JobRequest;
import com.wongola.api.dto.JobResponse;
import com.wongola.api.dto.SimulationResponse;
import com.wongola.api.service.JobService;
import com.wongola.api.service.SimulationService;
import com.wongola.core.entity.Job;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Vagas", description = "Publicação e listagem de vagas")
public class JobController {

    private final JobService jobService;
    private final SimulationService simulationService;

    public JobController(JobService jobService, SimulationService simulationService) {
        this.jobService = jobService;
        this.simulationService = simulationService;
    }

    @PostMapping
    @Operation(summary = "Publicar vaga", description = "Publica uma nova vaga vinculada a uma empresa")
    @ApiResponse(responseCode = "201", description = "Vaga publicada com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos ou empresa não encontrada")
    public ResponseEntity<JobResponse> create(@Valid @RequestBody JobRequest request) {
        Job job = jobService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(JobResponse.from(job));
    }

    @GetMapping
    @Operation(summary = "Listar vagas da empresa", description = "Retorna as vagas publicadas pela empresa autenticada")
    @ApiResponse(responseCode = "200", description = "Lista de vagas")
    public ResponseEntity<List<JobResponse>> listByCompany(Authentication authentication) {
        Long companyId = (Long) authentication.getDetails();
        List<JobResponse> jobs = jobService.findByCompany(companyId).stream()
                .map(JobResponse::from)
                .toList();
        return ResponseEntity.ok(jobs);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Editar vaga", description = "Atualiza os dados de uma vaga existente")
    @ApiResponse(responseCode = "200", description = "Vaga atualizada com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos ou vaga não pertence à empresa")
    public ResponseEntity<JobResponse> update(@PathVariable Long id, @RequestBody JobRequest request, Authentication authentication) {
        Long companyId = (Long) authentication.getDetails();
        Job job = jobService.update(id, request, companyId);
        return ResponseEntity.ok(JobResponse.from(job));
    }

    @PostMapping("/simulate")
    @Operation(summary = "Simular impacto da vaga", description = "Analisa o impacto de cada critério no alcance de candidatos antes de publicar")
    @ApiResponse(responseCode = "200", description = "Simulação realizada")
    public ResponseEntity<SimulationResponse> simulate(@RequestBody JobRequest request) {
        SimulationResponse response = simulationService.simulate(request);
        return ResponseEntity.ok(response);
    }
}
