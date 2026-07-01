package com.wongola.api.provider;

import com.wongola.api.dto.CandidateDTO;

import java.util.List;

public interface CandidateProvider {
    List<CandidateDTO> findAll();
}
