import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Definir la estructura para las tareas
type Task = {
  title: string;
  description: string;
  status: string;
  creationDate: string;
  lastEditDate: string;
  dueDate: string;
  difficulty: string;
  next: Task | null;
};

// Definir una lista enlazada para almacenar las tareas
let taskList: Task | null = null;

// Función para limpiar la pantalla
function clearScreen(): void {
  console.clear();
}

function showMenu(): void {
  clearScreen();
  console.log("Menú:");
  console.log("(1) Ver mis tareas");
  console.log("(2) Buscar tarea");
  console.log("(3) Agregar tarea");
  console.log("(4) Editar tarea");
  console.log("(5) Salir");
  rl.question("Seleccione una opción: ", handleMenuChoice);
}

function handleMenuChoice(choice: string): void {
  const choiceLower = choice.toLowerCase();
  switch (choiceLower) {
    case '1':
      showTasks();
      break;
    case '2':
      searchTask();
      break;
    case '3':
      addTask();
      break;
    case '4':
      editTask();
      break;
    case '5':
      rl.question("¿Seguro que desea salir? (S/N): ", (answer) => {
        if (answer.toLowerCase() === 's') {
          rl.close();
        } else {
          showMenu();
        }
      });
      break;
    default:
      console.log("Opción no válida. Por favor, seleccione una opción válida.");
      showMenu();
  }
}

function showTasks(): void {
  clearScreen();
  if (!taskList) {
    console.log("No hay tareas para mostrar.");
  } else {
    console.log("\nTareas:");
    let currentTask: Task | null = taskList;
    let index = 1;
    while (currentTask) {
      console.log(`${index}. ${currentTask.title} - ${currentTask.status}`);
      currentTask = currentTask.next;
      index++;
    }
  }
  askToReturnToMenu();
}

function searchTask(): void {
  clearScreen();
  rl.question("Introduzca el título de la tarea a buscar: ", (title) => {
    let currentTask: Task | null = taskList;
    while (currentTask) {
      if (currentTask.title === title) {
        console.log("\nTarea encontrada:");
        console.log(`Título: ${currentTask.title}`);
        console.log(`Descripción: ${currentTask.description}`);
        console.log(`Estado: ${currentTask.status}`);
        console.log(`Fecha de creación: ${currentTask.creationDate}`);
        console.log(`Fecha de última edición: ${currentTask.lastEditDate}`);
        console.log(`Fecha de vencimiento: ${currentTask.dueDate}`);
        console.log(`Dificultad: ${currentTask.difficulty}`);
        break;
      }
      currentTask = currentTask.next;
    }
    if (!currentTask) {
      console.log("Tarea no encontrada.");
    }
    askToReturnToMenu();
  });
}

function addTask(): void {
  clearScreen();
  rl.question("Introduzca el título de la tarea: ", (title) => {
    rl.question("Introduzca la descripción de la tarea: ", (description) => {
      rl.question("Introduzca el estado de la tarea (Pendiente/En curso/Terminada/Cancelada): ", (status) => {
        status = normalizeOption(status);
        if (isValidStatus(status)) {
          rl.question("Introduzca la fecha de vencimiento (AAAA-MM-DD): ", (dueDate) => {
            if (isValidDate(dueDate)) {
              rl.question("Introduzca la dificultad de la tarea (Facil/Medio/Dificil): ", (difficulty) => {
                difficulty = normalizeOption(difficulty);
                if (isValidDifficulty(difficulty)) {
                  const currentDate = new Date().toLocaleDateString();
                  const task: Task = {
                    title,
                    description,
                    status,
                    creationDate: currentDate,
                    lastEditDate: currentDate,
                    dueDate,
                    difficulty,
                    next: taskList,
                  };
                  taskList = task;
                  console.log("\nTarea agregada correctamente.");
                } else {
                  console.log("Dificultad no válida. Debe ser 'Facil', 'Medio' o 'Dificil'.");
                }
                askToReturnToMenu();
              });
            } else {
              console.log("Fecha de vencimiento no válida. Debe estar en formato 'AAAA-MM-DD'.");
              askToReturnToMenu();
            }
          });
        } else {
          console.log("Estado no válido. Debe ser 'Pendiente', 'En curso', 'Terminada' o 'Cancelada'.");
          askToReturnToMenu();
        }
      });
    });
  });
}

function editTask(): void {
  clearScreen();
  rl.question("Introduzca el título de la tarea a editar: ", (title) => {
    let currentTask: Task | null = taskList;
    let found = false;
    while (currentTask) {
      if (normalizeOption(currentTask.title) === normalizeOption(title)) {
        rl.question("Introduzca el nuevo estado de la tarea (Pendiente/En curso/Terminada/Cancelada): ", (status) => {
          status = normalizeOption(status);
          if (isValidStatus(status)) {
            if (currentTask) {
              currentTask.status = status;
              currentTask.lastEditDate = new Date().toLocaleDateString();
              console.log("\nTarea editada correctamente.");
            }
          } else {
            console.log("Estado no válido. Debe ser 'Pendiente', 'En curso', 'Terminada' o 'Cancelada'.");
          }
          askToReturnToMenu();
        });
        found = true;
        break;
      }
      currentTask = currentTask.next;
    }
    if (!found) {
      console.log("Tarea no encontrada.");
      askToReturnToMenu();
    }
  });
}

function askToReturnToMenu(): void {
  rl.question("\n¿Desea volver al menú principal? (S/N): ", (answer) => {
    if (answer.toLowerCase() === 's') {
      showMenu();
    } else {
      rl.close();
    }
  });
}

// Funciones de validación

function isValidStatus(status: string): boolean {
  return ['pendiente', 'en curso', 'terminada', 'cancelada'].includes(status);
}

function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
}

function isValidDifficulty(difficulty: string): boolean {
  return ['facil', 'medio', 'dificil'].includes(difficulty);
}

function normalizeOption(option: string): string {
  return option.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Manejar el cierre del programa
rl.on('close', () => {
  console.log("\n¡Adiós!");
  process.exit(0);
});

showMenu();
