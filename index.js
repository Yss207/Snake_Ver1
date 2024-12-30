const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

//tiles stuff

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

//snake head
let headX = 10;
let headY = 10;

let score = 0;

//snake body

const snakeBody = [];
let tailLength = 2;

//snake food

let appleX = 5;
let appleY = 5;

let velocityX = 0;
let velocityY = 0;

//game loop
function drawGame() {
  changeSnakePosition();

  let result = gameOver();
  if(result){
    return;
  }

  clearScreen();
  checkAppleCollision();

  drawApple();
  drawSnake();

  drawScore();

  if(score > 5){
    speed = 11;
  }
  if(score > 10){
    speed = 15;
  }
  
  setTimeout(drawGame, 1000 / speed);
}

function gameOver(){
    let gameO = false;

    if(velocityX == 0 && velocityY == 0 ){
        return false;
    }

    if(headX < 0 || headY < 0 || headX == tileCount || headY == tileCount ){
        gameO = true;
    }

    for(let i = 0; i<snakeBody.length; i++){
        let part = snakeBody[i];
        if(part.x == headX && part.y == headY){
            gameO = true;
            break;
        }
    }

    //PLEASE ADD GAME OVER TEXT HERE USING PROPER WHATEVER YOU WANT

    return gameO;
}

function clearScreen() {
  ctx.fillStyle = "black"; //customizable
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeBody.length; i++) {
    let part = snakeBody[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeBody.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
  while (snakeBody.length > tailLength) {
    snakeBody.shift(); // remove the furthest item from the snake parts if have more than our tail size.
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX += velocityX;
  headY += velocityY;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (headX == appleX && headY == appleY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
  }
}

function drawScore(){
    ctx.fillStyle = 'white';
    ctx.font = '15px Comic Sans';
    ctx.fillText("Score: "+score, canvas.width - 50, 10);
}
//to start the keyboard stuff
document.body.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.code == "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code == "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code == "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code == "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

drawGame();
