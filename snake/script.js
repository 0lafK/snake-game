const playboard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const headElement = document.querySelector(".head");
const timerElement = document.querySelector(".timer")

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let gameStarted = false;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const boardSize = 30; 

const gameDuration = 10000; 
let lastFoodTime = Date.now();

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * boardSize) + 1;
  foodY = Math.floor(Math.random() * boardSize) + 1;
  lastFoodTime = Date.now(); 
};
const updateTimer = () => {
    const remainingTime = Math.max(0, gameDuration - (Date.now() - lastFoodTime));
    const seconds = Math.floor(remainingTime / 1000) % 60;
    const minutes = Math.floor(remainingTime / 60000);
    const timerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    timerElement.innerText = timerText;
  };

const handleFoodTimer = () => {
    updateTimer();
    const remainingTime = Math.max(0, gameDuration - (Date.now() - lastFoodTime));
    if (remainingTime === 0) {
      gameOver = true;
      handleGameOver();
      timerElement.classList.add("game-over");
    } else {
      timerElement.classList.remove("game-over");
    }
  };

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over!");
  location.reload();

};

const handleBoundaryCrossing = () => {
  if (snakeX <= 0) {
    snakeX = boardSize;
  } else if (snakeX > boardSize) {
    snakeX = 1;
  } else if (snakeY <= 0) {
    snakeY = boardSize;
  } else if (snakeY > boardSize) {
    snakeY = 1;
  }
};

const changeDirection = e => {
    if(!gameStarted){
        gameStarted = true
        lastFoodTime = Date.now();
        setIntervalId= setInterval(initGame, 90);
    }
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const updateSnakePosition = () => {
  snakeX += velocityX;
  snakeY += velocityY;
  handleBoundaryCrossing();

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > boardSize || snakeY <= 0 || snakeY > boardSize) {
    gameOver = true;
  }
};

const initGame = () => {
    if(!gameStarted) return ;
  if (gameOver) return handleGameOver();

  let html = `<div class="food" style="grid-area:${foodY} / ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
    handleFoodTimer();
  }
  GamePlay();
  updateSnakePosition();

  for (let i = 0; i < snakeBody.length; i++) {
    const isHead = i === 0;
    const headClass = isHead && snakeBody.length > 1 ? "head glow" : "head";
    html += `<div class="${headClass}" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      gameOver = true;
    }
  }
  function GamePlay() {
    if(initGame){
      document.body.style.overflow = "hidden"
    }
  }
  playboard.innerHTML = html;
  handleFoodTimer();
};

updateFoodPosition();
document.addEventListener("keyup", changeDirection);