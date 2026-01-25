from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum


class TipoEmissao(str, Enum):
    CRI = "CRI"
    CRA = "CRA"
    DEB = "DEB"
    NC = "NC"

class EmissaoBase(BaseModel):
    data: datetime
    tipo: str
    emissor: str
    valor: float
    link: Optional[str] = None

class EmissaoCreate(EmissaoBase):
    pass

class EmissaoUpdate(BaseModel):
    data: Optional[datetime] = None
    tipo: Optional[str] = Field(None, description="Tipo da emissão: CRI, CRA, DEB ou NC")
    emissor: Optional[str] = Field(None, min_length=1, max_length=255, description="Nome do emissor")
    valor: Optional[float] = Field(None, gt=0, description="Valor deve ser maior que zero")
    link: Optional[str] = None
    gestor_nome: Optional[str] = Field(None, min_length=1, max_length=100, description="Nome do gestor")
       
    @field_validator('tipo')
    @classmethod
    def validar_tipo(cls, v):
        if v is not None:
            tipos_validos = ['CRI', 'CRA', 'DEB', 'NC']
            if v.upper() not in tipos_validos:
                raise ValueError(f'Tipo inválido. Deve ser um de: {", ".join(tipos_validos)}')
            return v.upper()
        return v

    @field_validator('emissor')
    @classmethod
    def validar_emissor(cls, v):
        if v is not None:
            v = v.strip()
            if len(v) == 0:
                raise ValueError('Emissor não pode ser vazio')
        return v

    @field_validator('valor')
    @classmethod
    def validar_valor(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Valor deve ser maior que zero')
        return v

class EmissaoResponse(EmissaoBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 

class HistoricoResponse(BaseModel):
    id: int
    emissao_id: int
    gestor_nome: str
    data_alteracao: datetime
    campos_alterados: Dict[str, Any]

    class Config:
        from_attributes = True


class EmissaoComHistorico(EmissaoResponse):
    historico: List[HistoricoResponse] = []