package com.wongola.api.controller;

import com.wongola.api.dto.CompanyRequest;
import com.wongola.api.service.CompanyService;
import com.wongola.core.entity.Company;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "Empresas", description = "Cadastro e gestão de empresas")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    @Operation(summary = "Cadastrar empresa", description = "Realiza o cadastro de uma nova empresa")
    @ApiResponse(responseCode = "201", description = "Empresa cadastrada com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    public ResponseEntity<Company> create(@Valid @RequestBody CompanyRequest request) {
        Company company = companyService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(company);
    }

    @GetMapping("/me")
    @Operation(summary = "Dados da empresa", description = "Retorna os dados da empresa autenticada")
    @ApiResponse(responseCode = "200", description = "Dados da empresa")
    public ResponseEntity<Company> getProfile(Authentication authentication) {
        Long companyId = (Long) authentication.getDetails();
        Company company = companyService.findById(companyId);
        return ResponseEntity.ok(company);
    }

    @PatchMapping("/me")
    @Operation(summary = "Editar empresa", description = "Atualiza os dados da empresa autenticada")
    @ApiResponse(responseCode = "200", description = "Empresa atualizada com sucesso")
    public ResponseEntity<Company> updateProfile(@RequestBody CompanyRequest request, Authentication authentication) {
        Long companyId = (Long) authentication.getDetails();
        Company company = companyService.update(companyId, request);
        return ResponseEntity.ok(company);
    }
}
