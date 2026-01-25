# Teste Técnico JGP Crédito - Ryan Calmon

Sistema web fullstack para gestão e visualização de dados de emissões do mercado financeiro, desenvolvido como parte do Teste Técnico para Estágio em Desenvolvimento Fullstack na JGP Crédito.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução](#-instalação-e-execução)
- [Documentação da API](#-documentação-da-api)
- [Screenshots](#️-screenshots)
- [Diferenciais Implementados](#-diferenciais-implementados)
- [Autor](#-autor)

---

## 📖 Sobre o Projeto

O projeto foi desenvolvido para o processo seletivo de estágio na **JGP Crédito**. O objetivo é criar uma aplicação web que permita:

- Importar dados de emissões de renda fixa a partir de um arquivo Excel
- Visualizar e filtrar as emissões em uma tabela interativa
- Editar informações das ofertas com validação de dados
- Acompanhar estatísticas do mercado através de um dashboard com gráficos
- Registrar histórico completo de alterações

### Base de Dados

O sistema utiliza a base de dados `Primario2025.xlsx` contendo **1.349 emissões** do mercado financeiro com os seguintes tipos:

| Tipo | Descrição |
|------|-----------|
| **CRI** | Certificado de Recebíveis Imobiliários |
| **CRA** | Certificado de Recebíveis do Agronegócio |
| **DEB** | Debêntures |
| **NC** | Notas Comerciais |

---

## 🛠️ Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Python** | 3.11+ | Linguagem principal |
| **FastAPI** | 0.109 | Framework web para APIs |
| **SQLAlchemy** | 2.0 | ORM  para manipulação do banco de dados |
| **SQLite** | 3 | Banco de dados |
| **Pandas** | 2.2 | Biblioteca para manipulação e importação de dados do Excel |
| **Pydantic** | 2.0 | Validação de dados e definição de schemas |
| **Uvicorn** | 0.27 | Servidor ASGI |

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 18+ | Framework JavaScript para criação das interfaces |
| **Vite** | 5+ | Build tool e servidor de desenvolvimento |
| **JavaScript** | ES6+ |
| **HTML5/CSS3** | - |
| **Axios** | 1.6 | Cliente HTTP para requisições da API |
| **Recharts** | 2.10 | Biblioteca de gráficos para React |
| **React Icons** | 5.0 | Biblioteca de ícones para React |

---

## ✨ Funcionalidades

### Requisitos Obrigatórios 

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| **Importação de Dados** | Script ETL que lê o arquivo Excel e popula o banco SQLite | ✅ |
| **API REST** | Endpoints para CRUD de emissões usando FastAPI | ✅  |
| **Interface React** | Tabela interativa com filtros e ordenação | ✅  |
| **Edição de Ofertas** | Modal com formulário para atualização de dados | ✅  |

### Diferenciais (Bônus) ✅

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| **Validação de Dados** | Validação no backend e frontend | ✅ Implementado |
| **Controle de Alterações** | Histórico completo de modificações com auditoria | ✅ Implementado |

---

## 📁 Estrutura do Projeto

```
jgp-credito/
│
├── backend/                      # Servidor Python/FastAPI
│   ├── main.py                   # Aplicação principal e definição de rotas
│   ├── database.py               # Configuração de conexão com SQLite
│   ├── models.py                 # Modelos SQLAlchemy (tabelas do banco)
│   ├── schemas.py                # Schemas Pydantic (validação de dados)
│   ├── crud.py                   # Funções de acesso ao banco de dados
│   ├── importer.py               # Script de importação do Excel
│   ├── requirements.txt          # Dependências Python
│   ├── database.db               # Banco de dados SQLite
│   └── Primario2025.xlsx         # Arquivo Excel com dados originais
│
├── frontend/                     # Aplicação React
│   ├── src/
│   │   ├── api/
│   │   │   └── emissoes.js       # Cliente da API
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx        # Cabeçalho
│   │   │   ├── Sidebar.jsx       # Menu lateral de navegação
│   │   │   ├── StatsCard.jsx     # Cards de estatísticas
│   │   │   ├── EditModal.jsx     # Modal de edição de emissão
│   │   │   ├── HistoricoModal.jsx # Modal de histórico de alterações
│   │   │   ├── GestorModal.jsx   # Modal de identificação do gestor
│   │   │
│   │   ├── context/
│   │   │   └── GestorContext.jsx # Context API para gerenciar o gestor
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Página de dashboard com gráficos
│   │   │   ├── Emissoes.jsx      # Página de listagem de emissões
│   │   │
│   │   ├── styles/
│   │   │   └── global.css        # Estilos globais
│   │   │   └── HistoricoModal.css
│   │   │   └── GestorModal.css
│   │   │   └── EditModal.css
│   │   │   └── StatsCard.css
│   │   │   └── Sidebar.css
│   │   │   └── Header.css
│   │   │   └── Dashboard.css
│   │   │   └── Emissoes.css
│   │   │
│   │   ├── App.jsx               # Componente principal e rotas
│   │   ├── main.jsx
│   │   └── index.css             # Importação de estilos globais
│   │
│   ├── package.json             
│   ├── vite.config.js         
│ 
│
├── .gitignore                   
└── README.md                    
```

---

## 🚀 Instalação e Execução Local

### Pré-requisitos

- **Python** 3.11 ou superior
- **Node.js** 18 ou superior
- **Git**

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/Ryan-Calmon/Teste-JGP
cd Teste-JGP
```

### Passo 2: Configurar o Backend

```bash
cd backend
python -m venv venv

# Ativar ambiente virtual
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Importar dados do Excel para o banco (executar apenas na primeira vez)
python importer.py

# Iniciar o servidor de desenvolvimento
uvicorn main:app --reload
```

✅ O backend estará disponível em: **http://127.0.0.1:8000**

### Passo 3: Configurar o Frontend

Em um **novo terminal**:

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

✅ O frontend estará disponível em: **http://localhost:5173**

### Passo 4: Acessar a Aplicação

1. Abra o navegador em **http://localhost:5173**
2. Informe seu nome no modal de identificação
3. Navegue pelo Dashboard e pela página de Emissões

---

## 📚 Documentação da API

### Documentação

O FastAPI gera automaticamente documentação:

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

### Endpoints Disponíveis

#### Endpoints Gerais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Rota Principal |
| `GET` | `/health` | Health check da API |

#### Endpoints de Emissões

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/emissoes` | Listar emissões com filtros e paginação |
| `GET` | `/emissoes/tipos` | Listar tipos de emissão únicos |
| `GET` | `/emissoes/{id}` | Buscar emissão específica por ID |
| `PUT` | `/emissoes/{id}` | Atualizar dados de uma emissão |
| `GET` | `/emissoes/{id}/historico` | Obter histórico de alterações |

#### Endpoints de Estatísticas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/stats` | Estatísticas agregadas do mercado |
| `GET` | `/stats/evolucao-mensal` | Evolução mensal de volume e quantidade |

### Parâmetros de Filtro (GET /emissoes)

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `page` | int | Número da página | `1` |
| `page_size` | int | Itens por página | `20` |
| `tipo` | string | Filtrar por tipo | `CRI`, `CRA`, `DEB`, `NC` |
| `emissor` | string | Buscar por nome do emissor | `petrobras` |
| `data_inicio` | string | Data inicial (YYYY-MM-DD) | `2025-01-01` |
| `data_fim` | string | Data final (YYYY-MM-DD) | `2025-12-31` |
| `valor_min` | float | Valor mínimo | `1000000` |
| `valor_max` | float | Valor máximo | `500000000` |
| `sort_by` | string | Campo para ordenação | `data`, `valor`, `emissor` |
| `sort_order` | string | Direção da ordenação | `asc`, `desc` |

### Exemplos de Requisições

#### Listar emissões do tipo CRI em dezembro/2025

```bash
curl "http://127.0.0.1:8000/emissoes?tipo=CRI&data_inicio=2025-12-01&data_fim=2025-12-31"
```

#### Buscar emissões de um emissor específico

```bash
curl "http://127.0.0.1:8000/emissoes?emissor=petrobras&sort_by=valor&sort_order=desc"
```

#### Atualizar uma emissão

```bash
curl -X PUT "http://127.0.0.1:8000/emissoes/1" \
  -H "Content-Type: application/json" \
  -d '{
    "emissor": "Novo Nome do Emissor",
    "valor": 150000000,
    "gestor_nome": "Ryan Calmon"
  }'
```

#### Obter histórico de alterações

```bash
curl "http://127.0.0.1:8000/emissoes/1/historico"
```

### Resposta de Exemplo (GET /emissoes)

```json
{
  "items": [
    {
      "id": 1,
      "data": "2025-12-15T00:00:00",
      "tipo": "CRI",
      "emissor": "Companhia Exemplo S.A.",
      "valor": 150000000.0,
      "link": "https://cvm.gov.br/...",
      "created_at": "2025-01-24T10:00:00",
      "updated_at": "2025-01-24T15:30:00"
    }
  ],
  "total": 1349,
  "page": 1,
  "pages": 68
}
```

### Resposta de Exemplo (GET /stats)

```json
{
  "total": 1349,
  "volume_total": 539986325180.07,
  "por_tipo": [
    {"tipo": "DEB", "count": 650, "volume": 280000000000},
    {"tipo": "CRI", "count": 380, "volume": 150000000000},
    {"tipo": "CRA", "count": 250, "volume": 80000000000},
    {"tipo": "NC", "count": 69, "volume": 29986325180}
  ],
  "top_emissores": [
    {"emissor": "Empresa A", "count": 25, "volume": 50000000000},
    {"emissor": "Empresa B", "count": 20, "volume": 40000000000}
  ]
}
```

---

## 🖼️ Screenshots

### Dashboard

O dashboard apresenta uma visão geral do mercado com:

- **Cards de Estatísticas**: Total de emissões, volume total, tipos e emissores
- **Gráfico de Evolução Mensal**: Linha dupla mostrando volume (R$) e quantidade ao longo dos meses
- **Gráfico de Pizza**: Distribuição percentual por tipo de emissão
- **Gráfico de Barras**: Top 5 emissores por volume
- **Tabela Detalhada**: Breakdown por tipo com quantidade, volume e percentual

### Página de Emissões

A página de emissões contém:

- **Filtros**: Por tipo, emissor, intervalo de datas e faixa de valores
- **Tabela**: Com ordenação por qualquer coluna
- **Paginação**: Navegação entre páginas de resultados
- **Ações**: Botões para editar e visualizar histórico de cada emissão

### Modal de Edição

O modal de edição inclui:

- **Formulário Completo**: Todos os campos editáveis
- **Validação em Tempo Real**: Feedback visual de erros
- **Preview de Valor**: Formatação em reais enquanto digita
- **Identificação do Gestor**: Registro de quem está fazendo a alteração

### Modal de Histórico

O modal de histórico exibe:

- **Lista Cronológica**: Todas as alterações ordenadas por data
- **Identificação**: Nome do gestor que realizou cada alteração
- **Detalhes**: Campos alterados com valores anteriores e novos
- **Formatação Visual**: Valor anterior riscado, novo valor destacado

---

## 🏆 Diferenciais Implementados

### 1. Validação de Dados

#### Backend (Pydantic)

O sistema utiliza Pydantic para validação no backend:

```python
from pydantic import BaseModel, Field, field_validator
from enum import Enum

class TipoEmissao(str, Enum):
    CRI = "CRI"
    CRA = "CRA"
    DEB = "DEB"
    NC = "NC"

class EmissaoUpdate(BaseModel):
    tipo: Optional[TipoEmissao] = None
    valor: Optional[float] = Field(None, gt=0, description="Valor deve ser positivo")
    emissor: Optional[str] = Field(None, min_length=2, max_length=500)
    
    @field_validator('emissor')
    @classmethod
    def validar_emissor(cls, v):
        if v is not None and len(v.strip()) < 2:
            raise ValueError('Emissor deve ter pelo menos 2 caracteres')
        return v.strip() if v else v
```

**Validações implementadas:**

| Campo | Regra | Mensagem de Erro |
|-------|-------|------------------|
| `tipo` | Enum (CRI, CRA, DEB, NC) | "Tipo inválido. Valores permitidos: CRI, CRA, DEB, NC" |
| `valor` | Maior que zero | "Valor deve ser maior que zero" |
| `emissor` | Mínimo 2 caracteres | "Emissor deve ter pelo menos 2 caracteres" |
| `data` | Formato válido | "Data inválida" |

#### Frontend (React)

O frontend também valida os dados antes de enviar:

```javascript
const validar = () => {
  const novosErros = {};
  
  if (!formData.emissor.trim()) {
    novosErros.emissor = 'Emissor é obrigatório';
  } else if (formData.emissor.trim().length < 2) {
    novosErros.emissor = 'Emissor deve ter pelo menos 2 caracteres';
  }
  
  if (!formData.valor || parseFloat(formData.valor) <= 0) {
    novosErros.valor = 'Valor deve ser maior que zero';
  }
  
  // ... mais validações
  
  return Object.keys(novosErros).length === 0;
};
```

### 2. Controle de Alterações (Auditoria)

#### Modelo de Histórico

```python
class HistoricoAlteracao(Base):
    __tablename__ = "historico_alteracoes"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    emissao_id = Column(Integer, ForeignKey("emissoes.id"), nullable=False)
    gestor_nome = Column(String(200), nullable=False)
    data_alteracao = Column(DateTime, default=func.now())
    campos_alterados = Column(JSON)  # Armazena o que mudou
    
    emissao = relationship("Emissao", back_populates="historico")
```

#### Registro Automático de Alterações

Quando uma emissão é atualizada, o sistema:

1. **Compara** os valores anteriores com os novos
2. **Identifica** apenas os campos que realmente mudaram
3. **Registra** no histórico com:
   - Nome do gestor responsável
   - Data e hora da alteração
   - Para cada campo alterado: valor anterior e valor novo

```python
def update_emissao(db: Session, emissao_id: int, emissao_update: schemas.EmissaoUpdate):
    emissao = db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()
    
    # Registrar alterações
    campos_alterados = {}
    update_data = emissao_update.model_dump(exclude_unset=True, exclude={'gestor_nome'})
    
    for campo, novo_valor in update_data.items():
        valor_anterior = getattr(emissao, campo)
        if valor_anterior != novo_valor:
            campos_alterados[campo] = {
                "anterior": str(valor_anterior),
                "novo": str(novo_valor)
            }
    
    # Criar registro de histórico
    if campos_alterados and emissao_update.gestor_nome:
        historico = models.HistoricoAlteracao(
            emissao_id=emissao_id,
            gestor_nome=emissao_update.gestor_nome,
            campos_alterados=campos_alterados
        )
        db.add(historico)
    
    # Atualizar emissão
    for campo, valor in update_data.items():
        setattr(emissao, campo, valor)
    
    db.commit()
    return emissao
```

#### Exemplo de Registro no Histórico

```json
{
  "id": 1,
  "emissao_id": 42,
  "gestor_nome": "Ryan Calmon",
  "data_alteracao": "2025-01-24T15:30:00",
  "campos_alterados": {
    "emissor": {
      "anterior": "Empresa Antiga S.A.",
      "novo": "Empresa Nova S.A."
    },
    "valor": {
      "anterior": "100000000",
      "novo": "150000000"
    }
  }
}
```

---

## 👨‍💻 Autor

**Ryan de Andrade Calmon**

Desenvolvedor Fullstack | Estudante

- GitHub: [@Ryan-Calmon](https://github.com/Ryan-Calmon)
- LinkedIn: [Ryan Calmon](https://www.linkedin.com/in/ryan-calmon/)
- Email: ryan@calmon.net.br

---

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica no processo seletivo da **JGP Crédito**.

---

## 🙏 Agradecimentos

Agradeço à equipe da **JGP Crédito** pela oportunidade de participar deste processo seletivo e pelo desafio técnico proposto, que me permitiu demonstrar habilidades em desenvolvimento fullstack.

---

<div align="center">
  <img 
          src="https://jgp.com.br/wp-content/uploads/2023/06/JGP-white-1.svg" 
          alt="JGP" 
    />
</div>
