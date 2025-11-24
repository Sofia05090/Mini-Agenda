import './style.css';

const app = document.getElementById("app");

app.innerHTML = `
  <div class="container">
    <h1>Mini Agenda de Hábitos</h1>
    <div class="add-habit">
      <input type="text" id="habitInput" placeholder="Nuevo hábito">
      <button id="addHabitBtn">Agregar</button>
    </div>
    <ul id="habitList"></ul>
    <div class="summary">
      <p>Progreso semanal: <span id="progressPercent">0%</span></p>
      <div class="progress-bar">
        <div id="progressBarFill"></div>
      </div>
      <button id="clearBtn">Limpiar todo</button>
    </div>
  </div>
`;

// Ahora sí puedes seleccionar los elementos
const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");
const clearBtn = document.getElementById("clearBtn");
const progressPercent = document.getElementById("progressPercent");
const progressBarFill = document.getElementById("progressBarFill");

// Colores para cada hábito
const habitColors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#FF6FF3"];

let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Función para renderizar hábitos
function renderHabits() {
    habitList.innerHTML = "";
    habits.forEach((habit, index) => {
        const li = document.createElement("li");
        li.style.backgroundColor = habit.color;
        li.className = habit.completed ? "completed" : "";
        li.innerHTML = `
            ${habit.name}
            <button class="check-btn">${habit.completed ? "✔" : "✖"}</button>
        `;
        // Cambiar estado al hacer click
        li.querySelector(".check-btn").addEventListener("click", () => {
            habits[index].completed = !habits[index].completed;
            saveHabits();
            renderHabits();
        });
        habitList.appendChild(li);
    });
    updateProgress();
}

// Guardar en localStorage
function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

// Agregar hábito
addHabitBtn.addEventListener("click", () => {
    const name = habitInput.value.trim();
    if(name) {
        const color = habitColors[habits.length % habitColors.length];
        habits.push({ name, completed: false, color });
        habitInput.value = "";
        saveHabits();
        renderHabits();
    }
});

// Limpiar todo
clearBtn.addEventListener("click", () => {
    habits = [];
    saveHabits();
    renderHabits();
});

// Actualizar progreso
function updateProgress() {
    if(habits.length === 0) {
        progressPercent.innerText = "0%";
        progressBarFill.style.width = "0%";
        return;
    }
    const completedCount = habits.filter(h => h.completed).length;
    const percent = Math.round((completedCount / habits.length) * 100);
    progressPercent.innerText = `${percent}%`;
    progressBarFill.style.width = percent + "%";
}

// Inicializar
renderHabits();
