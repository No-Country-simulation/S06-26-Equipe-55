import { describe, it, expect } from 'vitest';

// Simula a lógica do heatmap: cada critério avaliado isoladamente
function calculateExclusion(totalCandidatos, candidatosElegiveis) {
  if (totalCandidatos === 0) return 100;
  return Math.round(((totalCandidatos - candidatosElegiveis) / totalCandidatos) * 100);
}

function buildExclusionList(simResults) {
  return simResults
    .filter(Boolean)
    .filter(item => item.exclusion > 0)
    .sort((a, b) => a.exclusion - b.exclusion);
}

describe('Heatmap de exclusão', () => {
  it('should calculate 100% exclusion when no candidates match', () => {
    expect(calculateExclusion(8, 0)).toBe(100);
  });

  it('should calculate 0% exclusion when all candidates match', () => {
    expect(calculateExclusion(8, 8)).toBe(0);
  });

  it('should calculate 50% exclusion when half match', () => {
    expect(calculateExclusion(8, 4)).toBe(50);
  });

  it('should calculate 75% exclusion when 2 of 8 match', () => {
    expect(calculateExclusion(8, 2)).toBe(75);
  });

  it('should sort from lowest to highest exclusion', () => {
    const results = [
      { name: 'Rust', exclusion: 100 },
      { name: 'Java', exclusion: 50 },
      { name: 'Pleno', exclusion: 50 },
      { name: 'SP', exclusion: 75 },
    ];
    const sorted = buildExclusionList(results);
    expect(sorted[0].name).toBe('Java');
    expect(sorted[sorted.length - 1].name).toBe('Rust');
  });

  it('should filter out 0% exclusion criteria', () => {
    const results = [
      { name: 'Java', exclusion: 50 },
      { name: 'Qualquer', exclusion: 0 },
    ];
    const sorted = buildExclusionList(results);
    expect(sorted.length).toBe(1);
    expect(sorted[0].name).toBe('Java');
  });

  it('should handle null results', () => {
    const results = [null, { name: 'Java', exclusion: 50 }, null];
    const sorted = buildExclusionList(results);
    expect(sorted.length).toBe(1);
  });
});
