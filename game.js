const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 100,
  y: 300,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 0.5,
  jumpForce: -10,
  isJumping: false
};

let obstacles = [];
let score = 0;
let gameOver = false;

// ========== GESTION DU SAUT ==========
function jump() {
  if (!player.isJumping && !gameOver) {
    player.velocityY = player.jumpForce;
    player.isJumping = true;

    // Joue le son
    const jumpSound = document.getElementById('jumpSound');
    if (jumpSound) {
      jumpSound.currentTime = 0;
      jumpSound.play().catch(() => {});
    }
  }
}

// ========== REDEMARRER LE JEU ==========
function restartGame() {
  player.y = 300;
  player.velocityY = 0;
  player.isJumping = false;
  obstacles = [];
  score = 0;
  gameOver = false;
  document.getElementById('score').innerText = "Score: 0";
  updateGame();
}

// ========== AJOUT D'OBSTACLES ==========
function spawnObstacle() {
  const width = 40 + Math.random() * 30;
  const height = 50;
  const x = canvas.width;
  const y = 350;

  obstacles.push({
    x,
    y,
    width,
    height,
    speed: 5
  });
}

// ========== DETECTION DE COLLISION ==========
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ========== DESSIN ==========
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Joueur
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Obstacles
  ctx.fillStyle = 'red';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  // Sol
  ctx.fillStyle = 'green';
  ctx.fillRect(0, 350 + player.height, canvas.width, 50);
}

// ========== MISE À JOUR ==========
function updateGame() {
  if (gameOver) return;

  // Gravité
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  // Sol
  if (player.y >= 300) {
    player.y = 300;
    player.velocityY = 0;
    player.isJumping = false;
  }

  // Obstacles
  obstacles.forEach(obstacle => {
    obstacle.x -= obstacle.speed;
  });

  // Supprime les obstacles hors écran
  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

  // Collision
  for (const obstacle of obstacles) {
    if (checkCollision(player, obstacle)) {
      gameOver = true;
      alert("💥 Perdu ! Score : " + score);
      return;
    }
  }

  // Score
  score++;
  document.getElementById('score').innerText = "Score: " + score;

  draw();
  requestAnimationFrame(updateGame);
}

// ========== GÉNÉRATION D'OBSTACLES ==========
setInterval(() => {
  if (!gameOver) {
    spawnObstacle();
  }
}, 1500); // toutes les 1.5 secondes

// ========== CONTROLES CLAVIER ==========
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    jump();
  }
});
