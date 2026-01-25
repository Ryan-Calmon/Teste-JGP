import { useState, useEffect } from 'react';
import { getStats, getEvolucaoMensal } from '../api/emissoes';
import StatsCard from '../components/StatsCard';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  LineChart, Line,
  XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Legend,
  CartesianGrid
} from 'recharts';
import { MdOutlineAttachMoney } from "react-icons/md";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import '../styles/Dashboard.css';

const CORES = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [evolucao, setEvolucao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [statsData, evolucaoData] = await Promise.all([
        getStats(),
        getEvolucaoMensal()
      ]);
      setStats(statsData);
      const evolucaoFormatada = evolucaoData.map(item => ({
        nome: MESES[item.mes - 1],
        mes: item.mes,
        ano: item.ano,
        volume: item.volume / 1e9, 
        quantidade: item.quantidade
      }));
      setEvolucao(evolucaoFormatada);
      
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatarValor = (valor) => {
    if (valor >= 1e9) {
      return `R$ ${(valor / 1e9).toFixed(1)}B`;
    } else if (valor >= 1e6) {
      return `R$ ${(valor / 1e6).toFixed(1)}M`;
    }
    return `R$ ${valor.toLocaleString('pt-BR')}`;
  };

  if (loading) {
    return <div className="loading">Carregando</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const dadosPizza = stats?.por_tipo?.map((item) => ({
    name: item.tipo,
    value: item.count,
    volume: item.volume
  })) || [];

  const dadosBarras = stats?.top_emissores?.slice(0, 5).map((item) => ({
    name: item.emissor.length > 20 ? item.emissor.substring(0, 20) + '...' : item.emissor,
    volume: item.volume / 1e9,
    count: item.count
  })) || [];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Visão geral do mercado primário de renda fixa</p>
      </div>
      <div className="stats-grid">
        <StatsCard
          titulo="Total de Emissões"
          valor={stats?.total?.toLocaleString('pt-BR')}
          icone={<BsFileEarmarkBarGraphFill className="icone-emissoes" />}
          cor="blue"
        />
        <StatsCard
          titulo="Volume Total"
          valor={formatarValor(stats?.volume_total || 0)}
          icone={<MdOutlineAttachMoney className="icone-money" />}
          cor="green"   
        />
        <StatsCard
          titulo="Tipos de Emissão"
          valor={stats?.por_tipo?.length || 0}
          icone=""
          cor="purple"
        />
        <StatsCard
          titulo="Emissores"
          valor={stats?.top_emissores?.length + '+'}
          icone=""
          cor="orange"
        />
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Distribuição por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosPizza}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosPizza.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} emissões (${formatarValor(props.payload.volume)})`,
                  'Quantidade'
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Top 5 Emissores por Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosBarras} layout="vertical">
              <XAxis type="number" tickFormatter={(v) => `R$ ${v.toFixed(0)}B`} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toFixed(1)}B`, 'Volume']}
              />
              <Bar dataKey="volume" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="chart-card chart-full-width">
        <div className="chart-header">
          <h3>Evolução Mensal</h3>
          <p>Volume de emissões ao longo do tempo</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={evolucao}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="nome" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `R$ ${v.toFixed(0)}B`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Volume (R$)') return [`R$ ${value.toFixed(1)}B`, name];
                return [value, name];
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="volume" 
              name="Volume (R$)"
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="quantidade" 
              name="Quantidade"
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="table-card">
        <h3>Detalhamento por Tipo</h3>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Volume</th>
              <th>% do Total</th>
            </tr>
          </thead>
          <tbody>
            {stats?.por_tipo?.map((item) => (
              <tr key={item.tipo}>
                <td>
                  <span className={`badge badge-${item.tipo.toLowerCase()}`}>
                    {item.tipo}
                  </span>
                </td>
                <td>{item.count.toLocaleString('pt-BR')}</td>
                <td>{formatarValor(item.volume)}</td>
                <td>{((item.count / stats.total) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
