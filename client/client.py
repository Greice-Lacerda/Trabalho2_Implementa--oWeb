import requests
import json # Para formatar a saída JSON

# URL base da nossa API
BASE_URL = "http://127.0.0.1:5000/tasks"

def get_all_tasks():
    """Busca e exibe todas as tarefas."""
    print("\n--- Listando todas as tarefas ---")
    try:
        response = requests.get(BASE_URL)
        response.raise_for_status() # Lança um HTTPError para respostas de erro (4xx ou 5xx)
        tasks = response.json()
        if tasks:
            for task in tasks:
                print(f"ID: {task['id']}, Título: {task['title']}, Status: {task['status']}")
        else:
            print("Nenhuma tarefa encontrada.")
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar tarefas: {e}")

def get_task_by_id(task_id):
    """Busca e exibe uma tarefa específica pelo ID."""
    print(f"\n--- Buscando tarefa com ID: {task_id} ---")
    try:
        response = requests.get(f"{BASE_URL}/{task_id}")
        response.raise_for_status()
        task = response.json()
        print(f"ID: {task['id']}, Título: {task['title']}, Descrição: {task['description']}, Status: {task['status']}")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"Tarefa com ID {task_id} não encontrada.")
        else:
            print(f"Erro HTTP ao buscar tarefa: {e}")
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão ao buscar tarefa: {e}")

def create_task(title, description="", status="pendente"):
    """Cria uma nova tarefa."""
    print(f"\n--- Criando tarefa: '{title}' ---")
    task_data = {
        "title": title,
        "description": description,
        "status": status
    }
    try:
        response = requests.post(BASE_URL, json=task_data)
        response.raise_for_status()
        new_task = response.json()
        print(f"Tarefa criada com sucesso! ID: {new_task['id']}, Título: {new_task['title']}")
        return new_task['id']
    except requests.exceptions.HTTPError as e:
        print(f"Erro HTTP ao criar tarefa: {e}")
        print(f"Detalhes: {e.response.json().get('message', 'Nenhum detalhe')}")
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão ao criar tarefa: {e}")
    return None

def update_task(task_id, title=None, description=None, status=None):
    """Atualiza uma tarefa existente pelo ID."""
    print(f"\n--- Atualizando tarefa com ID: {task_id} ---")
    update_data = {}
    if title is not None:
        update_data['title'] = title
    if description is not None:
        update_data['description'] = description
    if status is not None:
        update_data['status'] = status

    if not update_data:
        print("Nenhum dado para atualização fornecido.")
        return

    try:
        response = requests.put(f"{BASE_URL}/{task_id}", json=update_data)
        response.raise_for_status()
        updated_task = response.json()
        print(f"Tarefa com ID {task_id} atualizada com sucesso!")
        print(f"Novo estado: Título: {updated_task['title']}, Status: {updated_task['status']}")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"Tarefa com ID {task_id} não encontrada para atualização.")
        else:
            print(f"Erro HTTP ao atualizar tarefa: {e}")
            print(f"Detalhes: {e.response.json().get('message', 'Nenhum detalhe')}")
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão ao atualizar tarefa: {e}")

def delete_task(task_id):
    """Deleta uma tarefa específica pelo ID."""
    print(f"\n--- Deletando tarefa com ID: {task_id} ---")
    try:
        response = requests.delete(f"{BASE_URL}/{task_id}")
        response.raise_for_status()
        message = response.json().get('message', 'Tarefa deletada.')
        print(message)
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"Tarefa com ID {task_id} não encontrada para exclusão.")
        else:
            print(f"Erro HTTP ao deletar tarefa: {e}")
            print(f"Detalhes: {e.response.json().get('message', 'Nenhum detalhe')}")
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão ao deletar tarefa: {e}")

# --- Demonstração das operações CRUD ---
if __name__ == "__main__":
    # Certifique-se de que o servidor está rodando em http://127.0.0.1:5000

    # 1. Listar todas as tarefas (inicial)
    get_all_tasks()

    # 2. Criar algumas tarefas
    new_task_id_1 = create_task("Lavar o carro", "Lavar por dentro e por fora", "pendente")
    new_task_id_2 = create_task("Fazer compras", "Comprar itens de supermercado", "pendente")

    # 3. Listar todas as tarefas novamente para ver as novas
    get_all_tasks()

    # 4. Buscar uma tarefa específica (use o ID de uma das tarefas que você criou)
    if new_task_id_1:
        get_task_by_id(new_task_id_1)
    else:
        # Se a criação falhou, tentamos buscar uma tarefa existente (ex: ID 1 das tarefas iniciais)
        get_task_by_id(1)

    # 5. Atualizar uma tarefa (ex: mudar o status da primeira tarefa criada)
    if new_task_id_1:
        update_task(new_task_id_1, status="em progresso")
        get_task_by_id(new_task_id_1) # Verificar a atualização

    # 6. Atualizar uma tarefa com múltiplos campos (ex: mudar título e descrição da segunda tarefa)
    if new_task_id_2:
        update_task(new_task_id_2, title="Fazer compras do mês", description="Comprar mantimentos para o mês")
        get_task_by_id(new_task_id_2)

    # 7. Tentar buscar uma tarefa inexistente
    get_task_by_id(999)

    # 8. Deletacd cd