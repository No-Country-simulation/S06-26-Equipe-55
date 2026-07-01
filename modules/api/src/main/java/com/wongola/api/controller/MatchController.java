package com.wongola.api.controller;

import com.wongola.api.dto.MatchRequest;
import com.wongola.api.dto.MatchResponse;
import com.wongola.api.service.MatchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/match")
@Tag(name = "Matching", description = "Matching de candidatos com vagas")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping
    @Operation(summary = "Realizar matching", description = "Retorna candidatos ranqueados por compatibilidade com a vaga")
    @ApiResponse(responseCode = "200", description = "Matching realizado com sucesso")
    @ApiResponse(responseCode = "400", description = "Vaga não encontrada ou não pertence à empresa")
    public ResponseEntity<MatchResponse> match(@Valid @RequestBody MatchRequest request, Authentication authentication) {
        Long companyId = (Long) authentication.getDetails();
        MatchResponse response = matchService.match(request.jobId(), companyId);
        return ResponseEntity.ok(response);
    }
}
