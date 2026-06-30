package com.wongola.api.controller;

import com.wongola.api.dto.JobRequest;
import com.wongola.api.dto.JobResponse;
import com.wongola.api.service.JobService;
import com.wongola.core.entity.Job;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Vagas", description = "Publicação de vagas")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    @Operation(summary = "Publicar vaga", description = "Publica uma nova vaga vinculada a uma empresa")
    @ApiResponse(responseCode = "201", description = "Vaga publicada com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos ou empresa não encontrada")
    public ResponseEntity<JobResponse> create(@Valid @RequestBody JobRequest request) {
        Job job = jobService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(JobResponse.from(job));
    }
}
