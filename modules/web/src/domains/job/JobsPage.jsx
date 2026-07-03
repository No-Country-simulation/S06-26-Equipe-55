import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';
import { DiversitySelect } from '../../shared/components/DiversitySelect';
import { RegionSelect } from '../../shared/components/RegionSelect';

export function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    titulo: '', descricao: '', skills: '', nivel: '', regiao: [],
    gruposFoco: [], diversidadeMinima: ''
  });
  const [simulation, setSimulation] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => { loadJobs(); }, []);

  useEffect(() => {
    if (showForm) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runSimulation(form), 500);
    }
  }, [form, showForm]);

  const loadJobs = async () => {
    try {
      const data = await api.get('/jobs');
      setJobs(data);
    } catch (err) {
      setError('Erro ao carregar vagas');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const runSimulation = async (currentForm) => {
    const skills = currentForm.skills ? currentForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const nivel = currentForm.nivel ? currentForm.nivel.trim() : '';
    const regiao = currentForm.regiao && currentForm.regiao.length > 0 ? currentForm.regiao : [];

    if (skills.length === 0 && !nivel && regiao.length === 0) {
      setSimulation({ totalCandidatos: 8, candidatosElegiveis: 8, impactoPorCriterio: [], diversidadeEstimada: 0, empty: true });
      return;
    }

    try {
      const data = await api.post('/jobs/simulate', {
        empresaId: user.empresaId,
        titulo: currentForm.titulo || 'Simulação',
        descricao: currentForm.descricao || 'Simulação',
        skills: skills.length > 0 ? skills : [],
        nivel: nivel || null,
        regiao: regiao.includes('BRASIL') ? null : regiao.join(','),
        gruposFoco: currentForm.gruposFoco || [],
        diversidadeMinima: currentForm.diversidadeMinima ? parseInt(currentForm.diversidadeMinima) : null
      });
      setSimulation(data);
    } catch (err) {
      setSimulation({ totalCandidatos: 8, candidatosElegiveis: 0, impactoPorCriterio: [], diversidadeEstimada: 0, empty: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/jobs', {
        empresaId: user.empresaId,
        titulo: form.titulo,
        descricao: form.descricao,
        skills: form.skills.split(',').map(s => s.trim()),
        nivel: form.nivel,
        regiao: form.regiao.includes('BRASIL') ? 'BRASIL' : form.regiao.join(', '),
        gruposFoco: form.gruposFoco,
        diversidadeMinima: form.diversidadeMinima ? parseInt(form.diversidadeMinima) : null
      });
      setShowForm(false);
      setForm({ titulo: '', descricao: '', skills: '', nivel: '', regiao: [], gruposFoco: [], diversidadeMinima: '' });
      setSimulation(null);
      loadJobs();
    } catch (err) {
      setError(err.data?.errors?.join(', ') || 'Erro ao criar vaga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Minhas Vagas</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light w-full sm:w-auto cursor-pointer">
          {showForm ? 'Cancelar' : '+ Nova Vaga'}
        </button>
      </div>

      {error && <p className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input name="titulo" value={form.titulo} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
              <select name="nivel" value={form.nivel} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer" required>
                <option value="">Selecione...</option>
                <option value="Junior">Junior</option>
                <option value="Pleno">Pleno</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (separadas por vírgula)</label>
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="Java, Spring Boot"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
              <RegionSelect value={form.regiao} onChange={(val) => setForm({ ...form, regiao: val })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupos Foco (opcional)</label>
              <DiversitySelect value={form.gruposFoco} onChange={(val) => setForm({ ...form, gruposFoco: val })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diversidade Mínima (%)</label>
              <input name="diversidadeMinima" type="number" value={form.diversidadeMinima} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea name="descricao" value={form.descricao} onChange={handleChange} rows="3" maxLength="3000"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light disabled:opacity-50 cursor-pointer">
              {loading ? 'Publicando...' : 'Publicar Vaga'}
            </button>
          </div>

          {simulation && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-3">⚡ Prévia de alcance</h3>

              {simulation.empty ? (
                <p className="text-sm text-gray-600">
                  🎯 Adicione skills ou nível para visualizar o alcance da vaga entre os <span className="font-bold">{simulation.totalCandidatos || 'todos os'}</span> candidatos da base.
                </p>
              ) : simulation.candidatosElegiveis === simulation.totalCandidatos ? (
                <p className="text-sm text-green-700">
                  ✅ Todos os <span className="font-bold">{simulation.totalCandidatos}</span> candidatos da base atendem aos critérios atuais. Você pode adicionar mais requisitos para refinar a busca.
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Com os critérios atuais, <span className="font-bold text-primary">{simulation.candidatosElegiveis}</span> de <span className="font-bold">{simulation.totalCandidatos}</span> candidatos atendem a todos os requisitos.
                    {simulation.diversidadeEstimada > 0 && (
                      <> Destes, <span className="font-bold text-green-600">{simulation.diversidadeEstimada}%</span> pertencem aos grupos de diversidade selecionados.</>  
                    )}
                  </p>
                  {simulation.impactoPorCriterio.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Impacto de cada critério:</p>
                      <div className="space-y-2">
                        {simulation.impactoPorCriterio.map(c => (
                          <div key={c.criterio} className="flex items-start gap-2 text-sm bg-white p-2 rounded border border-amber-100">
                            <span>{c.ganho > 0 ? '💡' : '🔒'}</span>
                            <span className="text-gray-700">
                              {c.ganho > 0 ? (
                                <>Remover <span className="font-semibold">"{c.criterio}"</span> aumentaria o alcance para <span className="font-bold text-green-600">{c.semEsse}</span> candidatos <span className="text-green-600">(+{c.ganho})</span></>
                              ) : (
                                <><span className="font-semibold">"{c.criterio}"</span> — nenhum candidato adicional mesmo removendo este critério</>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {simulation.candidatosElegiveis === 0 && simulation.impactoPorCriterio.every(c => c.ganho === 0) && (
                    <p className="text-sm text-red-600">⚠️ Nenhum candidato na base atende a esses critérios. Considere flexibilizar os requisitos.</p>
                  )}
                </>
              )}
            </div>
          )}
        </form>
      )}

      <div className="space-y-4">
        {jobs.length === 0 && <p className="text-gray-500 text-center py-8">Nenhuma vaga publicada ainda.</p>}
        {jobs.map(job => (
          <Link to={`/jobs/${job.id}`} key={job.id} className="block cursor-pointer">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-primary">{job.titulo}</h2>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{job.descricao}</p>
                </div>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">{job.nivel}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.skills.slice(0, 4).map(s => (
                  <span key={s} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{s}</span>
                ))}
                {job.skills.length > 4 && <span className="text-gray-400 text-xs">+{job.skills.length - 4}</span>}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span>📍 {job.regiao}</span>
                {job.gruposFoco?.length > 0 && <span>🎯 {job.gruposFoco.join(', ')}</span>}
                <span>📅 {new Date(job.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
