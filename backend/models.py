from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Emissao(Base):
    __tablename__ = "emissoes"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    data = Column(DateTime, nullable=False)
    tipo = Column(String(10), nullable=False)
    emissor = Column(String(255), nullable=False)
    valor = Column(Float, nullable=False)
    link = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
