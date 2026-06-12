let canvas;
let gameWorld;

window.onload = () => {
    "use strict";

    canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 520;

    gameWorld = new Game(canvas);
    window.gameWorld = gameWorld;
    window.requestAnimationFrame((timeStamp) => gameWorld.gameLoop(timeStamp));
};

const BACKGROUND_COLOR = "#0f172a";
const FLOOR_COLOR = "#1e293b";
const CATCHER_WIDTH = 110;
const CATCHER_HEIGHT = 28;
const START_LIVES = 3;
const FALL_SPEED = 180;
const OBSTACLE_SPEED = 220;

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.ui = new GameUI(canvas);

        this.score = 0;
        this.lives = START_LIVES;
        this.run = false;
        this.gameOver = false;
        this.oldTimeStamp = 0;
        this.spawnTimer = 0;
        this.spawnTime = 1.1;

        this.fallingObjects = [];
        this.obstacles = [];
        this.star = [];

        this.createActors();
        this.listenForPlayerInput();
        this.draw();
        this.showStart();
    }

    createActors() {
        this.catcher = new Catcher(
            this.context,
            this.width / 2 - CATCHER_WIDTH / 2,
            this.height - 64,
            CATCHER_WIDTH,
            CATCHER_HEIGHT
        );
    }

    listenForPlayerInput() {
        window.addEventListener("keydown", (event) => {
            if (event.code === "ArrowLeft") {
                this.catcher.moveLeft = true;
            } else if (event.code === "ArrowRight") {
                this.catcher.moveRight = true;
            }
        });

        window.addEventListener("keyup", (event) => {
            if (event.code === "ArrowLeft") {
                this.catcher.moveLeft = false;
            } else if (event.code === "ArrowRight") {
                this.catcher.moveRight = false;
            }
        });

        this.canvas.addEventListener("mousemove", (event) => {
            if (!this.run || this.gameOver) {
                return;
            }

            this.catcher.moveToCenter(this.canvasX(event.clientX), this.width);
        });

        this.canvas.addEventListener("touchmove", (event) => {
            if (!this.run || this.gameOver) {
                return;
            }

            let touch = event.targetTouches[0];
            this.catcher.moveToCenter(this.canvasX(touch.clientX), this.width);
        });
    }

    gameLoop(timeStamp) {
        let secondsPassed = (timeStamp - this.oldTimeStamp) / 1000 || 0;
        secondsPassed = Math.min(secondsPassed, 0.05);
        this.oldTimeStamp = timeStamp;

        if (this.run) {
            this.update(secondsPassed);
        }

        this.draw();
        window.requestAnimationFrame((nextTimeStamp) => this.gameLoop(nextTimeStamp));
    }

    update(secondsPassed) {
        this.catcher.update(secondsPassed, this.width);

        // TODO: Spawn falling objects and obstacles.
        // Hint: call this.spawnItems(secondsPassed).
        this.spawnItems(secondsPassed);

        // TODO: Update falling objects and obstacles.
        // Hint: loop over this.fallingObjects and this.obstacles.

        for (let fallingObject of this.fallingObjects) {
            fallingObject.update(secondsPassed);
        }

        for (let obstacle of this.obstacles) {
            obstacle.update(secondsPassed);
        }

        for (let star of this.star) {
            star.update(secondsPassed);
        }

        this.fallingObjects = this.fallingObjects.filter((fallingObject) => {
            if (this.detectCollision(this.catcher, fallingObject)) {
                this.score++;
                return false;
            }
            return true;
        });

        this.star = this.star.filter((star) => {
            if (this.detectCollision(this.catcher, star)) {
                this.score += 5;
                return false;
            }
            return true;
        });

        // TODO: Check if catcher touches an obstacle.
        // If yes, lose a life and remove that obstacle.
        this.obstacles = this.obstacles.filter((obstacle) => {
            if (this.detectCollision(this.catcher, obstacle)) {
                this.lives--;
                if (this.lives <= 0) {
                    this.showGameOver();
                }
                return false;
            }
            return true;
        });

        // TODO: Remove items that leave the screen.
        // If a falling object reaches the bottom, lose a life.
        // Hint: use the isOffScreen method of the objects.
        this.fallingObjects = this.fallingObjects.filter((fallingObject) => {
            if (fallingObject.isOffScreen(this.height)) {
                this.lives--;
                if (this.lives <= 0) {
                    this.showGameOver();
                }
                return false;
            }
            return true;
        });

        this.star = this.star.filter((star) => {
            if (star.isOffScreen(this.height)) {
                return false;
            }
            return true;
        });

        this.obstacles = this.obstacles.filter((obstacle) => {
            if (obstacle.isOffScreen(this.height)) {
                return false;
            }
            return true;
        });

        // TODO: If lives is 0, set gameOver and show restart UI.
    }

    spawnItems(secondsPassed) {
        this.spawnTimer += secondsPassed;

        if (this.spawnTimer < this.spawnTime) {
            return;
        }

        this.spawnTimer = 0;

        // TODO: Randomly create either a FallingObject or an Obstacle.
        // Helpful values:
        // let x = Math.random() * (this.width - 40);
        let shouldSpawnObstacle = Math.random() < 0.3;

        let cols = 19;
        let colWidth = this.width / cols;
        let randomCol = Math.floor(Math.random() * cols);
        let xFallingObj = randomCol * colWidth + (colWidth - 32) / 2;
        let xObstacleObj = randomCol * colWidth + (colWidth - 44) / 2;

        //test
        //let x = 18 * colWidth + (colWidth - 32) / 2;
        //let x = 0 * colWidth + (colWidth - 32) / 2;

        if (shouldSpawnObstacle) {
            // Obstacle example:
            this.obstacles.push(new Obstacle(this.context, xObstacleObj, -36, 44, 28, OBSTACLE_SPEED));
        } else {
            // Falling object example:
            let shouldSpawnStar = Math.random() < 0.5;
            if (shouldSpawnStar) {
                this.star.push(new Star(this.context, xFallingObj, -32, 32, FALL_SPEED));
            } else {
                this.fallingObjects.push(new FallingObject(this.context, xFallingObj, -32, 32, FALL_SPEED));
            }
        }
    }

    start() {
        this.run = true;
        this.gameOver = false;
        this.oldTimeStamp = performance.now();
        this.ui.hideMessage();
    }

    restart() {
        this.score = 0;
        this.lives = START_LIVES;
        this.run = true;
        this.gameOver = false;
        this.spawnTimer = 0;
        this.fallingObjects = [];
        this.obstacles = [];
        this.star = [];
        this.createActors();
        this.oldTimeStamp = performance.now();
        this.ui.hideMessage();
    }

    showStart() {
        this.ui.showMessage("Catch Objects", "Start", () => this.start());
    }

    showGameOver() {
        this.run = false;
        this.gameOver = true;
        this.ui.showMessage("Game Over", "Restart", () => this.restart());
    }

    draw() {
        this.clear();
        this.drawBackground();
        this.fallingObjects.forEach((fallingObject) => fallingObject.draw());
        this.obstacles.forEach((obstacle) => obstacle.draw());
        this.star.forEach((star) => star.draw());
        this.catcher.draw();
        this.ui.updateGameInfo(this.score, this.lives);
    }

    drawBackground() {
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = "rgba(125, 211, 252, 0.08)";
        for (let x = 0; x < this.width; x += 42) {
            this.context.fillRect(x, 0, 1, this.height);
        }

        this.context.fillStyle = FLOOR_COLOR;
        this.context.fillRect(0, this.height - 36, this.width, 36);
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    canvasX(clientX) {
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / rect.width;
        return (clientX - rect.left) * scaleX;
    }

    detectCollision(obj1, obj2) {
        if (obj2.x > obj1.x + obj1.width || obj1.x > obj2.x + obj2.width || obj2.y > obj1.y + obj1.height || obj1.y > obj2.y + obj2.height) {
            return false;
        }
        return true;
    }
}
