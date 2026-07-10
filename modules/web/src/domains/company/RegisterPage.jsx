import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';
import { RegionSelect } from '../../shared/components/RegionSelect';
import { StateSelect } from '../../shared/components/StateSelect';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    cnpj: '', razaoSocial: '', nomeFantasia: '', porte: '', segmento: '',
    setorAtuacao: '', localizacaoMatriz: '', regioesAtuacao: [],
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
        regioesAtuacao: form.regioesAtuacao,
        qtdColaboradores: parseInt(form.qtdColaboradores),
        percentualDiversidade: parseInt(form.percentualDiversidade),
        prazoMetaEsg: form.prazoMetaEsg,
        responsavelRh: { nome: form.nome, email: form.email, cargo: form.cargo },
        senha: form.senha
      });
      setModal({ type: 'success', message: 'Empresa cadastrada com sucesso!' });
    } catch (err) {
      setModal({ type: 'error', message: err.data?.errors?.join(', ') || 'Erro ao cadastrar. Verifique os dados e tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = async () => {
    if (modal?.type === 'success') {
      try {
        await login(form.email, form.senha);
        navigate('/dashboard');
      } catch {
        navigate('/login');
      }
    }
    setModal(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">Cadastrar Empresa</h1>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
              <input name="cnpj" value={form.cnpj} onChange={handleChange} placeholder="12.345.678/0001-90" maxLength={18}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
              <input name="razaoSocial" value={form.razaoSocial} onChange={handleChange} placeholder="Empresa Ltda" maxLength={100}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
              <input name="nomeFantasia" value={form.nomeFantasia} onChange={handleChange} placeholder="Empresa" maxLength={100}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Porte</label>
              <input name="porte" value={form.porte} onChange={handleChange} placeholder="Médio" maxLength={30}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
              <input name="segmento" value={form.segmento} onChange={handleChange} placeholder="Tecnologia" maxLength={50}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setor de Atuação</label>
              <input name="setorAtuacao" value={form.setorAtuacao} onChange={handleChange} placeholder="Fintech" maxLength={50}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localização Matriz</label>
              <StateSelect name="localizacaoMatriz" value={form.localizacaoMatriz} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regiões de Atuação</label>
              <RegionSelect value={form.regioesAtuacao} onChange={(val) => setForm({ ...form, regioesAtuacao: val })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qtd Colaboradores</label>
              <input type="number" name="qtdColaboradores" value={form.qtdColaboradores} onChange={handleChange} placeholder="150" min={1} max={999999}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Diversidade (%)</label>
              <input type="number" name="percentualDiversidade" value={form.percentualDiversidade} onChange={handleChange} placeholder="30" min={0} max={100}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prazo Meta ESG</label>
              <input type="month" name="prazoMetaEsg" value={form.prazoMetaEsg} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
          </div>
          <hr className="my-4" />
          <h2 className="text-lg font-semibold text-primary">Responsável de RH</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Ana Silva" maxLength={100}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ana@empresa.com" maxLength={100}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <input name="cargo" value={form.cargo} onChange={handleChange} placeholder="Head de Diversidade" maxLength={50}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" maxLength={50} minLength={6}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-light disabled:opacity-50 mt-4 cursor-pointer">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem conta? <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
        </p>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">{modal.type === 'success' ? '✅' : '❌'}</div>
            <h3 className={`text-lg font-bold mb-2 ${modal.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {modal.type === 'success' ? 'Sucesso!' : 'Erro'}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{modal.message}</p>
            <button onClick={handleModalClose}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light cursor-pointer">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
