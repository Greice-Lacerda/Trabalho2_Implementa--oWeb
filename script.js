const BASE_URL = "http://127.0.0.1:5000/tasks";

const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskStatusSelect = document.getElementById("taskStatus");
const addTaskBtn = document.getElementById("addTaskBtn");
const tasksContainer = document.getElementById("tasksContainer");
const messageContainer = document.createElement("div"); // Criar um elemento para mensagens
messageContainer.className = "message";
document
  .querySelector(".container")
  .insertBefore(messageContainer, document.querySelector(".task-form"));

// Função para exibir mensagens temporárias
function showMessage(msg, type = "success") {
  messageContainer.textContent = msg;
  messageContainer.className = `message ${type}`; // Adiciona classes de estilo
  messageContainer.style.display = "block";
  setTimeout(() => {
    messageContainer.style.display = "none";
    messageContainer.textContent = "";
  }, 3000); // Esconde a mensagem após 3 segundos
}

// Função para carregar e exibir as tarefas
async function loadTasks() {
  tasksContainer.innerHTML = "<li>Carregando tarefas...</li>"; // Feedback de carregamento
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tasks = await response.json();
    tasksContainer.innerHTML = ""; // Limpa o container antes de adicionar as tarefas

    if (tasks.length === 0) {
      tasksContainer.innerHTML = "<li>Nenhuma tarefa encontrada.</li>";
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.setAttribute("data-id", task.id); // Armazena o ID da tarefa no elemento li

      // Adiciona classe de status para estilização CSS
      li.classList.add(`status-${task.status.replace(/\s/g, "-")}`);

      li.innerHTML = `
                <div>
                    <span class="task-title">${task.title}</span>
                    <span class="task-description">${task.description}</span>
                    <span class="task-status">${task.status}</span>
                </div>
                <div class="task-actions">
                    <select class="status-selector">
                        <option value="pendente">Pendente</option>
                        <option value="em progresso">Em Progresso</option>
                        <option value="concluída">Concluída</option>
                    </select>
                    <button class="update-status-btn">Atualizar Status</button>
                    <button class="delete-btn">Excluir</button>
                </div>
            `;

      // Configura o valor selecionado no dropdown de status
      const statusSelector = li.querySelector(".status-selector");
      statusSelector.value = task.status; // Define o status atual como selecionado

      tasksContainer.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    tasksContainer.innerHTML = `<li>Erro ao carregar tarefas: ${error.message}</li>`;
    showMessage("Erro ao carregar tarefas.", "error");
  }
}

// Função para adicionar uma nova tarefa
async function addTask() {
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const status = taskStatusSelect.value;

  if (!title) {
    showMessage("O título da tarefa é obrigatório!", "error");
    return;
  }

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    taskTitleInput.value = ""; // Limpa o input
    taskDescriptionInput.value = "";
    taskStatusSelect.value = "pendente"; // Reseta o status
    showMessage("Tarefa adicionada com sucesso!");
    loadTasks(); // Recarrega a lista de tarefas
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    showMessage(`Erro ao adicionar tarefa: ${error.message}`, "error");
  }
}

// Função para deletar uma tarefa
async function deleteTask(id) {
  if (!confirm(`Tem certeza que deseja excluir a tarefa com ID ${id}?`)) {
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    showMessage("Tarefa excluída com sucesso!");
    loadTasks(); // Recarrega a lista de tarefas
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    showMessage(`Erro ao deletar tarefa: ${error.message}`, "error");
  }
}

// Nova função para atualizar apenas o status de uma tarefa
async function updateTaskStatus(id, newStatus) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }), // Envia apenas o status
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    showMessage("Status da tarefa atualizado com sucesso!");
    loadTasks(); // Recarrega a lista para refletir a mudança
  } catch (error) {
    console.error("Erro ao atualizar status da tarefa:", error);
    showMessage(`Erro ao atualizar status: ${error.message}`, "error");
  }
}

// --- Event Listeners ---
addTaskBtn.addEventListener("click", addTask);

// Usamos delegação de evento para os botões de exclusão e atualização
tasksContainer.addEventListener("click", (event) => {
  // Lógica para o botão de exclusão
  if (event.target.classList.contains("delete-btn")) {
    const li = event.target.closest("li"); // Encontra o elemento <li> pai
    const taskId = li.getAttribute("data-id");
    deleteTask(taskId);
  }

  // Lógica para o botão de atualização de status
  if (event.target.classList.contains("update-status-btn")) {
    const li = event.target.closest("li"); // Encontra o elemento <li> pai
    const taskId = li.getAttribute("data-id");
    const statusSelector = li.querySelector(".status-selector");
    const newStatus = statusSelector.value; // Pega o novo status selecionado

    updateTaskStatus(taskId, newStatus); // Chama a função de atualização
  }
});

// Carregar as tarefas quando a página carregar
document.addEventListener("DOMContentLoaded", loadTasks);
