let starImage = document.getElementById("starImage");
const numRows = 1;
const numCols = 13;

class Star extends GameObject {
    constructor(context, x, y, size, speed) {
        super(context, x, y, size, size, 0, speed);

        this.currentFrame = 0;
        this.animationTimer = 0;
        this.frameDuration = 0.1;

        // Đổi frame mỗi 100ms
        // this.intervalId = setInterval(() => {
        //     this.currentFrame++;

        //     if (this.currentFrame >= NUM_ROWS * NUM_COLS) {
        //         this.currentFrame = 0;
        //     }
        // }, 100)
    }
    
    update(secondsPassed) {
        super.update(secondsPassed);

        this.animationTimer += secondsPassed;

        if (this.animationTimer >= this.frameDuration) {
            this.currentFrame++;
            this.animationTimer = 0;

            if (this.currentFrame > numCols * numRows - 1) {
                this.currentFrame = 0;
            }
        }
    }

    draw() {
        if (!starImage.complete) return;

        const frameWidth = starImage.width / numCols;
        const frameHeight = starImage.height / numRows;
        const colIndex = this.currentFrame % numCols;
        const rowIndex = Math.floor(this.currentFrame / numCols);

        this.context.drawImage(
            starImage,
            colIndex * frameWidth,
            rowIndex * frameHeight,
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