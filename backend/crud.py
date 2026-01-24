from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from typing import Optional, List
import models
import schemas

def get_emissoes(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    tipo: Optional[str] = None,
    emissor: Optional[str] = None,
    data_inicio: Optional[str] = None,
    data_fim: Optional[str] = None,
    valor_min: Optional[float] = None,
    valor_max: Optional[float] = None,
    sort_by: str = "data",
    sort_order: str = "desc"
):

    query = db.query(models.Emissao)
    
    # Aplica os filtros
    if tipo:
        query = query.filter(models.Emissao.tipo == tipo)
    
    if emissor:
        # Busca parcial (LIKE) no nome
        query = query.filter(models.Emissao.emissor.ilike(f"%{emissor}%"))
    
    if data_inicio:
        query = query.filter(models.Emissao.data >= data_inicio)
    
    if data_fim:
        query = query.filter(models.Emissao.data <= data_fim)
    
    if valor_min is not None:
        query = query.filter(models.Emissao.valor >= valor_min)
    
    if valor_max is not None:
        query = query.filter(models.Emissao.valor <= valor_max)
    
    # Conta o total antes de paginar
    total = query.count()
    
    coluna_ordenacao = getattr(models.Emissao, sort_by, models.Emissao.data)
    if sort_order == "desc":
        query = query.order_by(desc(coluna_ordenacao))
    else:
        query = query.order_by(asc(coluna_ordenacao))

    emissoes = query.offset(skip).limit(limit).all()
    
    return {
        "data": emissoes,
        "total": total,
        "page": (skip // limit) + 1,
        "page_size": limit,
        "total_pages": (total + limit - 1) // limit
    }


def get_emissao_by_id(db: Session, emissao_id: int):

    return db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()


def update_emissao(db: Session, emissao_id: int, emissao_data: schemas.EmissaoUpdate):

    emissao = db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()
    
    if not emissao:
        return None
    
    update_data = emissao_data.model_dump(exclude_unset=True)
    
    for campo, valor in update_data.items():
        setattr(emissao, campo, valor)
    
    db.commit()
    db.refresh(emissao)
    
    return emissao


def get_tipos_unicos(db: Session) -> List[str]:

    tipos = db.query(models.Emissao.tipo).distinct().all()
    return [t[0] for t in tipos]


def get_estatisticas(db: Session):
    total = db.query(func.count(models.Emissao.id)).scalar()
    volume_total = db.query(func.sum(models.Emissao.valor)).scalar() or 0
    
    por_tipo = db.query(
        models.Emissao.tipo,
        func.count(models.Emissao.id).label("count"),
        func.sum(models.Emissao.valor).label("volume")
    ).group_by(models.Emissao.tipo).all()
    
    top_emissores = db.query(
        models.Emissao.emissor,
        func.count(models.Emissao.id).label("count"),
        func.sum(models.Emissao.valor).label("volume")
    ).group_by(models.Emissao.emissor)\
     .order_by(desc(func.sum(models.Emissao.valor)))\
     .limit(10).all()
    
    return {
        "total": total,
        "volume_total": volume_total,
        "por_tipo": [
            {"tipo": t.tipo, "count": t.count, "volume": t.volume}
            for t in por_tipo
        ],
        "top_emissores": [
            {"emissor": e.emissor, "count": e.count, "volume": e.volume}
            for e in top_emissores
        ]
    }
