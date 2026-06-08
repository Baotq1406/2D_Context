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
    constructor (context, x, y, vx, vy, radius, mass){
        super(context, x, y, vx, vy);
        this.radius = radius;
        this.mass = mass;
    }

    draw(){
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.isColliding ? "red" : "blue";
        this.context.fill();

        // Draw heading vector
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x + this.vx, this.y + this.vy);
        this.context.stroke();
    } 

    update(secondsPassed){
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        // Calculate the angle (vy before vx)
        let radians = Math.atan2(this.vy, this.vx);

        // Convert to degrees
        let degrees = 180 * radians / Math.PI;
    }
}

function createWorld()
{
    // let circle1 = new Circle(context, 100, 100, 50, 50, 30);
    // let circle2 = new Circle(context, 300, 300, -50, -50, 30);
    // gameObjects.push(circle1);
    // gameObjects.push(circle2);

    //const randomCircles = Math.floor(Math.random() * 18) + 2;
    const randomCircles = Math.floor(Math.random() * 20) + 10;
    for (let i = 0; i < 2; i++) {
        spawnCircle(30, 10);
    } 

    for (let i = 0; i < randomCircles; i++) {
        spawnCircle(15, 1);
    }
}

function clearCanvas()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function spawnCircle(radius, mass)
{
    let validPosition = false;
    let x, y;

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
    gameObjects.push(new Circle(context, x, y, vx, vy, radius, mass));
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
                respondToCollision(obj1, obj2);
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

// respond to collision by changing the velocity of the circles
function respondToCollision(obj1, obj2) 
{
    // Calculate the normal vector of the collision
    let vCollision = { 
        x: obj2.x - obj1.x, 
        y: obj2.y - obj1.y
    };

    // Calculate the distance between the two circles
    let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));

    // Normalize the collision vector
    let vCollisionNorm = {
        x: vCollision.x / distance, 
        y: vCollision.y / distance
    };

    // Calculate the relative velocity of the two circles
    let vRelativeVelocity = {
        x: obj1.vx - obj2.vx, 
        y: obj1.vy - obj2.vy
    };

    // Calculate the speed of the collision
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

    // obj1.vx -= (speed * vCollisionNorm.x);
    // obj1.vy -= (speed * vCollisionNorm.y);
    // obj2.vx += (speed * vCollisionNorm.x);
    // obj2.vy += (speed * vCollisionNorm.y);

    // Calculate the impulse of the collision
    let impulse = 2 * speed / (obj1.mass + obj2.mass);
    obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
    obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
    obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
    obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);
}