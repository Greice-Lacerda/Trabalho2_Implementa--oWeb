import sqlite3
from flask import Flask, jsonify, request, g

# --- Configuração do Flask ---
app = Flask(__name__)
app.config['DATABASE'] = 'tasks.db' # Nome do arquivo do banco de dados SQLite

# --- Funções de Banco de Dados ---

def get_db():
    """
    Função para obter a conexão com o banco de dados SQLite.
    Reutiliza a conexão se já existir no contexto da requisição (g).
    """
    if 'db' not in g:
        # Abre uma conexão com o banco de dados.
        # detect_types=sqlite3.PARSE_DECLTYPES|sqlite3.PARSE_COLNAMES
        # Isso ajuda a converter tipos de dados do banco de dados automaticamente.
        g.db = sqlite3.connect(
            app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES|sqlite3.PARSE_COLNAMES
        )
        # Configura o row_factory para que as linhas retornadas sejam acessíveis como dicionários.
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    """
    Função para fechar a conexão com o banco de dados no final da requisição.
    """
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    """
    Função para inicializar o esquema do banco de dados (criar tabelas).
    """
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()
    print("Banco de dados inicializado com sucesso!")

# Registra a função close_db para ser executada após cada requisição.
app.teardown_appcontext(close_db)

# --- Exemplo de Rota (apenas para testar o servidor) ---

@app.route('/')
def hello_world():
    return 'Olá, mundo! O servidor está funcionando!'

# --- Bloco de Execução Principal ---
if __name__ == '__main__':
    # Antes de rodar o aplicativo, vamos inicializar o banco de dados.
    # Esta parte só é executada quando você executa app.py diretamente.
    # É uma boa prática chamar init_db separadamente ou ter um script de inicialização.
    # Por simplicidade neste projeto, vamos colocá-lo aqui.
    with app.app_context(): # Necessário para acessar 'g' e 'app.config' fora de uma requisição
        init_db()
    app.run(debug=True) # debug=True reinicia o servidor em cada mudança de código