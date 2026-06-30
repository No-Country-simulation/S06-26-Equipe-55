package com.wongola.core.repository;

import com.wongola.core.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByResponsavelRhEmail(String email);
}
