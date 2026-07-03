import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';
import { DiversitySelect } from '../../shared/components/DiversitySelect';

export function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get('/jobs').then(jobs => {
      const found = jobs.find(j => j.id === parseInt(id));
      if (found) {
        setJob(found);
        setForm({
          titulo: found.titulo,
          descricao: found.descricao,
          skills: found.skills.join(', '),
          nivel: found.nivel,
          regiao: found.regiao,
          gruposFoco: found.gruposFoco || [],
          diversidadeMinima: found.diversidadeMinima || '',
          exclusivo: found.exclusivo || false
        });
      } else setError('Vaga não encontrada');
    }).catch(() => setError('Erro ao carregar vaga'));
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updated = await api.patch(`/jobs/${id}`, {
        empresaId: user.empresaId,
        titulo: form.titulo,
        descricao: form.descricao,
        skills: form.skills.split(',').map(s => s.trim()),
        nivel: form.nivel,
        regiao: form.regiao,
        gruposFoco: form.gruposFoco,
        diversidadeMinima: form.diversidadeMinima ? parseInt(form.diversidadeMinima) : null,
        exclusivo: form.exclusivo
      });
      setJob(updated);
      setEditing(false);
      setSuccess('Vaga atualizada com sucesso!');
    } catch (err) {
      setError(err.data?.errors?.join(', ') || 'Erro ao atualizar vaga');
    } finally {
      setLoading(false);
    }
  };

  if (!job && !error) return (
    <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-500">Carregando...</p></div>
  );

  if (error && !job) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <p className="text-red-600">{error}</p>
      <Link to="/jobs" className="text-primary hover:underline mt-4 inline-block">← Voltar</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/jobs" className="text-primary hover:underline text-sm">← Voltar para vagas</Link>

      {success && <p className="bg-green-50 text-green-600 p-3 rounded mt-4 text-sm">{success}</p>}
      {error && <p className="bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">{error}</p>}

      <div className="bg-white rounded-lg shadow-md p-8 mt-4">
        {!editing ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-primary">{job.titulo}</h1>
              </div>
              <div className="flex gap-2 items-center mt-2 sm:mt-0">
                <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded font-medium">{job.nivel}</span>
                <button onClick={() => setEditing(true)}
                  className="bg-primary text-white text-sm px-4 py-1 rounded hover:bg-primary-light cursor-pointer">
                  ✏️ Editar
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase">Descrição</h2>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{job.descricao}</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase">Skills Requeridas</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills.map(s => (
                    <span key={s} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded">{s}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase">Região</h2>
                  <p className="text-gray-700 mt-1">📍 {job.regiao}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase">Publicada em</h2>
                  <p className="text-gray-700 mt-1">📅 {new Date(job.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {job.gruposFoco?.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase">Grupos de Diversidade Foco</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.gruposFoco.map(g => (
                      <span key={g} className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded">{g}</span>
                    ))}
                  </div>
                  {job.exclusivo && (
                    <p className="text-sm text-amber-600 mt-2">🔒 Vaga exclusiva para esses grupos</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.diversidadeMinima && (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase">Diversidade Mínima</h2>
                    <p className="text-gray-700 mt-1">📊 {job.diversidadeMinima}%</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <Link to={`/match?job=${job.id}`}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light inline-block">
                Buscar Candidatos para esta Vaga
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-xl font-bold text-primary">Editar Vaga</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input name="titulo" value={form.titulo} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
                <input name="nivel" value={form.nivel} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (separadas por vírgula)</label>
                <input name="skills" value={form.skills} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
                <input name="regiao" value={form.regiao} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupos Foco</label>
                <DiversitySelect value={form.gruposFoco} onChange={(val) => setForm({ ...form, gruposFoco: val })} />
                {form.gruposFoco.length > 0 && (
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" name="exclusivo" checked={form.exclusivo} onChange={handleChange} className="rounded" />
                    <span className="text-sm text-gray-600">Vaga exclusiva para esses grupos</span>
                  </label>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diversidade Mínima (%)</label>
                <input name="diversidadeMinima" type="number" value={form.diversidadeMinima} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows="4" maxLength="3000"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light disabled:opacity-50">
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" onClick={() => setEditing(false)}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
