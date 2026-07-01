import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../shared/services/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cnpj: '', razaoSocial: '', nomeFantasia: '', porte: '', segmento: '',
    setorAtuacao: '', localizacaoMatriz: '', regioesAtuacao: '',
    qtdColaboradores: '', percentualDiversidade: '', prazoMetaEsg: '',
    nome: '', email: '', cargo: '', senha: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/companies', {
        cnpj: form.cnpj,
        razaoSocial: form.razaoSocial,
        nomeFantasia: form.nomeFantasia,
        porte: form.porte,
        segmento: form.segmento,
        setorAtuacao: form.setorAtuacao,
        localizacaoMatriz: form.localizacaoMatriz,
        regioesAtuacao: form.regioesAtuacao.split(',').map(r => r.trim()),
        qtdColaboradores: parseInt(form.qtdColaboradores),
        percentualDiversidade: parseInt(form.percentualDiversidade),
        prazoMetaEsg: form.prazoMetaEsg,
        responsavelRh: { nome: form.nome, email: form.email, cargo: form.cargo },
        senha: form.senha
      });
      navigate('/login');
    } catch (err) {
      setError(err.data?.errors?.join(', ') || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">Cadastrar Empresa</h1>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="CNPJ" name="cnpj" placeholder="12.345.678/0001-90" />
            <Field label="Razão Social" name="razaoSocial" placeholder="Empresa Ltda" />
            <Field label="Nome Fantasia" name="nomeFantasia" placeholder="Empresa" />
            <Field label="Porte" name="porte" placeholder="Médio" />
            <Field label="Segmento" name="segmento" placeholder="Tecnologia" />
            <Field label="Setor de Atuação" name="setorAtuacao" placeholder="Fintech" />
            <Field label="Localização Matriz" name="localizacaoMatriz" placeholder="São Paulo - SP" />
            <Field label="Regiões de Atuação" name="regioesAtuacao" placeholder="SP, RJ, MG" />
            <Field label="Qtd Colaboradores" name="qtdColaboradores" type="number" placeholder="150" />
            <Field label="Meta Diversidade (%)" name="percentualDiversidade" type="number" placeholder="30" />
            <Field label="Prazo Meta ESG" name="prazoMetaEsg" placeholder="2026-12" />
          </div>
          <hr className="my-4" />
          <h2 className="text-lg font-semibold text-primary">Responsável de RH</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome" name="nome" placeholder="Ana Silva" />
            <Field label="Email" name="email" type="email" placeholder="ana@empresa.com" />
            <Field label="Cargo" name="cargo" placeholder="Head de Diversidade" />
            <Field label="Senha" name="senha" type="password" placeholder="Mínimo 6 caracteres" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-light disabled:opacity-50 mt-4">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem conta? <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
