import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../shared/services/api';

function SkillComparison({ job, candidate }) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 5;

  const jobSkills = [...job.skills, job.nivel];
  const candidateSkills = [...candidate.skills, candidate.nivel];
  const showToggle = jobSkills.length > LIMIT || candidateSkills.length > LIMIT;

  const displayJobSkills = expanded ? jobSkills : jobSkills.slice(0, LIMIT);
  const displayCandidateSkills = expanded ? candidateSkills : candidateSkills.slice(0, LIMIT);

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Vaga pede</p>
          <div className="flex flex-wrap gap-1">
            {displayJobSkills.map(s => (
              <span key={s} className={`text-xs px-2 py-1 rounded ${
                candidateSkills.some(cs => cs.toLowerCase() === s.toLowerCase())
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}>{s}</span>
            ))}
            {!expanded && jobSkills.length > LIMIT && (
              <span className="text-xs text-gray-400">+{jobSkills.length - LIMIT}</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Candidato oferece</p>
          <div className="flex flex-wrap gap-1">
            {displayCandidateSkills.map(s => (
              <span key={s} className={`text-xs px-2 py-1 rounded ${
                jobSkills.some(js => js.toLowerCase() === s.toLowerCase())
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>{s}</span>
            ))}
            {!expanded && candidateSkills.length > LIMIT && (
              <span className="text-xs text-gray-400">+{candidateSkills.length - LIMIT}</span>
            )}
          </div>
        </div>
      </div>
      {showToggle && (
        <button onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline mt-2 cursor-pointer">
          {expanded ? 'Ver menos' : 'Ver todos os critérios'}
        </button>
      )}
    </div>
  );
}

export function MatchPage() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(searchParams.get('job') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    api.get('/jobs').then(setJobs).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedJob && jobs.length > 0) handleMatch();
  }, [jobs]);

  const handleMatch = async () => {
    if (!selectedJob) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.post('/match', { jobId: parseInt(selectedJob) });
      setResult(data);
    } catch (err) {
      setError(err.data?.errors?.[0] || 'Erro ao realizar matching');
    } finally {
      setLoading(false);
    }
  };

  const sortCandidates = (candidates) => {
    if (!candidates) return [];
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

  const sortedCandidates = result ? sortCandidates(result.candidatos) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Matching de Candidatos</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Selecione a vaga</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">-- Selecione --</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.titulo} ({job.nivel})</option>
            ))}
          </select>
          <button onClick={handleMatch} disabled={loading || !selectedJob}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light disabled:opacity-50 w-full sm:w-auto cursor-pointer">
            {loading ? 'Buscando...' : 'Buscar Candidatos'}
          </button>
        </div>
      </div>

      {error && <p className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}

      {result && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 text-center group relative">
              <p className="text-2xl font-bold text-primary">{sortedCandidates.length}</p>
              <p className="text-sm text-gray-500">Candidatos compatíveis</p>
              <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap">Candidatos que possuem pelo menos 1 skill da vaga</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center group relative">
              <p className="text-2xl font-bold text-primary">{result.totalAnalisados}</p>
              <p className="text-sm text-gray-500">Total analisados</p>
              <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap">Total de candidatos avaliados para esta vaga</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center group relative">
              <p className="text-2xl font-bold text-primary">{result.diversidadeResultado}%</p>
              <p className="text-sm text-gray-500">Diversidade no resultado</p>
              <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap">% de candidatos que atendem aos grupos de diversidade da vaga</span>
            </div>
          </div>

          <div className="flex justify-start mb-4">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
              <option value="score">Ordenar por: Maior score</option>
              <option value="score_asc">Ordenar por: Menor score</option>
              <option value="gap">Ordenar por: Menor gap</option>
              <option value="gap_desc">Ordenar por: Maior gap</option>
              <option value="nivel">Ordenar por: Nível</option>
              <option value="diversidade">Ordenar por: Diversidade primeiro</option>
            </select>
          </div>

          <div className="space-y-4">
            {sortedCandidates.map(c => {
              const currentJob = jobs.find(j => j.id === parseInt(selectedJob));
              return (
              <div key={c.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-primary">{c.nome}</h2>
                      {c.badgeDiversidade && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium whitespace-nowrap">🌍 Diversidade</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{c.perfil} • {c.nivel}</p>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>📧 {c.email}</p>
                      <p>📱 {c.telefone}</p>
                      <p>📍 {c.cidade} • {c.pais}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{c.score}%</p>
                    <p className="text-xs text-gray-500">compatibilidade</p>
                    <p className="text-xs text-red-400 mt-1">gap {c.gapPorcentual}%</p>
                  </div>
                </div>

                {currentJob && <SkillComparison job={currentJob} candidate={c} />}
              </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
