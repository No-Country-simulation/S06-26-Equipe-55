import { useState, useEffect } from 'react';
import { api } from '../../shared/services/api';
import { RegionSelect } from '../../shared/components/RegionSelect';
import { StateSelect } from '../../shared/components/StateSelect';

function Field({ label, name, type = 'text', disabled = false, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} disabled={disabled}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100" />
    </div>
  );
}

export function ProfilePage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    api.get('/companies/me').then(data => {
      setForm({
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        cnpj: data.cnpj,
        porte: data.porte,
        segmento: data.segmento,
        setorAtuacao: data.setorAtuacao,
        localizacaoMatriz: data.localizacaoMatriz,
        regioesAtuacao: data.regioesAtuacao || [],
        qtdColaboradores: data.qtdColaboradores,
        percentualDiversidade: data.percentualDiversidade || '',
        prazoMetaEsg: data.prazoMetaEsg || '',
        nome: data.responsavelRh?.nome || '',
        email: data.responsavelRh?.email || '',
        cargo: data.responsavelRh?.cargo || ''
      });
    }).catch(() => setError('Erro ao carregar dados'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const body = {
        razaoSocial: form.razaoSocial,
        nomeFantasia: form.nomeFantasia,
        porte: form.porte,
        segmento: form.segmento,
        setorAtuacao: form.setorAtuacao,
        localizacaoMatriz: form.localizacaoMatriz,
        regioesAtuacao: form.regioesAtuacao,
        qtdColaboradores: parseInt(form.qtdColaboradores),
        percentualDiversidade: form.percentualDiversidade ? parseInt(form.percentualDiversidade) : null,
        prazoMetaEsg: form.prazoMetaEsg || null,
        responsavelRh: { nome: form.nome, email: form.email, cargo: form.cargo }
      };
      if (newPassword) body.senha = newPassword;
      await api.patch('/companies/me', body);
      setSuccess('Dados atualizados com sucesso!');
      setNewPassword('');
    } catch (err) {
      setError(err.data?.errors?.join(', ') || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-500">Carregando...</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Configurações da Empresa</h1>

      {success && <p className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{success}</p>}
      {error && <p className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Dados da empresa */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Dados da Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="CNPJ" name="cnpj" disabled value={form.cnpj} onChange={handleChange} />
            <Field label="Razão Social" name="razaoSocial" value={form.razaoSocial} onChange={handleChange} />
            <Field label="Nome Fantasia" name="nomeFantasia" value={form.nomeFantasia} onChange={handleChange} />
            <Field label="Porte" name="porte" value={form.porte} onChange={handleChange} />
            <Field label="Segmento" name="segmento" value={form.segmento} onChange={handleChange} />
            <Field label="Setor de Atuação" name="setorAtuacao" value={form.setorAtuacao} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localização Matriz</label>
              <StateSelect name="localizacaoMatriz" value={form.localizacaoMatriz} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regiões de Atuação</label>
              <RegionSelect value={form.regioesAtuacao} onChange={(val) => setForm({ ...form, regioesAtuacao: val })} />
            </div>
            <Field label="Qtd Colaboradores" name="qtdColaboradores" type="number" value={form.qtdColaboradores} onChange={handleChange} />
          </div>
        </div>

        {/* Metas ESG */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Metas ESG</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Meta de Diversidade (%)" name="percentualDiversidade" type="number" value={form.percentualDiversidade} onChange={handleChange} />
            <Field label="Prazo da Meta (YYYY-MM)" name="prazoMetaEsg" value={form.prazoMetaEsg} onChange={handleChange} />
          </div>
        </div>

        {/* Responsável RH */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Responsável de RH</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome" name="nome" value={form.nome} onChange={handleChange} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Field label="Cargo" name="cargo" value={form.cargo} onChange={handleChange} />
          </div>
        </div>

        {/* Alterar senha */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Alterar Senha</h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha (deixe vazio para manter)</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer text-sm">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-light disabled:opacity-50 cursor-pointer">
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
