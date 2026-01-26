from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from typing import Optional, List
from datetime import datetime, timedelta, timezone
import models
import schemas
BRASILIA_TZ = timezone(timedelta(hours=-3))

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
    
    if tipo:
        query = query.filter(models.Emissao.tipo == tipo)
    if emissor:
        query = query.filter(models.Emissao.emissor.ilike(f"%{emissor}%"))
    if data_inicio:
        try:
            data_ini = datetime.strptime(data_inicio, "%Y-%m-%d")
            query = query.filter(models.Emissao.data >= data_ini)
        except ValueError as e:
            print(f"Data início inválida: {data_inicio} - {e}")
            return {
                "items": [],
                "total": 0,
                "page": 1,
                "pages": 0
            }
    if data_fim:
        try:
            data_f = datetime.strptime(data_fim, "%Y-%m-%d")
            data_f_fim = data_f + timedelta(days=1)
            query = query.filter(models.Emissao.data < data_f_fim)
        except ValueError as e:
            print(f"Data fim inválida: {data_fim} - {e}")
            return {
                "items": [],
                "total": 0,
                "page": 1,
                "pages": 0
            }
    if valor_min is not None:
        query = query.filter(models.Emissao.valor >= valor_min)
    if valor_max is not None:
        query = query.filter(models.Emissao.valor <= valor_max)
    
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
    """Busca uma emissão pelo ID."""
    return db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()


def update_emissao(db: Session, emissao_id: int, emissao_data: schemas.EmissaoUpdate):
    """Atualiza uma emissão e registra no histórico."""
    emissao = db.query(models.Emissao).filter(models.Emissao.id == emissao_id).first()
    
    if not emissao:
        return None
    
    gestor_nome = emissao_data.gestor_nome or "Anônimo"
    campos_alterados = {}
    update_data = emissao_data.model_dump(exclude_unset=True, exclude={"gestor_nome"})

    for campo, novo_valor in update_data.items():
        valor_antigo = getattr(emissao, campo)
        if campo == 'data':
            if isinstance(valor_antigo, datetime):
                valor_antigo_date = valor_antigo.date()
            else:
                valor_antigo_date = valor_antigo
            
            if isinstance(novo_valor, datetime):
                novo_valor_date = novo_valor.date()
            else:
                novo_valor_date = novo_valor
            if valor_antigo_date != novo_valor_date:
                campos_alterados[campo] = {
                    "anterior": str(valor_antigoc_date),
                    "novo": str(novo_valor_date)
                }
        else:
            if valor_antigo != novo_valor:
                campos_alterados[campo] = {
                    "anterior": str(valor_antigo) if valor_antigo else None,
                    "novo": str(novo_valor) if novo_valor else None
                }
    
    if campos_alterados:
        historico = models.HistoricoAlteracao(
            emissao_id=emissao_id,
            gestor_nome=gestor_nome,
            data_alteracao=datetime.now(BRASILIA_TZ),
            campos_alterados=campos_alterados
        )
        db.add(historico)
    
    for campo, valor in update_data.items():
        setattr(emissao, campo, valor)
    
    db.commit()
    db.refresh(emissao)
    
    return emissao

def get_evolucao_mensal(db: Session):
    """Retorna a evolução mensal de emissões (volume e quantidade)."""
    from sqlalchemy import extract
    
    resultados = db.query(
        extract('year', models.Emissao.data).label('ano'),
        extract('month', models.Emissao.data).label('mes'),
        func.count(models.Emissao.id).label('quantidade'),
        func.sum(models.Emissao.valor).label('volume')
    ).group_by(
        extract('year', models.Emissao.data),
        extract('month', models.Emissao.data)
    ).order_by(
        extract('year', models.Emissao.data),
        extract('month', models.Emissao.data)
    ).all()
    
    return [
        {
            "ano": int(r.ano),
            "mes": int(r.mes),
            "quantidade": r.quantidade,
            "volume": float(r.volume) if r.volume else 0
        }
        for r in resultados
    ]


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

def get_historico_emissao(db: Session, emissao_id: int):
    return db.query(models.HistoricoAlteracao)\
        .filter(models.HistoricoAlteracao.emissao_id == emissao_id)\
        .order_by(desc(models.HistoricoAlteracao.data_alteracao))\
        .all()
