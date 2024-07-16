const board = document.getElementById("game-board");
const instrText = document.getElementById("instruction-text");
const instrText2 = document.getElementById("instruction-text2");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
let snake = [{ x: 10, y: 10, }];
let isGameStart = false;
let gameSpeed = 200;
let gridSize = 20;
let food = generateFood();
let food2 = generateFood2();
let eatenFoodCount = 0;
let direction = "left";
let highScore = 0;
let gameIntervalId;
let food2Eaten = false;


let music = new Audio("Jungle.mp3");
let music2 = new Audio("Eating.mp3");


function draw() {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    if (eatenFoodCount % 5 === 0 && eatenFoodCount >= 5) {
        drawFood2();
    }
    updateScore();
    music.play();
}


function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement)
    });
}


function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}


function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


function drawFood() {
    if (isGameStart) {
        let foodElement = createElement("div", "food");
        foodElement.textContent = "🍄";
        setPosition(foodElement, food);
        board.appendChild(foodElement)
    }
}
function drawFood2() {
    if (isGameStart && food2) {
        let food2Element = createElement("div", "food2");
        food2Element.textContent = "🥦";
        setPosition(food2Element, food2);
        board.appendChild(food2Element)
    }
}
function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}


function generateFood2() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize) + 1;
        y = Math.floor(Math.random() * gridSize) + 1;
    } while (x === food.x && y === food.y);
    return { x, y };
}


function move() {
    let head = { ...snake[0] }

    switch (direction) {
        case "up":
            head.y--
            break;
        case "down":
            head.y++
            break;
        case "left":
            head.x--
            break;
        case "right":
            head.x++
            break;
    }
    snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            food = generateFood();
            eatenFoodCount++;
            if (eatenFoodCount % 10 === 0) {
                increaseGameSpeed();
            }
            if (eatenFoodCount >= 5 && eatenFoodCount % 5 === 0) {
                food2 = generateFood2();
            }
            music2.play();
        } else if (head.x === food2.x && head.y === food2.y) {
            eatenFoodCount++;
            decreaseGameSpeed();
            food2Eaten = true;
            music2.play();
        } else {
            snake.pop();
        }
        if (food2Eaten) {
            decreaseGameSpeed();
            food2Eaten = false;
        }

    }

    document.addEventListener("keydown", handKeyPress);


    function handKeyPress(event) {
        if ((!isGameStart && event.code === "Space") ||
            (!isGameStart && event.key === " ")) {
            startGame();
        } else {
            switch (event.key) {
                case "ArrowUp":
                    direction = "up"
                    break;
                case "ArrowDown":
                    direction = "down"
                    break;
                case "ArrowLeft":
                    direction = "left"
                    break;
                case "ArrowRight":
                    direction = "right"
                    break;
            }
        }
    }


    function startGame() {
        isGameStart = true;
        logo.style.display = "none";
        instrText.style.display = "none"
        instrText2.style.display = "none"

        {
            gameIntervalId = setInterval(() => {
                move();
                checkCollision();
                draw();
            }, gameSpeed);
        }
    }

    function increaseGameSpeed() {
        gameSpeed *= 0.7;
        clearInterval(gameIntervalId);
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeed);
    }

    function decreaseGameSpeed() {
        gameSpeed *= 1.1;
        clearInterval(gameIntervalId);
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeed);
    }
    function checkCollision() {
        let head = { ...snake[0] };

        if (head.x > gridSize || head.x < 1 || head.y > gridSize || head.y < 1) {
            resetGame();
        }
        
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                resetGame();
                break;
            }
        }
    }


    function resetGame() {
        updateHighScore();
        stopGame();
        snake = [{ x: 10, y: 10 }];
        food = generateFood();
        direction = "right";
        gameSpeed = 200;
        eatenFoodCount = 0;
        updateScore();
    }


    function stopGame() {
        clearInterval(gameIntervalId);
        isGameStart = false;
        logo.style.display = "block";
        instrText2.style.display = "block";
    }

    function updateScore() {
        const currentScore = snake.length - 1;
        score.textContent = currentScore.toString().padStart(3, "0");
    }


    function updateHighScore() {
        const currentScore = snake.length - 1;
        if (currentScore > highScore) {
            highScore = currentScore;
        }
        highScoreText.textContent = highScore.toString().padStart(3, "0");
        highScoreText.style.display = "block";
    }