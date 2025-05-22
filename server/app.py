import sqlite3
from flask import Flask, jsonify, request, g
from flask_cors import CORS # Importar a extensão CORS

# --- Configuração do Flask ---
app = Flask(__name__)
app.config['DATABASE'] = 'tasks.db' # Nome do arquivo do banco de dados SQLite
CORS(app) # Habilita CORS para todas as rotas e todas as origens

# --- Funções de Banco de Dados (sem alterações) ---
# ... (manter as funções get_db, close_db, init_db aqui) ...

def get_db():
    # ... (manter o conteúdo da função) ...
    if 'db' not in g:
        g.db = sqlite3.connect(
            app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES|sqlite3.PARSE_COLNAMES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    # ... (manter o conteúdo da função) ...
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    # ... (manter o conteúdo da função) ...
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()
    print("Banco de dados inicializado com sucesso!")

app.teardown_appcontext(close_db)

# --- Rotas da API de Tarefas (CRUD - sem alterações) ---
# ... (manter todas as rotas @app.route('/tasks', ...) aqui) ...

@app.route('/tasks', methods=['GET'])
def get_tasks():
    # ... (manter o conteúdo da função) ...
    db = get_db()
    tasks = db.execute('SELECT * FROM tasks').fetchall()
    return jsonify([dict(task) for task in tasks])

# ... (manter todas as outras rotas: get_task, create_task, update_task, delete_task) ...

# --- Bloco de Execução Principal (sem alterações) ---
if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True)