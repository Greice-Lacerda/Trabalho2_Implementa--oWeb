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

// Novas variáveis para os botões de opção e a seção da lista de compras
const taskOptionContainer = document.getElementById("taskOptionContainer");
const newTaskOptionBtn = document.getElementById("newTaskOption");
const createShoppingListOptionBtn = document.getElementById(
  "createShoppingListOption"
);
const shoppingListContainer = document.getElementById("shoppingListContainer");
const shoppingListCheckboxesContainer = document.getElementById(
  "shoppingListCheckboxes"
); // Novo contêiner para os checkboxes
// O taskStatusSelect será usado para ambas as opções (tarefa e lista de compras)
const addTaskForm = document.querySelector(".task-form"); // Formulário original de adição de tarefa

// Itens de exemplo para a lista de compras
const shoppingItems = [
  "Arroz",
  "Feijão",
  "Café",
  "Açúcar",
  "Óleo",
  "Leite",
  "Pão",
  "Ovos",
  "Carne",
  "Frango",
  "Verduras",
  "Frutas",
  "Sabonete",
  "Pasta de Dente",
  "Papel Higiênico",
  "Detergente",
  "Desinfetante",
  "Esponja",
  "Vassoura",
  "Doce",
  "Biscoito"
];

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
                    <span class="task-description">${task.description.replace(
                      /\n/g,
                      "<br>"
                    )}</span> <span class="task-status">${task.status}</span>
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

// Função para adicionar uma nova tarefa (lógica original)
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

// Função para adicionar uma lista de compras como tarefa
async function addShoppingListTask() {
  const selectedItems = Array.from(
    shoppingListCheckboxesContainer.querySelectorAll(
      'input[type="checkbox"]:checked'
    )
  ).map((checkbox) => checkbox.value);
  const status = taskStatusSelect.value; // Pega o status do select comum

  if (selectedItems.length === 0) {
    showMessage(
      "Selecione pelo menos um item para a lista de compras!",
      "error"
    );
    return;
  }

  const title = "Fazer Compras";
  const description = "Lista de itens:\n- " + selectedItems.join("\n- ");

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

    // Desmarca todos os checkboxes
    shoppingListCheckboxesContainer
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });
    showMessage("Lista de compras adicionada com sucesso!");
    loadTasks(); // Recarrega a lista de tarefas
    // Volta para a opção "Digitar nova tarefa" após adicionar a lista
    newTaskOptionBtn.checked = true;
    toggleTaskInputVisibility();
  } catch (error) {
    console.error("Erro ao adicionar lista de compras:", error);
    showMessage(
      `Erro ao adicionar lista de compras: ${error.message}`,
      "error"
    );
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

// Função para preencher a lista de checkboxes de compras
function populateShoppingListCheckboxes() {
  shoppingListCheckboxesContainer.innerHTML = ""; // Limpa checkboxes existentes
  shoppingItems.forEach((item, index) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = item;
    checkbox.id = `item-${index}`; // Adiciona um ID único

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(item));
    shoppingListCheckboxesContainer.appendChild(label);
    shoppingListCheckboxesContainer.appendChild(document.createElement("br")); // Para cada item em uma nova linha
  });
}

// Função para alternar a visibilidade dos campos de entrada de tarefa/lista de compras
function toggleTaskInputVisibility() {
  if (newTaskOptionBtn.checked) {
    addTaskForm.style.display = "flex"; // Mostra o formulário de tarefa (ajustado para flex)
    shoppingListContainer.style.display = "none"; // Esconde a lista de compras
    // Mantém o taskStatusSelect visível, pois ele é comum
    addTaskBtn.removeEventListener("click", addShoppingListTask); // Remove o listener da lista de compras
    addTaskBtn.addEventListener("click", addTask); // Adiciona o listener da tarefa normal
    addTaskBtn.textContent = "Adicionar Tarefa";
  } else if (createShoppingListOptionBtn.checked) {
    addTaskForm.style.display = "none"; // Esconde o formulário de tarefa
    shoppingListContainer.style.display = "block"; // Mostra a lista de compras
    populateShoppingListCheckboxes(); // Preenche os checkboxes
    // Mantém o taskStatusSelect visível, pois ele é comum
    addTaskBtn.removeEventListener("click", addTask); // Remove o listener da tarefa normal
    addTaskBtn.addEventListener("click", addShoppingListTask); // Adiciona o listener da lista de compras
    addTaskBtn.textContent = "Criar Lista de Compras"; // Texto do botão muda
  }
}

// --- Event Listeners ---
// Adiciona listeners para os botões de opção
newTaskOptionBtn.addEventListener("change", toggleTaskInputVisibility);
createShoppingListOptionBtn.addEventListener(
  "change",
  toggleTaskInputVisibility
);

// Listener inicial para o botão de adicionar (será alternado pela função toggle)
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
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  // Garante que a opção "Digitar nova tarefa" esteja selecionada por padrão ao carregar
  newTaskOptionBtn.checked = true;
  toggleTaskInputVisibility();
});
