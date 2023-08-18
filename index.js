// Offene ToDos: 
//Check-Boxen => bei Done CSS Class für Done + in 2. UL verschieben
//CSS/Design
//Animationen und anderer Stuff der mir noch spontan so einfällt

// HTML-Elemente in JS-Variablen verpacken

const form = document.querySelector("#todo-form");
const ulToDo = document.querySelector("#todo-ul");
const ulComplete = document.querySelector("#complete-ul")

// To-Do Liste selbst

let toDos = [
	{ name: "Godzilla waschen", completed: false, id: 111 },
	{ name: "Saufen", completed: false, id: 222 },
	{ name: "Shoppen gehen", completed: false, id: 333 },
];
localStorage.setItem("ToDos", JSON.stringify(toDos))
const localToDos = JSON.parse(localStorage.getItem("ToDos"))
localToDos.forEach(item => renderList(item)) // First render

// Liste rendern

function renderList(todo) {
	const completed = todo.completed ? "y" : "n";
	const li = document.createElement("li");
	li.setAttribute("class", `completed-${completed}`);
	li.setAttribute("id", todo.id);
	li.innerHTML = `<input type="checkbox" id="${todo.id}">
    <label for="${todo.id}"><p>${todo.name}</p></label>
    <button class="delete-todo">Delete</button>`;

    ulToDo.append(li) // if/else für completed/non completed-aufteilung
}

// Delete + Done

function deleteToDo(id) {
    toDos = toDos.filter(item => item.id !== Number(id))
    localStorage.clear()
    localStorage.setItem("ToDos", JSON.stringify(toDos))
    const li = document.getElementById(id)
    ulToDo.removeChild(li)
}
function toggleDone(id) {
    toDos
}

// Todos hinzufügen

function addNewToDo(name) {
	const newToDo = {
		name: name,
		completed: false,
		id: Date.now(),
	};
	toDos.push(newToDo);
    localStorage.setItem("ToDos", JSON.stringify(toDos))
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
	console.log(toDos);
});

// Delete-Button

ulToDo.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-todo")){
        const parent = event.target.parentElement;
        const id = parent.getAttribute("id")
        deleteToDo(id)
    }
})