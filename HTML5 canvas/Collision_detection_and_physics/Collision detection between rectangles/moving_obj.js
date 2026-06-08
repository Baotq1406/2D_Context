console.log("Collision_detection_and_physics test.");

let canvas;
let context;

let secondsPassed = 0;
let oldTimeStamp = 0;

let gameObjects = [];


window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    createWorld();

    window.requestAnimationFrame(gameLoop);

};

function gameLoop(timeStamp)
{
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Loop over all game objects

    // 1. Update
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }

    // 2. collision check
    detectCollisions();

    // 3. clear canvas
    clearCanvas();

    //4. draw
    // Do the same to draw
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
    }

    window.requestAnimationFrame(gameLoop);
}


class GameObject
{
    constructor (context, x, y, vx, vy){
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.isColliding = false;
    }
}

class Square extends GameObject
{
    constructor (context, x, y, vx, vy){
        super(context, x, y, vx, vy);

        // Set default width and height
        this.width = 50;
        this.height = 50;
    }

    draw(){
        // Draw a simple square
        this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

        update(secondsPassed){
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

function createWorld(){
    
    //let randomSquares = Math.floor(Math.random() * 10) + 10;
    const randomSquares = Math.floor(Math.random() * 19) + 2;
    console.log("Spawning " + randomSquares + " squares.");

    for(let i = 0; i < randomSquares; i++)
    {
        spawnSquare();
    }
}

function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function spawnSquare()
{
    let validPosition = false;
    let x, y;

    while(!validPosition)
    {
        x = Math.random() * (canvas.width - 50);
        y = Math.random() * (canvas.height - 50);

        validPosition = true;

        for(let obj of gameObjects)
        {
            let dx = obj.x - x;
            let dy = obj.y - y;

            let distance = Math.sqrt(dx*dx + dy*dy);

            if(distance < 60)
            {
                validPosition = false;
                break;
            }
        }
    }

    //van toc ngau nhien tu -100 den 100 
    let vx = (Math.random() * 200) - 100;
    let vy = (Math.random() * 200) - 100;

    gameObjects.push(
        new Square(context, x, y, vx, vy)
    );
}

function detectCollisions(){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];

            // Compare object1 with object2
            if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
                obj1.isColliding = true;
                obj2.isColliding = true;
            }
        }
    }
}

/*
    Quy tắc quan trọng:
    -Luôn cập nhật tất cả các đối tượng trước.
    -Sau đó mới kiểm tra va chạm.

    Thứ tự game loop:
    1. update
    2. collision check
    3. clear canvas
    4. draw
*/ 

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}




