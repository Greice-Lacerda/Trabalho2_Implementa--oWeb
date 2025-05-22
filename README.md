# Serviço Web CRUD de Tarefas (Python Flask + SQLite)

Este projeto implementa um serviço web RESTful para gerenciamento de tarefas (To-Do List) utilizando Python com o framework Flask para o backend e SQLite como banco de dados. O cliente é uma aplicação web interativa desenvolvida com HTML, CSS e JavaScript, que consome a API RESTful.

## 📅 Data de Entrega

5 de Junho

## 🚀 Funcionalidades

O sistema permite realizar as quatro operações básicas de um CRUD (Create, Read, Update, Delete) em tarefas:

* **Criar (Create):** Adicionar uma nova tarefa com título, descrição e status.
* **Listar (Read All):** Visualizar todas as tarefas existentes.
* **Consultar (Read One):** Obter detalhes de uma tarefa específica por seu ID.
* **Atualizar (Update):** Modificar o título, descrição e/ou status de uma tarefa existente.
* **Excluir (Delete):** Remover uma tarefa do sistema.

## ⚙️ Tecnologias Utilizadas

**Backend (Servidor):**

* **Python:** Linguagem de programação principal.
* **Flask:** Microframework web para construção da API RESTful.
* **Flask-CORS:** Extensão para lidar com a política de Compartilhamento de Recursos de Origem Cruzada (CORS), permitindo que o cliente web (hospedado em outra origem, como GitHub Pages) se comunique com o servidor.
* **SQLite:** Banco de dados relacional leve e embutido, ideal para este tipo de aplicação.

**Frontend (Cliente):**

* **HTML5:** Estrutura da página web.
* **CSS3:** Estilização e layout da interface de usuário.
* **JavaScript (ES6+):** Lógica para interagir com a API RESTful (requisições `Workspace`), manipular o DOM e tornar a interface interativa.

## 📁 Estrutura do Projeto

O projeto está organizado da seguinte forma:
