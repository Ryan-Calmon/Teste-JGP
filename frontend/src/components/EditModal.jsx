import { useState, useEffect } from 'react';
import { updateEmissao, getTipos } from '../api/emissoes';
import "../styles/EditModal.css"

export default function EditModal({ emissao, gestor, onClose, onSuccess }) {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    data: '',
    tipo: '',
    emissor: '',
    valor: '',
    link: ''
  });

  // Carregar dados iniciais
  useEffect(() => {
    if (emissao) {
      // Formatar data para input date
      const dataFormatada = new Date(emissao.data).toISOString().split('T')[0];
      
      setFormData({
        data: dataFormatada,
        tipo: emissao.tipo,
        emissor: emissao.emissor,
        valor: emissao.valor.toString(),
        link: emissao.link || ''
      });
    }
    
    carregarTipos();
  }, [emissao]);

  const carregarTipos = async () => {
    try {
      const data = await getTipos();
      setTipos(data);
    } catch (err) {
      console.error('Erro ao carregar tipos:', err);
    }
  };

  // Validação do formulário
  const validar = () => {
    const novosErros = {};
    
    if (!formData.emissor.trim()) {
      novosErros.emissor = 'Emissor é obrigatório';
    } else if (formData.emissor.trim().length < 2) {
      novosErros.emissor = 'Emissor deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.tipo) {
      novosErros.tipo = 'Tipo é obrigatório';
    } else if (!['CRI', 'CRA', 'DEB', 'NC'].includes(formData.tipo)) {
      novosErros.tipo = 'Tipo inválido';
    }
    
    if (!formData.valor) {
      novosErros.valor = 'Valor é obrigatório';
    } else if (parseFloat(formData.valor) <= 0) {
      novosErros.valor = 'Valor deve ser maior que zero';
    }
    
    if (!formData.data) {
      novosErros.data = 'Data é obrigatória';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validar()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Preparar dados para envio
      const dadosAtualizacao = {
        data: new Date(formData.data).toISOString(),
        tipo: formData.tipo,
        emissor: formData.emissor.trim(),
        valor: parseFloat(formData.valor),
        link: formData.link.trim() || null,
        gestor_nome: gestor // Nome do gestor para o histórico
      };
      
      await updateEmissao(emissao.id, dadosAtualizacao);
      
      alert('Emissão atualizada');
      onSuccess();
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      
      // Tratar erros de validação do backend
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        
        if (Array.isArray(detail)) {
          // Erros de validação Pydantic
          const novosErros = {};
          detail.forEach((erro) => {
            const campo = erro.loc[erro.loc.length - 1];
            novosErros[campo] = erro.msg;
          });
          setErrors(novosErros);
        } else {
          alert(`Erro: ${detail}`);
        }
      } else {
        alert('Erro ao atualizar emissão');
      }
    } finally {
      setLoading(false);
    }
  };

  // Atualizar campo do formulário
  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
    
    // Limpar erro do campo ao editar
    if (errors[campo]) {
      setErrors({ ...errors, [campo]: null });
    }
  };

  // Formatar valor para exibição
  const formatarValorExibicao = (valor) => {
    if (!valor) return '';
    const numero = parseFloat(valor);
    if (isNaN(numero)) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numero);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Emissão #{emissao?.id}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="data">Data *</label>
                <input
                  type="date"
                  id="data"
                  value={formData.data}
                  onChange={(e) => handleChange('data', e.target.value)}
                  className={errors.data ? 'error' : ''}
                />
                {errors.data && <span className="error-message">{errors.data}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="tipo">Tipo *</label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => handleChange('tipo', e.target.value)}
                  className={errors.tipo ? 'error' : ''}
                >
                  <option value="">Selecione...</option>
                  {tipos.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors.tipo && <span className="error-message">{errors.tipo}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="emissor">Emissor *</label>
              <input
                type="text"
                id="emissor"
                value={formData.emissor}
                onChange={(e) => handleChange('emissor', e.target.value)}
                className={errors.emissor ? 'error' : ''}
                placeholder="Nome do emissor"
              />
              {errors.emissor && <span className="error-message">{errors.emissor}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="valor">Valor (R$) *</label>
              <input
                type="number"
                id="valor"
                value={formData.valor}
                onChange={(e) => handleChange('valor', e.target.value)}
                className={errors.valor ? 'error' : ''}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {formData.valor && (
                <span className="valor-preview">
                  {formatarValorExibicao(formData.valor)}
                </span>
              )}
              {errors.valor && <span className="error-message">{errors.valor}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="link">Link CVM</label>
              <input
                type="url"
                id="link"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                placeholder="https://..."
              />
            </div>
            
            <div className="gestor-info">
              <span>Responsável pela Alteração: <strong>{gestor}</strong></span>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
   );
}
