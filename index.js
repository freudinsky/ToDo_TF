// Anstehende Optimierungen:
// - if/elses einkürzen -> bei multiline den multiline-code in fn mit dyn parametern

// HTML-Elemente in JS-Variablen verpacken

const form = document.querySelector("#todo-form");
const ulToDo = document.querySelector("#todo-ul");
const ulComplete = document.querySelector("#complete-ul");
const complH2 = document.querySelector("#completed-h2");
const clearDoneBtn = document.querySelector(".clear-done");
const clearOpenBtn = document.querySelector(".clear-open");
const clearAllBtn = document.querySelector(".clear-all");

// Default-ToDos, falls im Local Storage noch nichts angelegt wurde

let toDos = [
	{ name: "Godzilla waschen", completed: false, id: "111" },
	{ name: "Strand staubsaugen", completed: false, id: "222" },
	{ name: "Shoppen gehen", completed: false, id: "333" },
];

// eigentliches ToDo-Listen-Array & Local Storage-Stuff -> local storage kann keine Arrays etc. speichern, daher muss das in JSON-Formatierung umgewandelt werden

let localToDos = JSON.parse(localStorage.getItem("ToDos")) ?? [...toDos];
localToDos.forEach((item) => {
	renderList(item);
	if (item.completed === true) {
		const check = document.querySelector(`#check-${item.id}`);
		check.checked = true; // Setzt nach Reload den Erledigt-Haken bei erledigten Aufgaben
	}
});

// li-Elemente rendern

function renderList(todo) {
	const completed = todo.completed ? "y" : "n";
	const li = document.createElement("li");
	const text = todo.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Verhindert, dass eventueller HTML-Code aus dem Input als solcher erkannt und interpretiert wird
	li.setAttribute("class", `completed-${completed}`);
	li.setAttribute("id", todo.id);
	li.innerHTML = `<input type="checkbox" class="check" id="check-${todo.id}">
    <label for="check-${todo.id}"><p>${text}</p></label>
    <button class="delete-todo">Delete</button>`;

	if (todo.completed === false) {
		ulToDo.append(li);
	} else if (todo.completed === true) {
		ulComplete.append(li);
	}
	complHeadHide();
}


// Condtional Rendering für Completed H2 -> Funktion für eventListener

function complHeadHide() {
	if (ulComplete.innerHTML === "") {
		complH2.style.display = "none";
		ulComplete.style.display = "none";
		clearDoneBtn.style.display = "none";
	} else if (ulComplete.innerHTML !== "") {
		complH2.style.display = "block";
		ulComplete.style.display = "block";
		clearDoneBtn.style.display = "block";
	}
}

function hideClearBtn() {
	if (ulToDo.innerHTML === "") {
		clearOpenBtn.style.display = "none";
		clearAllBtn.style.display = "none";
	} else {
		clearOpenBtn.style.display = "block";
		clearAllBtn.style.display = "block";
	}
}
function hideClearAllBtn() {
	if (ulToDo.innerHTML === "" && ulComplete.innerHTML === "") {
		clearAllBtn.style.display = "none";
	} else {
		clearAllBtn.style.display = "block";
	}
}

// Delete + Done Functions

function deleteToDo(id, list) {
	localToDos = localToDos.filter((item) => item.id !== String(id));
	localStorage.clear();
	localStorage.setItem("ToDos", JSON.stringify(localToDos));
	const li = document.getElementById(id);
	list.removeChild(li);
}
function toggleDone(id) {
	const complToDo = localToDos.findIndex((item) => item.id === String(id));
	localToDos[complToDo].completed = !localToDos[complToDo].completed;
	localStorage.clear();
	localStorage.setItem("ToDos", JSON.stringify(localToDos));
	const li = document.getElementById(id);
	localToDos[complToDo].completed ? ulComplete.append(li) : ulToDo.append(li);
}

function clearDone() {
	localToDos = localToDos.filter((item) => item.completed === false);
	localStorage.clear();
	localStorage.setItem("ToDos", JSON.stringify(localToDos));
	const complList = document.querySelectorAll("#complete-ul>li");
	complList.forEach((item) => ulComplete.removeChild(item));
}
function clearOpen() {
	localToDos = localToDos.filter((item) => item.completed === true);
	localStorage.clear();
	localStorage.setItem("ToDos", JSON.stringify(localToDos));
	const complList = document.querySelectorAll("#todo-ul>li");
	complList.forEach((item) => ulToDo.removeChild(item));
}

// Todos hinzufügen

function addNewToDo(name) {
	const newToDo = {
		name: name,
		completed: false,
		id: crypto.randomUUID(),
	};
	localToDos.push(newToDo);
	localStorage.setItem("ToDos", JSON.stringify(localToDos));
	renderList(newToDo);
}

////////////////////////////////////////
////////////////////////////////////////
/////////// EventListeners /////////////
////////////////////////////////////////
////////////////////////////////////////

// Submit/Create new todo

form.addEventListener("submit", (click) => {
	click.preventDefault();
	const input = document.querySelector("#todo-input");
	const text = input.value.trim();

	if (text !== "") {
		addNewToDo(text);
		input.value = "";
		input.focus();
	}
	complHeadHide();
	hideClearBtn();
	hideClearAllBtn();
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

clearDoneBtn.addEventListener("click", () => clearDone());
clearOpenBtn.addEventListener("click", () => clearOpen());
clearAllBtn.addEventListener("click", () => {
	clearDone();
	clearOpen();
});

// Conditional Rendering der H2 der "Completed-Liste"

document.addEventListener("click", () => {
	complHeadHide();
	hideClearBtn();
	hideClearAllBtn();
});