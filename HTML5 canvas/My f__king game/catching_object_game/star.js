let starImage = document.getElementById("starImage");

let numRows = 1;
let numCols = 13;

let frameWidth = starImage.width / numCols;
let frameHeight = starImage.height / numRows;

class Star extends GameObject {
    constructor(context, x, y, size, speed) {
        super(context, x, y, size, speed);

        this.currentFrame = 0;
        this.animationTimer = 0;
        this.frameDuration = 0.1; // 100ms
    }
    
    update(secondsPassed) {
        super.update(secondsPassed);

        // Animation
        this.animationTimer += secondsPassed;

        if (this.animationTimer >= this.frameDuration) {
            this.currentFrame++;
            this.animationTimer = 0;

            const maxFrame = numCols * numRows - 1;

            if (this.currentFrame > maxFrame) {
                this.currentFrame = 0;
            }
        }
    }

    draw() {
        const col = this.currentFrame % numCols;
        const row = Math.floor(this.currentFrame / numCols);

        this.context.drawImage(
            starImage,
            col * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    isOffScreen(boardHeight) {
        if (this.y > boardHeight - this.height * 2) {
            return true;
        }
        return false;
    }
}