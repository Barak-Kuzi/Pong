const gameBoard = document.querySelector("#gameBoard");
const contextGame = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

const widthGame = gameBoard.width;
const heightGame = gameBoard.height;
const unitSize = 25;
const ballRadius = 12.5;
const playersSpeed = 50;
const boardBackground = "green";
const ballColor = "yellow";
const playerColor1 = "blue";
const playerColor2 = "red";
const playerBorderColor = "black";
const ballBorderColor = "black";
let yVelocity = playersSpeed;
let intervalID;
let playerScore1 = 0;
let playerScore2 = 0;
let ballX;
let ballY;
let ballXDirection;
let ballYDirection;
let ballSpeed;
let player1 = {
    x: 0,
    y: 0,
    width: 25,
    height: 100
}
let player2 = {
    x: widthGame - unitSize,
    y: heightGame - 100,
    width: 25,
    height: 100
}

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", restartGame);
startGame();

// Clears the canvas and paints the game board with the specified background color.
function paintingBoard(){
    contextGame.fillStyle = boardBackground;
    contextGame.fillRect(0, 0, widthGame, heightGame);
}

// Draws the ball on the canvas at the specified coordinates (ballX, ballY) with the specified radius,
// fill color, and border color.
function drawBall(ballX, ballY){
    contextGame.fillStyle = ballColor;
    contextGame.strokeStyle = ballBorderColor;
    contextGame.lineWidth = 2;
    contextGame.beginPath();
    contextGame.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    contextGame.stroke();
    contextGame.fill();
}

// Draws both players on the canvas with their respective colors, borders, and positions.
function drawPlayers(){
    contextGame.strokeStyle = playerBorderColor;
    contextGame.fillStyle = playerColor1;
    contextGame.fillRect(player1.x, player1.y, player1.width, player1.height);
    contextGame.strokeRect(player1.x, player1.y, player1.width, player1.height);
    contextGame.fillStyle = playerColor2;
    contextGame.fillRect(player2.x, player2.y, player2.width, player2.height);
    contextGame.strokeRect(player2.x, player2.y, player2.width, player2.height);
}

// Handles player movement based on keyboard input. It changes the Y-coordinate of the players' position when specific
// keys are pressed. If the player has arrived at the border of the game board, then pressing the button does nothing.
function changeDirection(event){
    let keyPressed = event.keyCode;
    const player1_UP = 87;  // W
    const player1_DOWN = 83;    // S
    const player2_UP = 38;  // Arrow key Up
    const player2_DOWN = 40;    // Arrow key Down
    switch(keyPressed){
        case(player1_UP):
            if(player1.y > 0){
                player1.y -= yVelocity;
            }
            break;
        case(player1_DOWN):
            if(player1.y < heightGame - player1.height){
                player1.y += yVelocity;
            }
            break;
        case(player2_UP):
            if(player2.y > 0){
                player2.y -= yVelocity;
            }
            break;
        case(player2_DOWN):
            if(player2.y < heightGame - player2.height){
                player2.y += yVelocity;
            }
            break;
    }
}

// Initiates the game loop. It clears the canvas, draws the game elements, moves the ball, checks for collisions,
// and schedules the next frame using setTimeout.
function nextTick(){
    intervalID = setTimeout(() => {
        paintingBoard();
        drawPlayers();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
    }, 10);
}

// Initializes the ball's position, direction, and speed. Randomly sets the initial direction of the ball
// (left/right and up/down) and places it at the center of the canvas.
function createBall(){
    ballSpeed = 1;
    if(Math.round(Math.random() * ballSpeed) === 1){
        ballXDirection = 1;
    }
    else{
        ballXDirection = -1;
    }
    if(Math.round(Math.random() * ballSpeed) === 1){
        ballYDirection = 1;
    }
    else{
        ballYDirection = -1;
    }
    ballX = widthGame / 2;
    ballY = heightGame / 2;
    drawBall(ballX, ballY);
}

// Updates the ball's position based on its current direction and speed.
function moveBall(){
    ballX += (ballXDirection * ballSpeed);
    ballY += (ballYDirection * ballSpeed);
}

// Initializes the game by creating the ball and starting the game loop.
function startGame(){
    createBall();
    nextTick();
}

// Resets player scores, positions, and ball properties to their initial values.
// It then updates the displayed score and restarts the game.
function restartGame(){
    playerScore1 = 0;
    playerScore2 = 0;
    player1 = {
        x: 0,
        y: 0,
        width: 25,
        height: 100
    }
    player2 = {
        x: widthGame - unitSize,
        y: heightGame - 100,
        width: 25,
        height: 100
    }
    ballSpeed = 0;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    startGame();
}

// Updates the text content of the score display element with the current scores of the players.
function updateScore(){
    scoreText.textContent = `${playerScore1} : ${playerScore2}`;
}

// Checks for collisions between the ball and the game borders or players. If a collision occurs, it updates the ball's
// direction and speed accordingly. Also handles scoring when the ball crosses the left or right boundaries.
//
function checkCollision(){
    if(ballY <= (0 + ballRadius)){      // collision with the top border
        ballYDirection *= -1;
    }
    if(ballY >= (heightGame - ballRadius)){     // collision with the bottom border
        ballYDirection *= -1;
    }
    if(ballX <= 0){     // If the ball crossed the left boundary
        playerScore2 += 1;
        updateScore();
        createBall();
        return;
    }
    if(ballX >= widthGame){     // If the ball crossed the right boundary
        playerScore1 += 1;
        updateScore();
        createBall();
        return;
    }
    if(ballX <= (player1.x + player1.width + ballRadius)){      // If the ball collides with a player's paddle
        if(player1.y < ballY && ballY < player1.y + player1.height){
            ballX = (player1.x + player1.width) + ballRadius;       // If the ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
    if(ballX >= (player2.x - ballRadius)) {     // If the ball collides with a player's paddle
        if (player2.y < ballY && ballY < player2.y + player2.height){
            ballX = player2.x - ballRadius;     // If the ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
}
