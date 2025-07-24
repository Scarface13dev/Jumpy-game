const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let dog = { x: 50, y: 300, width: 50, height: 50, dy: 0, jumping: false, shield: false };
let gravity = 1.5;
let cars = [];
let items = [];
let score = 0;
let gameOver = false;

function playSound() {
  document.getElementById('jumpSound').play();
}

function spawnCar() {
  cars.push({ x: canvas.width, y: 340, width: 60, height: 40 });
}

function spawnItem() {
  const types = ['bone', 'shield', 'supersaut'];
  const type = types[Math.floor(Math.random() * types.length)];
  items.push({ x: canvas.width, y: Math.random() * 250 + 50, width: 30, height: 30, type });
}

function restartGame() {
  dog.y = 300;
  dog.dy = 0;
  dog.jumping = false;
  dog.shield = false;
  cars = [];
  items = [];
  score = 0;
  gameOver = false;
  loop();
}

function drawDog() {
  ctx.fillStyle = '#f90';
  ctx.fillRect(dog.x, dog.y, dog.width, dog.height);
}

function drawCars() {
  ctx.fillStyle = '#d32f2f';
  cars.forEach(car => {
    ctx.fillRect(car.x, car.y, car.width, car.height);
  });
}

function drawItems() {
  items.forEach(item => {
    ctx.fillStyle = item.type === 'bone' ? '#8bc34a' : item.type === 'shield' ? '#2196f3' : '#ffeb3b';
    ctx.fillRect(item.x, item.y, item.width, item.height);
  });
}

function update() {
  dog.dy += gravity;
  dog.y += dog.dy;

  if (dog.y > 300) {
    dog.y = 300;
    dog.dy = 0;
    dog.jumping = false;
  }

  cars.forEach(car => {
    car.x -= 6;
  });
  cars = cars.filter(car => car.x + car.width > 0);

  items.forEach(item => {
    item.x -= 4;
  });
  items = items.filter(item => item.x + item.width > 0);

  cars.forEach(car => {
    if (checkCollision(dog, car)) {
      if (dog.shield) {
        dog.shield = false;
        car.x = -100;
      } else {
        gameOver = true;
      }
    }
  });

  items.forEach((item, i) => {
    if (checkCollision(dog, item)) {
      if (item.type === 'bone') score++;
      if (item.type === 'shield') dog.shield = true;
      if (item.type === 'supersaut') gravity = 1.0;
      items.splice(i, 1);
    }
  });

  document.getElementById('score').innerText = "Score: " + score;
}

function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function loop() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 320, 200);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDog();
  drawCars();
  drawItems();
  update();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !dog.jumping) {
    dog.dy = -20;
    dog.jumping = true;
    gravity = 1.5;
    playSound();
  }
});

setInterval(spawnCar, 2000);
setInterval(spawnItem, 5000);

loop();
