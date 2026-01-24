from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import engine, get_db
import models
import schemas
import crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Ryan Calmon JGP",
    description="API",
    version="1.0.0"
)


@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API JGP Crédito!"}


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API funcionando corretamente"}


@app.get("/info")
def info_check():
    return {"nome": "Ryan Calmon", "data": "24/01/2026"}


@app.get("/emissoes")
def listar_emissoes(
    page: int = Query(1, ge=1, description="Número da página"),
    page_size: int = Query(20, ge=1, le=100, description="Itens por página"),
    tipo: Optional[str] = Query(None, description="Filtrar por tipo (CRI, CRA, DEB, NC)"),
    emissor: Optional[str] = Query(None, description="Filtrar por nome do emissor"),
    data_inicio: Optional[str] = Query(None, description="Data inicial (YYYY-MM-DD)"),
    data_fim: Optional[str] = Query(None, description="Data final (YYYY-MM-DD)"),
    valor_min: Optional[float] = Query(None, description="Valor mínimo"),
    valor_max: Optional[float] = Query(None, description="Valor máximo"),
    sort_by: str = Query("data", description="Campo para ordenação"),
    sort_order: str = Query("desc", description="Ordem: asc ou desc"),
    # Dependência do banco de dados
    db: Session = Depends(get_db)
):
    skip = (page - 1) * page_size
    
    resultado = crud.get_emissoes(
        db=db,
        skip=skip,
        limit=page_size,
        tipo=tipo,
        emissor=emissor,
        data_inicio=data_inicio,
        data_fim=data_fim,
        valor_min=valor_min,
        valor_max=valor_max,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    return resultado


@app.get("/emissoes/tipos")
def listar_tipos(db: Session = Depends(get_db)):
    return crud.get_tipos_unicos(db)


@app.get("/emissoes/{emissao_id}")
def buscar_emissao(emissao_id: int, db: Session = Depends(get_db)):

    emissao = crud.get_emissao_by_id(db, emissao_id)
    
    if emissao is None:
        raise HTTPException(status_code=404, detail="Emissão não encontrada")
    
    return emissao


@app.put("/emissoes/{emissao_id}")
def atualizar_emissao(
    emissao_id: int,
    emissao_data: schemas.EmissaoUpdate,
    db: Session = Depends(get_db)
):

    emissao = crud.update_emissao(db, emissao_id, emissao_data)
    
    if emissao is None:
        raise HTTPException(status_code=404, detail="Emissão não encontrada")
    
    return emissao



@app.get("/stats")
def obter_estatisticas(db: Session = Depends(get_db)):

    return crud.get_estatisticas(db)
