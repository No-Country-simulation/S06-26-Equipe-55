import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import { api } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';

const COLORS = ['#1e3a5f', '#60a5fa', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationLimit, setLocationLimit] = useState(10);
  const [scoreOffset, setScoreOffset] = useState(0);
  const [skillsOffset, setSkillsOffset] = useState(0);
  const SCORE_PAGE_SIZE = 3;
  const SKILLS_PAGE_SIZE = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jobsList = await api.get('/jobs');
      setJobs(jobsList);

      if (jobsList.length > 0) {
        const allMatches = await Promise.all(
          jobsList.map(j => api.post('/match', { jobId: j.id }).catch(() => null))
        );
        const validMatches = allMatches.filter(Boolean);
        setMatchData(validMatches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <p className="text-gray-500 text-center">Carregando dashboard...</p>
    </div>
  );

  // Métricas gerais
  const totalVagas = jobs.length;
  const totalCandidatos = matchData ? matchData.reduce((acc, m) => Math.max(acc, m.totalAnalisados), 0) : 0;
  const uniqueCandidates = matchData
    ? [...new Map(matchData.flatMap(m => m.candidatos).map(c => [c.id, c])).values()]
    : [];
  const totalCompatíveis = uniqueCandidates.length;
  const totalMatches = uniqueCandidates.filter(c => c.badgeDiversidade).length;
  const avgDiversidade = uniqueCandidates.length > 0
    ? Math.round(totalMatches * 100 / uniqueCandidates.length)
    : 0;

  // Dados para gráfico de diversidade (pizza)
  const diversityData = () => {
    if (uniqueCandidates.length === 0) return [];
    const withBadge = uniqueCandidates.filter(c => c.badgeDiversidade).length;
    const without = uniqueCandidates.length - withBadge;
    return [
      { name: 'Com badge diversidade', value: withBadge },
      { name: 'Sem badge diversidade', value: without }
    ];
  };

  // Dados para gráfico de nível (pizza)
  const levelData = () => {
    if (uniqueCandidates.length === 0) return [];
    const levels = {};
    uniqueCandidates.forEach(c => {
      levels[c.nivel] = (levels[c.nivel] || 0) + 1;
    });
    return Object.entries(levels).map(([name, value]) => ({ name, value }));
  };

  // Dados para gráfico de skills mais demandadas (barras)
  const skillsData = () => {
    const skills = {};
    jobs.forEach(j => {
      j.skills.forEach(s => {
        skills[s] = (skills[s] || 0) + 1;
      });
    });
    return Object.entries(skills)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  // Dados para gráfico de score por vaga (barras)
  const scoreByJob = () => {
    if (!matchData) return [];
    return matchData.map((m, i) => ({
      name: jobs[i]?.titulo || `Vaga ${i + 1}`,
      avgScore: m.candidatos.length > 0
        ? Math.round(m.candidatos.reduce((acc, c) => acc + c.score, 0) / m.candidatos.length)
        : 0,
      candidatos: m.candidatos.length
    }));
  };

  // Dados para gráfico de localização (barras horizontais)
  const locationData = () => {
    if (uniqueCandidates.length === 0) return [];
    const locations = {};
    uniqueCandidates.forEach(c => {
      if (c.cidade) locations[c.cidade] = (locations[c.cidade] || 0) + 1;
    });
    return Object.entries(locations)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const allLocations = locationData();
  const visibleLocations = allLocations.slice(0, locationLimit);

  const generatePDF = async () => {
    const doc = new jsPDF();
    const now = new Date().toLocaleDateString('pt-BR');
    let y = 20;

    // Buscar dados atualizados da empresa
    let companyName = user.nomeFantasia;
    let metaDiversidade = '';
    let prazoMeta = '';
    try {
      const company = await api.get('/companies/me');
      companyName = company.nomeFantasia;
      metaDiversidade = company.percentualDiversidade ? `${company.percentualDiversidade}%` : 'Não definida';
      prazoMeta = company.prazoMetaEsg || 'Não definido';
    } catch (e) {}

    // Header
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFontSize(22);
    doc.setTextColor(255);
    doc.text('Relatório ESG', 20, 18);
    doc.setFontSize(12);
    doc.text('Diversidade & Inclusão', 20, 28);
    doc.setFontSize(10);
    doc.text(`${companyName} | ${now}`, 20, 36);

    y = 55;

    // Meta ESG
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text('Meta ESG', 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Meta de diversidade: ${metaDiversidade}`, 25, y); y += 7;
    doc.text(`Prazo: ${prazoMeta}`, 25, y); y += 7;
    doc.text(`Resultado atual: ${avgDiversidade}%`, 25, y); y += 7;

    // Linha separadora
    y += 5;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 10;

    // Métricas
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text('Métricas Gerais', 20, y); y += 10;
    doc.setFontSize(10);
    doc.setTextColor(60);

    const metricas = [
      ['Vagas publicadas', totalVagas],
      ['Candidatos na base', totalCandidatos],
      ['Candidatos compatíveis', totalCompatíveis],
      ['Matches ESG', totalMatches],
      ['Diversidade média', `${avgDiversidade}%`]
    ];
    metricas.forEach(([label, val]) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(`${label}:`, 25, y);
      doc.setTextColor(30, 58, 95);
      doc.text(`${val}`, 80, y);
      doc.setTextColor(60);
      y += 7;
    });

    y += 5;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 10;

    // Diversidade
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text('Diversidade nos Matches', 20, y); y += 10;
    doc.setFontSize(10);
    doc.setTextColor(60);
    diversityData().forEach(d => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(`\u2022 ${d.name}: ${d.value}`, 25, y); y += 7;
    });

    y += 5;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 10;

    // Nível
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text('Distribuição por Nível', 20, y); y += 10;
    doc.setFontSize(10);
    doc.setTextColor(60);
    levelData().forEach(d => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(`\u2022 ${d.name}: ${d.value} candidato(s)`, 25, y); y += 7;
    });

    y += 5;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 10;

    // Skills
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text('Skills Mais Demandadas', 20, y); y += 10;
    doc.setFontSize(10);
    doc.setTextColor(60);
    skillsData().forEach(d => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(`\u2022 ${d.name}: ${d.value} vaga(s)`, 25, y); y += 7;
    });

    // Nova página se necessário
    if (y > 250) { doc.addPage(); y = 20; }
    y += 5;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 10;

    // Localização
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text('Localização dos Candidatos', 20, y); y += 10;
    doc.setFontSize(10);
    doc.setTextColor(60);
    allLocations.slice(0, 15).forEach(d => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(`\u2022 ${d.name}: ${d.value} candidato(s)`, 25, y); y += 7;
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Wongola - Relatório ESG | Página ${i} de ${pageCount}`, 20, 290);
    }

    doc.save(`relatorio-esg-${companyName.toLowerCase().replace(/\s/g, '-')}-${now.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <button onClick={generatePDF}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light cursor-pointer text-sm">
          📄 Exportar Relatório ESG (PDF)
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center group relative">
          <p className="text-2xl font-bold text-primary">{totalVagas}</p>
          <p className="text-sm text-gray-500">Vagas publicadas</p>
          <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap">Total de vagas criadas pela sua empresa</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center group relative">
          <p className="text-2xl font-bold text-primary">{totalCandidatos}</p>
          <p className="text-sm text-gray-500">Candidatos na base</p>
          <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap">Candidatos disponíveis para matching</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center group relative">
          <p className="text-2xl font-bold text-primary">{totalCompatíveis}</p>
          <p className="text-sm text-gray-500">Candidatos compatíveis</p>
          <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap">Candidatos com pelo menos 1 skill compatível</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center group relative">
          <p className="text-2xl font-bold text-primary">{totalMatches}</p>
          <p className="text-sm text-gray-500">Matches ESG</p>
          <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap">Candidatos compatíveis que atendem à meta de diversidade</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center group relative">
          <p className="text-2xl font-bold text-primary">{avgDiversidade}%</p>
          <p className="text-sm text-gray-500">Diversidade média</p>
          <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap">% de candidatos com badge de diversidade nos resultados</span>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diversidade */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Diversidade nos Matches</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={diversityData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {diversityData().map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Nível dos candidatos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Nível dos Candidatos</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={levelData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {levelData().map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Skills mais demandadas */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-primary">Skills Mais Demandadas</h2>
            <div className="flex gap-2 items-center">
              <button onClick={() => setSkillsOffset(Math.max(0, skillsOffset - SKILLS_PAGE_SIZE))}
                disabled={skillsOffset === 0}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-1 rounded text-sm">
                ←
              </button>
              <span className="text-xs text-gray-500">
                {skillsOffset + 1}-{Math.min(skillsOffset + SKILLS_PAGE_SIZE, skillsData().length)} de {skillsData().length}
              </span>
              <button onClick={() => setSkillsOffset(Math.min(skillsData().length - SKILLS_PAGE_SIZE, skillsOffset + SKILLS_PAGE_SIZE))}
                disabled={skillsOffset + SKILLS_PAGE_SIZE >= skillsData().length}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-1 rounded text-sm">
                →
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillsData().slice(skillsOffset, skillsOffset + SKILLS_PAGE_SIZE)} margin={{ left: 0, right: 10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis width={30} />
              <Tooltip />
              <Bar dataKey="value" fill="#1e3a5f" radius={[4, 4, 0, 0]} name="Vagas que pedem" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score médio por vaga */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-primary">Score Médio por Vaga</h2>
            <div className="flex gap-2 items-center">
              <button onClick={() => setScoreOffset(Math.max(0, scoreOffset - SCORE_PAGE_SIZE))}
                disabled={scoreOffset === 0}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-1 rounded text-sm">
                ←
              </button>
              <span className="text-xs text-gray-500">
                {scoreOffset + 1}-{Math.min(scoreOffset + SCORE_PAGE_SIZE, scoreByJob().length)} de {scoreByJob().length}
              </span>
              <button onClick={() => setScoreOffset(Math.min(scoreByJob().length - SCORE_PAGE_SIZE, scoreOffset + SCORE_PAGE_SIZE))}
                disabled={scoreOffset + SCORE_PAGE_SIZE >= scoreByJob().length}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-1 rounded text-sm">
                →
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreByJob().slice(scoreOffset, scoreOffset + SCORE_PAGE_SIZE)} margin={{ left: 0, right: 10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis width={30} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#2c5282" radius={[4, 4, 0, 0]} name="Score médio" />
              <Bar dataKey="candidatos" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Candidatos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Localização dos candidatos */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-primary mb-4">Localização dos Candidatos</h2>
          <ResponsiveContainer width="100%" height={Math.max(250, visibleLocations.length * 40)}>
            <BarChart data={visibleLocations} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#1e3a5f" radius={[0, 4, 4, 0]} name="Candidatos" />
            </BarChart>
          </ResponsiveContainer>
          {allLocations.length > locationLimit && (
            <button onClick={() => setLocationLimit(locationLimit + 10)}
              className="mt-4 text-sm text-primary font-medium hover:underline">
              Mostrar mais ({allLocations.length - locationLimit} restantes)
            </button>
          )}
          {locationLimit > 10 && (
            <button onClick={() => setLocationLimit(10)}
              className="mt-4 ml-4 text-sm text-gray-500 hover:underline">
              Mostrar menos
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
