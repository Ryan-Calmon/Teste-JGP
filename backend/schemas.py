from pydantic import BaseModel
from datetime import datetime
from typing import Optional


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
    tipo: Optional[str] = None
    emissor: Optional[str] = None
    valor: Optional[float] = None
    link: Optional[str] = None

class EmissaoResponse(EmissaoBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Permite converter do modelo SQLAlchemy
