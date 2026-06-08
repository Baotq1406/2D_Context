console.log("Collision_detection_and_physics test.");

let canvas;
let context;

let secondsPassed = 0;
let oldTimeStamp = 0;

let gameObjects = [];

window.onload = init;

function init() 
{
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    createWorld();

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) 
{    
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }

    detectCollision();
    clearCanvas();

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

class Circle extends GameObject
{
    constructor (context, x, y, vx, vy, radius){
        super(context, x, y, vx, vy);
        this.radius = 30;
    }

    draw(){
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.isColliding ? "red" : "blue";
        this.context.fill();
    } 

    update(secondsPassed){
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

function createWorld()
{
    // let circle1 = new Circle(context, 100, 100, 50, 50, 30);
    // let circle2 = new Circle(context, 300, 300, -50, -50, 30);
    // gameObjects.push(circle1);
    // gameObjects.push(circle2);

    const randomCircles = Math.floor(Math.random() * 18) + 2;
    for (let i = 0; i < randomCircles; i++) {
        spawnCircle();
    } 
}

function clearCanvas()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function spawnCircle()
{
    let validPosition = false;
    let x, y;
    //let radius = 30;

    while (!validPosition) {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;

        validPosition = true;

        for (let obj of gameObjects) {
            let dx = obj.x - x;
            let dy = obj.y - y;
            let squareDistance = dx * dx + dy * dy;
  
            let squareRadius =  (obj.radius * 2) * (obj.radius * 2);

            //console.log("Distance: " + squareDistance + ", Radius: " + squareRadius);

            if (squareDistance < squareRadius) {
                validPosition = false;
                break;
            }
        }
    }

    let vx = (Math.random() * 200) - 100; // Velocity between -100 and 100
    let vy = (Math.random() * 200) - 100; // Velocity between -100 and 100

    //gameObjects.push(new Circle(context, x, y, 0, 0, radius));
    gameObjects.push(new Circle(context, x, y, vx, vy));
}

function detectCollision() 
{
    let obj1;
    let obj2;

    // reset collision state
    for (let obj of gameObjects) {
        obj.isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++) {
            obj2 = gameObjects[j];
            if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)) {
                obj1.isColliding = true;
                obj2.isColliding = true;
            }
        }
    }
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {
    // Calculate the distance between the two circles
    let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2));
}