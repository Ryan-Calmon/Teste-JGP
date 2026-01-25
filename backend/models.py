from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Emissao(Base):
    
    #Modelo Main da database
    __tablename__ = "emissoes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    data = Column(DateTime, nullable=False)
    tipo = Column(String(10), nullable=False)
    emissor = Column(String(255), nullable=False)
    valor = Column(Float, nullable=False)
    link = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relacionamento com histórico
    historico = relationship("HistoricoAlteracao", back_populates="emissao")


class HistoricoAlteracao(Base):

    #histórico para acompanhamento de alterações nas emissões
    __tablename__ = "historico_alteracoes"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emissao_id = Column(Integer, ForeignKey("emissoes.id"), nullable=False)
    gestor_nome = Column(String(100), nullable=False)
    data_alteracao = Column(DateTime, server_default=func.now(), nullable=False)
    campos_alterados = Column(JSON, nullable=False)
    emissao = relationship("Emissao", back_populates="historico")
