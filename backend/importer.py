import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from database import SessaoLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

def importaDados():
    df = pd.read_excel("Primario2025.xlsx")
    print(f"Total de registros: {len(df)}")
    print(f"Colunas: {df.columns.tolist()}")
    
    df.columns = df.columns.str.strip()  
    db = SessaoLocal()
    
    try:
        db.query(models.Emissao).delete()
        db.commit()
        print("Tabela limpa.")
        
        sucesso = 0
        erros = 0
        
        for index, row in df.iterrows():
            try:
                data_emissao = row['Data']
                if isinstance(data_emissao, str):
                    data_emissao = datetime.strptime(data_emissao, "%Y-%m-%d")
                elif isinstance(data_emissao, pd.Timestamp):
                    data_emissao = data_emissao.to_pydatetime()
                
                valor = float(row['Valor']) if pd.notna(row['Valor']) else 0.0
                
                link = str(row['Link']) if pd.notna(row['Link']) else None
                
                emissao = models.Emissao(
                    data=data_emissao,
                    tipo=str(row['Tipo']).strip(),
                    emissor=str(row['Emissor']).strip(),
                    valor=valor,
                    link=link
                )
                
                db.add(emissao)
                sucesso += 1
                if sucesso % 100 == 0:
                    db.commit()
                    
            except Exception as e:
                erros += 1
                print(f"Erro na linha {index}: {e}")
                continue
        
        db.commit()
        
        print(f"Registros com erro: {erros}")
        
    except Exception as e:
        print(f"Erro geral: {e}")
        db.rollback()
    finally:
        db.close()

# Executar a importação
if __name__ == "__main__":
    importaDados()
