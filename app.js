const MAIN_URL = "https://dummyjson.com/todos";

//Select DOM
const todoInput = document.querySelector(".todo-input");
const singleTodoInput = document.querySelector("#single-todo-input");
const todoButton = document.querySelector(".todo-button");
const singleTodoBtn = document.querySelector("#single-todo-btn");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
singleTodoBtn.addEventListener("click", showSingleTodo);
todoList.addEventListener("click", deleteTodo);
filterOption.addEventListener("click", filterTodo);

function createNewTodo(todoTitle) {
  let newTodo = {
    id: Date.now(),
    todo: todoTitle,
    completed: false,
    userId: Date.now(),
  };
  return newTodo;
}

//Functions
function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  //Save to local - do this last
  //Save to local
  saveLocalTodos(createNewTodo(todoInput.value));
  //
  newTodo.classList.add("todo-item");
  newTodo.style.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  // console.log(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  todoDiv.appendChild(newTodo);
  todoInput.value = "";
  //Create Completed Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  //Create trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //attach final Todo
  todoList.appendChild(todoDiv);
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    // e.target.parentElement.remove();
    const todo = item.parentElement;
    todo.classList.add("fall");
    //at the end
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", (e) => {
      todo.remove();
    });
  }
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    console.log(todo);
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
    }
  });
}

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function showSingleTodo() {
  let todos = fetchSingleTodo(Number(singleTodoInput.value));
  console.log(todos);
}

function checkLocalStorageReturnTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    return (todos = []);
  } else {
    return (todos = JSON.parse(localStorage.getItem("todos")));
  }
}

async function fetchTodos() {
  let response = await fetch(MAIN_URL);
  let dataObj = await response.json();
  let todos = dataObj.todos;
  return todos;
}

async function fetchSingleTodo(todoId = 1) {
  let url = `${MAIN_URL}/${todoId}`;
  let response = await fetchTodos(url);
  let data = await response.json();
  return data;
}

async function getTodos() {
  let fetchedTodos = await fetchTodos();

  console.log(fetchedTodos);
  localStorage.setItem("todos", JSON.stringify(fetchedTodos));
  let todos = checkLocalStorageReturnTodos();

  todos.forEach(function (todoObj) {
    const { todo, completed } = todoObj;
    //Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    newTodo.style.color = `#${Math.floor(Math.random() * 16777215).toString(
      16
    )}`;
    todoDiv.appendChild(newTodo);
    todoInput.value = "";
    //Create Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //attach final Todo
    todoList.appendChild(todoDiv);
  });
}
