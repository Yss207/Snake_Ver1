const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;

let score = 0;
const snakeBody = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let velocityX = 0;
let velocityY = 0;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const eatSound = new Audio("music/food.mp3");
const moveSound = new Audio("music/move.mp3");
const gameOverSound = new Audio("music/gameover.mp3");

function drawGame() {
//   if (velocityX === 0 && velocityY === 0) {
//     drawStartMessage(); // Display the start message
//     requestAnimationFrame(drawGame); // Continue checking for arrow key press
//     return;
//   }

  changeSnakePosition();

  let result = gameOver();
  if (result) {
    return;
  }

  clearScreen();
  checkAppleCollision();

  drawApple();
  drawSnake();

  drawScore();

  if (velocityX === 0 && velocityY === 0) {
    drawStartMessage();
  }

  if (score > 5) {
    speed = 11;
  }
  if (score > 10) {
    speed = 15;
  }

  setTimeout(drawGame, 1000 / speed);
}

function drawStartMessage() {
//   clearScreen(); // Clear the screen to make the message stand out
  ctx.fillStyle = "white";
  ctx.font = "20px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillText(
    "Press any arrow key to start the game",
    canvas.width / 2,
    canvas.height - 20
  );
}

function gameOver() {
  let gameO = false;

  if (velocityX === 0 && velocityY === 0) {
    return false;
  }

  if (headX < 0 || headY < 0 || headX == tileCount || headY == tileCount) {
    gameO = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    let part = snakeBody[i];
    if (part.x === headX && part.y === headY) {
      gameO = true;
      break;
    }
  }

  if (gameO) {
    gameOverSound.play();
    ctx.fillStyle = "white";
    ctx.textAlign = "center"; // Align text to the center
    ctx.font = "50px Comic Sans MS";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Comic Sans MS";
    ctx.fillText("Press F5 to Play Again!", canvas.width / 2, canvas.height / 2+40);
  }

  return gameO;
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  // Draw the snake body
  for (let i = 0; i < snakeBody.length; i++) {
    let part = snakeBody[i];
    let patternCanvas = document.createElement("canvas");
    patternCanvas.width = tileSize;
    patternCanvas.height = tileSize;
    let patternCtx = patternCanvas.getContext("2d");

    // Create polka dot pattern
    patternCtx.fillStyle = "green";
    patternCtx.fillRect(0, 0, tileSize, tileSize);

    patternCtx.fillStyle = "lightgreen";
    patternCtx.beginPath();
    patternCtx.arc(tileSize / 4, tileSize / 4, tileSize / 6, 0, Math.PI * 2);
    patternCtx.fill();

    patternCtx.beginPath();
    patternCtx.arc(
      (3 * tileSize) / 4,
      (3 * tileSize) / 4,
      tileSize / 6,
      0,
      Math.PI * 2
    );
    patternCtx.fill();

    let pattern = ctx.createPattern(patternCanvas, "repeat");
    ctx.fillStyle = pattern;

    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  // Draw the snake head
  ctx.fillStyle = "orange";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "yellow";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
  ctx.shadowBlur = 0;

  // Add the new head position to the body
  snakeBody.push(new SnakePart(headX, headY));
  while (snakeBody.length > tailLength) {
    snakeBody.shift(); // Remove the oldest part of the snake
  }
}
function changeSnakePosition() {
  headX += velocityX;
  headY += velocityY;

  //Below in case if condition of crossing borders is allowed.

  // // Wrap around the canvas
  // if (headX < 0) {
  //   headX = tileCount - 1; // Wrap to the right side
  // } else if (headX >= tileCount) {
  //   headX = 0; // Wrap to the left side
  // }

  // if (headY < 0) {
  //   headY = tileCount - 1; // Wrap to the bottom
  // } else if (headY >= tileCount) {
  //   headY = 0; // Wrap to the top
  // }
}

function drawApple() {
  let appleGradient = ctx.createRadialGradient(
    appleX * tileCount + tileSize / 2,
    appleY * tileCount + tileSize / 2,
    5,
    appleX * tileCount + tileSize / 2,
    appleY * tileCount + tileSize / 2,
    tileSize / 2
  );

  appleGradient.addColorStop(0, "red");
  appleGradient.addColorStop(1, "darkred");

  // Draw the apple as a circle
  ctx.fillStyle = appleGradient;
  ctx.beginPath();
  ctx.arc(
    appleX * tileCount + tileSize / 2, // X coordinate of the circle's center
    appleY * tileCount + tileSize / 2, // Y coordinate of the circle's center
    tileSize / 2, // Radius of the circle
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Draw a small white highlight on the apple
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(
    appleX * tileCount + tileSize / 3, // Slightly offset X for the highlight
    appleY * tileCount + tileSize / 3, // Slightly offset Y for the highlight
    tileSize / 6, // Radius of the highlight
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function checkAppleCollision() {
  if (headX === appleX && headY === appleY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    eatSound.play();
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "17px Comic Sans MS";
  ctx.fillText("Score: " + score, canvas.width - 100, 20);
}

document.body.addEventListener("keydown", changeDirection);

// Prevent default behavior for touch events (e.g., scroll, refresh)
document.body.addEventListener("touchstart", (e) => {
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: false });

document.body.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault(); // Prevent default scrolling during swipe
  },
  { passive: false }
);

document.body.addEventListener("touchend", (e) => {
  e.preventDefault();
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe(); // Determine swipe direction
});

function changeDirection(e) {

  moveSound.play();

  if (e.code === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Determine swipe direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && velocityX !== -1) {
      // Swipe right
      velocityX = 1;
      velocityY = 0;
    } else if (deltaX < 0 && velocityX !== 1) {
      // Swipe left
      velocityX = -1;
      velocityY = 0;
    }
  } else {
    if (deltaY > 0 && velocityY !== -1) {
      // Swipe down
      velocityX = 0;
      velocityY = 1;
    } else if (deltaY < 0 && velocityY !== 1) {
      // Swipe up
      velocityX = 0;
      velocityY = -1;
    }
  }
}

drawGame();
