import { describe, it, expect } from 'vitest';

const sortCandidates = (candidates, sortBy) => {
  const sorted = [...candidates];
  switch (sortBy) {
    case 'score': return sorted.sort((a, b) => b.score - a.score);
    case 'score_asc': return sorted.sort((a, b) => a.score - b.score);
    case 'gap': return sorted.sort((a, b) => a.gapPorcentual - b.gapPorcentual);
    case 'gap_desc': return sorted.sort((a, b) => b.gapPorcentual - a.gapPorcentual);
    case 'nivel': {
      const order = { 'Senior': 1, 'Pleno': 2, 'Junior': 3 };
      return sorted.sort((a, b) => (order[a.nivel] || 4) - (order[b.nivel] || 4));
    }
    case 'diversidade': return sorted.sort((a, b) => (b.badgeDiversidade ? 1 : 0) - (a.badgeDiversidade ? 1 : 0));
    default: return sorted;
  }
};

const candidates = [
  { id: 1, nome: 'Ana', score: 95, gapPorcentual: 5, nivel: 'Senior', badgeDiversidade: true },
  { id: 2, nome: 'João', score: 50, gapPorcentual: 50, nivel: 'Junior', badgeDiversidade: false },
  { id: 3, nome: 'Carlos', score: 75, gapPorcentual: 25, nivel: 'Pleno', badgeDiversidade: true },
];

describe('sortCandidates', () => {
  it('should sort by highest score', () => {
    const result = sortCandidates(candidates, 'score');
    expect(result[0].nome).toBe('Ana');
    expect(result[2].nome).toBe('João');
  });

  it('should sort by lowest score', () => {
    const result = sortCandidates(candidates, 'score_asc');
    expect(result[0].nome).toBe('João');
    expect(result[2].nome).toBe('Ana');
  });

  it('should sort by lowest gap', () => {
    const result = sortCandidates(candidates, 'gap');
    expect(result[0].gapPorcentual).toBe(5);
    expect(result[2].gapPorcentual).toBe(50);
  });

  it('should sort by highest gap', () => {
    const result = sortCandidates(candidates, 'gap_desc');
    expect(result[0].gapPorcentual).toBe(50);
    expect(result[2].gapPorcentual).toBe(5);
  });

  it('should sort by nivel (Senior > Pleno > Junior)', () => {
    const result = sortCandidates(candidates, 'nivel');
    expect(result[0].nivel).toBe('Senior');
    expect(result[1].nivel).toBe('Pleno');
    expect(result[2].nivel).toBe('Junior');
  });

  it('should sort by diversidade first', () => {
    const result = sortCandidates(candidates, 'diversidade');
    expect(result[0].badgeDiversidade).toBe(true);
    expect(result[1].badgeDiversidade).toBe(true);
    expect(result[2].badgeDiversidade).toBe(false);
  });
});
