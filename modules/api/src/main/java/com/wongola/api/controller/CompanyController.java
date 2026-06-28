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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "Empresas", description = "Cadastro de empresas")
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
}
