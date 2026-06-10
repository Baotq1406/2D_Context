console.log("Using clipping with sprites");

let canvas;
let context;
let sprite;

let secondsPassed = 0;
let oldTimeStamp = 0;

let gameObjects = [];



window.onload = init;

function init() {
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    sprite = document.getElementById("mySprite");

    createWorld();

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1);
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

class GameObject {
    constructor(context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.isColliding = false;
    }
}

class Circle extends GameObject {
    // Define the number of columns and rows in the sprite
    static numColumns = 5;
    static numRows = 2;
    static frameWidth = 0;
    static frameHeight = 0;
    static sprite;

    constructor(context, x, y, vx, vy, radius, mass) {
        // Pass params to super class
        super(context, x, y, vx, vy);

        // Set the size of the hitbox
        this.radius = radius;
        this.mass = mass;
        this.currentFrame = Math.floor(Math.random() * (Circle.numColumns * Circle.numRows)); // start at random frame
        this.timeSinceLastFrame = 0;

        // Supply the sprite. Only load it once and reuse it
        this.loadImage();
    }

    loadImage() {
        // Check for an existing image
        if (!Circle.sprite) {
            // No image found, create a new element
            Circle.sprite = new Image();

            // Handle a successful load
            Circle.sprite.onload = () => {
                // Define the size of a frame
                Circle.frameWidth = Circle.sprite.width / Circle.numColumns;
                Circle.frameHeight = Circle.sprite.height / Circle.numRows;
            };

            // Start loading the image
            Circle.sprite.src = "../img/anh_lo_nhung_nhiu_lo_hon.png";
        }
    }

    draw() {
        // Limit the maximum frame and loop back to 0
        let maxFrame = Circle.numColumns * Circle.numRows - 1;
        if (this.currentFrame > maxFrame) {
            //this.currentFrame = maxFrame;
            this.currentFrame = 0;
        }

        // Update rows and columns
        let column = this.currentFrame % Circle.numColumns;
        let row = Math.floor(this.currentFrame / Circle.numColumns);

        // Draw the image
        // bo offset
        // this.context.drawImage(
        //     Circle.sprite, 
        //     column * Circle.frameWidth, 
        //     row * Circle.frameHeight, 
        //     Circle.frameWidth, 
        //     Circle.frameHeight, 
        //     (this.x - this.radius), 
        //     (this.y - this.radius), 
        //     this.radius * 2, 
        //     this.radius * 2.42
        // );

        //có offset
        //Draw the image
        // this.context.drawImage(
        //     Circle.sprite, 
        //     column * Circle.frameWidth, 
        //     row * Circle.frameHeight, 
        //     Circle.frameWidth, 
        //     Circle.frameHeight, 
        //     this.x - this.radius, 
        //     this.y - this.radius * 1.42, 
        //     this.radius * 2, 
        //     this.radius * 2.42
        // );

        // The y-offset is 42% of the radius. When radius = 10px, entire bottle = 20px, neck = 4.2px
        // To maintain the image aspect ratio, the height is 21% larger than the width (2.42 vs 2 times the radius)
        // You can calculate it by dividing the image height by image width. You could automate it further.

        // Set the origin to the center of the circle, rotate the context, move the origin back
        this.context.translate(this.x, this.y);
        this.context.rotate(Math.PI / 180 * (this.angle + 90));
        this.context.translate(-this.x, -this.y);

        // Draw the image, rotated
        this.context.drawImage(
            Circle.sprite, 
            column * Circle.frameWidth, 
            row * Circle.frameHeight, 
            Circle.frameWidth, 
            Circle.frameHeight, 
            (this.x - this.radius), 
            (this.y - this.radius) - this.radius * 0.4, 
            this.radius * 2, 
            this.radius * 2.42);

        // Reset transformation matrix
        this.context.setTransform(1, 0, 0, 1, 0, 0);

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.strokeStyle = "blue";
        this.context.lineWidth = 1;
        this.context.stroke();

    }

    handleCollision() {
        // Pick the next frame of the animation
        this.currentFrame++;
    }

    update(secondsPassed) {
        // Move with velocity x/y
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        // Calculate the angle
        let radians = Math.atan2(this.vy, this.vx);
        this.angle = 180 * radians / Math.PI;
    }
}

function createWorld() {
    const randomCircles = Math.floor(Math.random() * 20) + 10;
    for (let i = 0; i < 2; i++) {
        spawnCircle(30, 10);
    }

    for (let i = 0; i < randomCircles; i++) {
        spawnCircle(15, 1);
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function spawnCircle(radius, mass) {
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

            let squareRadius = (obj.radius * 2) * (obj.radius * 2);

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

function detectCollision() {
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
    let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2));
}

// respond to collision by changing the velocity of the circles
function respondToCollision(obj1, obj2) {
    // Calculate the normal vector of the collision
    let vCollision = {
        x: obj2.x - obj1.x,
        y: obj2.y - obj1.y
    };

    // Calculate the distance between the two circles
    let distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));

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

    if (speed < 0) {
        //break;
        return;
    }

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

    // Call handle collision to change color/frame
    obj1.handleCollision();
    obj2.handleCollision();
}
