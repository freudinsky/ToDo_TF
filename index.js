// HTML-Elemente in JS-Variablen verpacken

const form = document.querySelector("#todo-form");
const ulToDo = document.querySelector("#todo-ul");
const ulComplete = document.querySelector("#complete-ul");
const complH2 = document.querySelector("#completed-h2");

// To-Do Liste selbst

let toDos = [
	{ name: "Godzilla waschen", completed: false, id: 111 },
	{ name: "Strand staubsaugen", completed: false, id: 222 },
	{ name: "Shoppen gehen", completed: false, id: 333 },
];

// Local Storage-Stuff -> local storage kann keine Arrays etc. speichern, daher muss das in JSON-Formatierung umgewandelt werden

const localToDos = JSON.parse(localStorage.getItem("ToDos")) ?? [...toDos];
localToDos.forEach((item) => {
	renderList(item);
	if (item.completed === true) {
		const check = document.querySelector(`#check-${item.id}`);
		check.checked = true;
	}
});
// Liste rendern

function renderList(todo) {
	const completed = todo.completed ? "y" : "n";
	const li = document.createElement("li");
	li.setAttribute("class", `completed-${completed}`);
	li.setAttribute("id", todo.id);
	li.innerHTML = `<input type="checkbox" class="check" id="check-${todo.id}">
    <label for="check-${todo.id}"><p>${todo.name}</p></label>
    <button class="delete-todo">Delete</button>`;

	if (todo.completed === false) {
		ulToDo.append(li);
	} else if (todo.completed === true) {
		ulComplete.append(li);
	}
	complHeadHide();
}

function complHeadHide() {
	if (ulComplete.innerHTML === "") {
		complH2.style.display = "none";
	} else if (ulComplete.innerHTML !== "") {
		complH2.style.display = "block";
	}
}

// Delete + Done

function deleteToDo(id, list) {
	localToDos = localToDos.filter((item) => item.id !== Number(id));
	localStorage.clear();
	localStorage.setItem("ToDos", JSON.stringify(localToDos));
	const li = document.getElementById(id);
	list.removeChild(li);
}
function toggleDone(id) {
	const complToDo = localToDos.findIndex((item) => item.id === Number(id));
	localToDos[complToDo].completed = !localToDos[complToDo].completed;
	localStorage.clear();
	localStorage.setItem("ToDos", JSON.stringify(localToDos));
	const li = document.getElementById(id);
	if (localToDos[complToDo].completed) {
		ulComplete.append(li);
		ulToDo.removeChild(li);
	} else if (!localToDos[complToDo].completed) {
		ulToDo.append(li);
		ulComplete.removeChild(li);
	}
}

// Todos hinzufügen

function addNewToDo(name) {
	const newToDo = {
		name: name,
		completed: false,
		id: Date.now(),
	};
	localToDos.push(newToDo);
	localStorage.setItem("ToDos", JSON.stringify(localToDos));
	renderList(newToDo);
}

form.addEventListener("submit", (click) => {
	click.preventDefault();
	const input = document.querySelector("#todo-input");
	const text = input.value.trim();

	if (text !== "") {
		addNewToDo(text);
		input.value = "";
		input.focus();
	}
});

// Delete-Button

ulToDo.addEventListener("click", (event) => {
	if (event.target.classList.contains("delete-todo")) {
		const parent = event.target.parentElement;
		const id = parent.getAttribute("id");
		deleteToDo(id, ulToDo);
	}
});

ulComplete.addEventListener("click", (event) => {
	if (event.target.classList.contains("delete-todo")) {
		const parent = event.target.parentElement;
		const id = parent.getAttribute("id");
		deleteToDo(id, ulComplete);
	}
});

// Completed-Checkbox

ulToDo.addEventListener("click", (event) => {
	if (event.target.classList.contains("check")) {
		const parent = event.target.parentElement;
		const id = parent.getAttribute("id");
		toggleDone(id);
	}
});

ulComplete.addEventListener("click", (event) => {
	if (event.target.classList.contains("check")) {
		const parent = event.target.parentElement;
		const id = parent.getAttribute("id");
		toggleDone(id);
	}
});

// Conditional Rendering der H2 der "Completed-Liste"

document.addEventListener("click", () => complHeadHide());
