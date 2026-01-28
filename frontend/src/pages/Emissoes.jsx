import { useState, useEffect } from 'react';
import { getEmissoes, getTipos } from '../api/emissoes';
import { useGestor } from '../context/GestorContext';
import EditModal from '../components/EditModal';
import HistoricoModal from '../components/HistoricoModal';
import "../styles/Emissoes.css";
import { IoPencil } from "react-icons/io5";
import { AiOutlineHistory } from "react-icons/ai";


export default function Emissoes() {
  const { gestor } = useGestor();
  
  const [emissoes, setEmissoes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 15;
  
  const [filtros, setFiltros] = useState({
  tipo: '',
  emissor: '',
  valorMin: '',
  valorMax: '',
  dataInicio: '',  
  dataFim: ''     
});
  const [filtrosAplicados, setFiltrosAplicados] = useState({});
  
  const [sortBy, setSortBy] = useState('data');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false);
  const [emissaoSelecionada, setEmissaoSelecionada] = useState(null);

  useEffect(() => {
    carregarTipos();
  }, []);

  useEffect(() => {
    carregarEmissoes();
  }, [page, filtrosAplicados, sortBy, sortOrder]);

  const carregarTipos = async () => {
    try {
      const data = await getTipos();
      setTipos(data);
    } catch (err) {
      console.error('Erro ao carregar tipos:', err);
    }
  };

  const carregarEmissoes = async () => {
    try {
      setLoading(true);
      
      const params = {
        page,
        page_size: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
        ...filtrosAplicados
      };
      
      const data = await getEmissoes(params);
      setEmissoes(data.data);
      setTotalPages(data.total_pages);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar emissões');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validarDataReal = (dataString) => {
    if (!dataString) return true; 
    const [ano, mes, dia] = dataString.split('-').map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    return (
      dataObj.getFullYear() === ano &&
      dataObj.getMonth() === mes - 1 &&
      dataObj.getDate() === dia
    );
  };

  const aplicarFiltros = (e) => {
    if (e) e.preventDefault();
    // Validação de datas inexistentes (Ex: 31 de Novembro)
    if (!validarDataReal(filtros.dataInicio)) {
      alert('A Data de Início informada é inválida (dia inexistente no calendário).');
      return;
    }
    
    if (!validarDataReal(filtros.dataFim)) {
      alert('A Data de Fim informada é inválida (dia inexistente no calendário).');
      return;
    }

    if (filtros.dataInicio && filtros.dataFim) {
        const inicio = new Date(filtros.dataInicio);
        const fim = new Date(filtros.dataFim);
        
        if (inicio > fim) {
          alert('A data inicial não pode ser maior que a data final!');
          return;
        }
      }
    // Criação do objeto de filtros
    const novosFiltros = {};
    if (filtros.tipo) novosFiltros.tipo = filtros.tipo;
    if (filtros.emissor) novosFiltros.emissor = filtros.emissor;
    if (filtros.valorMin) novosFiltros.valor_min = parseFloat(filtros.valorMin);
    if (filtros.valorMax) novosFiltros.valor_max = parseFloat(filtros.valorMax);
    if (filtros.dataInicio) novosFiltros.data_inicio = filtros.dataInicio;  
    if (filtros.dataFim) novosFiltros.data_fim = filtros.dataFim;           
    
    setFiltrosAplicados(novosFiltros);
    setPage(1);
  };

  const limparFiltros = () => {
    setFiltros({ tipo: '', emissor: '', valorMin: '', valorMax: '',dataInicio: '', dataFim: '' });
    setFiltrosAplicados({});
    setPage(1);
  };

  const ordenarPor = (coluna) => {
    if (sortBy === coluna) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(coluna);
      setSortOrder('desc');
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const abrirEdicao = (emissao) => {
    setEmissaoSelecionada(emissao);
    setEditModalOpen(true);
  };

  const abrirHistorico = (emissao) => {
    setEmissaoSelecionada(emissao);
    setHistoricoModalOpen(true);
  };

  const onEditSuccess = () => {
    setEditModalOpen(false);
    carregarEmissoes();
  };

  const SortIcon = ({ coluna }) => {
    if (sortBy !== coluna) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="emissoes-page">
      <div className="page-header">
        <h2>Emissões</h2>
        <p>Listagem completa</p>
      </div>

      <div className="filtros-card">
        <h3> Filtros</h3>
        <form onSubmit={aplicarFiltros}>
        <div className="filtros-grid">
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            >
              <option value="">Todos</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Emissor</label>
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={filtros.emissor}
              onChange={(e) => setFiltros({ ...filtros, emissor: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Data Início</label>
            <input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Data Fim</label>
            <input
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Valor Mínimo</label>
            <input
              type="number"
              placeholder="R$ 0"
              value={filtros.valorMin}
              onChange={(e) => setFiltros({ ...filtros, valorMin: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Valor Máximo</label>
            <input
              type="number"
              placeholder="R$ 999.999.999"
              value={filtros.valorMax}
              onChange={(e) => setFiltros({ ...filtros, valorMax: e.target.value })}
            />
          </div>
        </div>
        
        <div className="filtros-actions">
          <button type="button" className="btn btn-secondary" onClick={limparFiltros}>
            Limpar
          </button>
          <button type="submit" className="btn btn-primary" >
            Aplicar Filtros
          </button>
        </div>
         </form>
      </div>


      {/* Tabela */}
      <div className="table-card">
        <div className="table-header">
          <h3>Listagem de Emissões</h3>
          <span className="table-count">{total.toLocaleString('pt-BR')} emissões encontradas</span>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : emissoes.length === 0 ? ( 
          <div className="no-results">
            <h4>Nenhuma emissão encontrada</h4>
            <p>Tente ajustar os filtros ou limpar a busca para ver mais resultados.</p>
            <button className="btn btn-secondary" onClick={limparFiltros}>
              Limpar Filtros
            </button>
          </div>
  ) : (
          <>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => ordenarPor('id')}>
                      ID <SortIcon coluna="id" />
                    </th>
                    <th onClick={() => ordenarPor('data')}>
                      Data <SortIcon coluna="data" />
                    </th>
                    <th onClick={() => ordenarPor('tipo')}>
                      Tipo <SortIcon coluna="tipo" />
                    </th>
                    <th onClick={() => ordenarPor('emissor')}>
                      Emissor <SortIcon coluna="emissor" />
                    </th>
                    <th onClick={() => ordenarPor('valor')}>
                      Valor <SortIcon coluna="valor" />
                    </th>
                    <th>Link</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {emissoes.map((emissao) => (
                    <tr key={emissao.id}>
                      <td>#{emissao.id}</td>
                      <td>{formatarData(emissao.data)}</td>
                      <td>
                        <span className={`badge badge-${emissao.tipo.toLowerCase()}`}>
                          {emissao.tipo}
                        </span>
                      </td>
                      <td className="emissor-cell" title={emissao.emissor}>
                        {emissao.emissor}
                      </td>
                      <td className="valor-cell">{formatarValor(emissao.valor)}</td>
                      <td>
                        {emissao.link && (
                          <a href={emissao.link} target="_blank" rel="noopener noreferrer" className="link-cvm">
                            CVM ↗
                          </a>
                        )}
                      </td>
                      <td className="acoes-cell">
                        <button
                          className="btn btn-icon"
                          onClick={() => abrirEdicao(emissao)}
                          title="Editar"
                        >
                         <IoPencil />
                        </button>
                        <button
                          className="btn btn-icon"
                          onClick={() => abrirHistorico(emissao)}
                          title="Ver histórico"
                        >
                          <AiOutlineHistory />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Anterior
              </button>
              
              <span className="pagination-info">
                Página {page} de {totalPages}
              </span>
              
              <button
                className="btn btn-secondary"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Próxima →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modais */}
      {editModalOpen && (
        <EditModal
          emissao={emissaoSelecionada}
          gestor={gestor}
          onClose={() => setEditModalOpen(false)}
          onSuccess={onEditSuccess}
        />
      )}

      {historicoModalOpen && (
        <HistoricoModal
          emissao={emissaoSelecionada}
          onClose={() => setHistoricoModalOpen(false)}
        />
      )}
    </div>
  );
}
