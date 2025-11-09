const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');
const scoreElement = document.getElementById('score');
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');

let box = 20;
let game;
let direction;
let snake;
let food;
let score;
let speed = 3; // valor inicial (de 1 a 5)

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  food = randomFood();
  score = 0;
  scoreElement.textContent = score;

  if (game) clearInterval(game);
  startGameLoop();
}

function startGameLoop() {
  // Velocidad inversamente proporcional (más valor = más rápido)
  const interval = 300 - speed * 40; 
  game = setInterval(draw, interval);
}

function resizeCanvas() {
  const size = Math.min(window.innerWidth * 0.9, 400);
  canvas.width = size;
  canvas.height = size;
  box = size / 20;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

restartBtn.addEventListener('click', initGame);

// 🎚 Control de velocidad dinámico
speedRange.addEventListener('input', () => {
  speed = parseInt(speedRange.value);
  speedValue.textContent = speed;
  clearInterval(game);
  startGameLoop();
});

function randomFood() {
  const totalBoxes = canvas.width / box;
  return {
    x: Math.floor(Math.random() * (totalBoxes - 1)) * box,
    y: Math.floor(Math.random() * (totalBoxes - 1)) * box
  };
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#4caf50' : '#8bc34a';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = '#111';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
}

function drawFood() {
  ctx.fillStyle = '#f44336';
  ctx.fillRect(food.x, food.y, box, box);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSnake();
  drawFood();

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  if (direction === 'UP') headY -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'DOWN') headY += box;

  if (headX === food.x && headY === food.y) {
    score++;
    scoreElement.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    snake.some(segment => segment.x === headX && segment.y === headY)
  ) {
    clearInterval(game);
    alert('💀 Juego terminado. Puntaje: ' + score);
  }

  snake.unshift(newHead);
}

// 🚫 Evitar que las flechas modifiquen el control de velocidad durante el juego
speedRange.addEventListener('keydown', (event) => {
  const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  if (arrowKeys.includes(event.key)) {
    event.preventDefault();
  }
});


initGame();
