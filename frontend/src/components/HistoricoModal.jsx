import { useState, useEffect } from 'react';
import { getHistorico } from '../api/emissoes';
import "../styles/HistoricoModal.css"
export default function HistoricoModal({ emissao, onClose }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (emissao) {
      carregarHistorico();
    }
  }, [emissao]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const data = await getHistorico(emissao.id);
      setHistorico(data);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  // Formatar data/hora
  const formatarDataHora = (data) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  // Traduzir nome do campo
  const traduzirCampo = (campo) => {
    const traducoes = {
      data: 'Data',
      tipo: 'Tipo',
      emissor: 'Emissor',
      valor: 'Valor',
      link: 'Link'
    };
    return traducoes[campo] || campo;
  };

  // Formatar valor do campo
  const formatarValorCampo = (campo, valor) => {
    if (!valor) return '(vazio)';
    
    if (campo === 'valor') {
      const numero = parseFloat(valor);
      if (!isNaN(numero)) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(numero);
      }
    }
    
    if (campo === 'data') {
      return new Date(valor).toLocaleDateString('pt-BR');
    }
    
    return valor;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal historico-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Histórico de Alterações</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="emissao-info">
            <strong>Emissão #{emissao?.id}</strong> - {emissao?.emissor}
          </div>
          
          {loading ? (
            <div className="loading">Carregando histórico...</div>
          ) : historico.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma alteração registrada para esta emissão.</p>
            </div>
          ) : (
            <div className="historico-lista">
              {historico.map((item) => (
                <div key={item.id} className="historico-item">
                  <div className="historico-header">
                    <span className="historico-gestor">
                     {item.gestor_nome}
                    </span>
                    <span className="historico-data">
                      {formatarDataHora(item.data_alteracao)}
                    </span>
                  </div>
                  
                  <div className="historico-alteracoes">
                    {Object.entries(item.campos_alterados).map(([campo, valores]) => (
                      <div key={campo} className="alteracao-item">
                        <span className="alteracao-campo">{traduzirCampo(campo)}:</span>
                        <span className="alteracao-anterior">
                          {formatarValorCampo(campo, valores.anterior)}
                        </span>
                        <span className="alteracao-seta">→</span>
                        <span className="alteracao-novo">
                          {formatarValorCampo(campo, valores.novo)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
