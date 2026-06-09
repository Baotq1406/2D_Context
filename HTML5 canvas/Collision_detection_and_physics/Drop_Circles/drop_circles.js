console.log("Collision_detection_and_physics test.");

let canvas;
let context;

// Define the edges of the canvas
const canvasWidth = 750;
const canvasHeight = 400;

// Set a restitution, a lower value will lose more energy when colliding
/*
Một số giá trị COR điển hình

COR = 0
Đối tượng hấp thụ toàn bộ năng lượng khi va chạm.
Ví dụ: một bao cát rơi xuống sàn.

COR = 1
Va chạm đàn hồi hoàn hảo, không mất năng lượng.
Ví dụ: một quả bóng siêu nảy lý tưởng.

COR > 1
Hoàn toàn phi thực tế, vì va chạm sẽ tạo thêm năng lượng sau mỗi lần chạm.
*/ 
const restitution = 0.90;

let secondsPassed = 0;
let oldTimeStamp = 0;

let gameObjects = [];

const g = 9.81 * 100; // Gravitational acceleration

window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    createWorld();

    window.requestAnimationFrame(gameLoop);
};

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1);
    oldTimeStamp = timeStamp;

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }

    detectCollision();
    detectEdgeCollisions();
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
    constructor(context, x, y, vx, vy, radius, mass, restitution) {
        super(context, x, y, vx, vy);
        this.radius = radius;
        this.mass = mass;
        this.restitution = restitution; // Coefficient of restitution for this circle
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.isColliding ? "red" : "blue";
        context.fill();
        context.closePath();
    }

    update(secondsPassed) {
        // Apply gravity to vertical velocity
        this.vy += g * secondsPassed;

        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

function createWorld() {
    //const randomCircles = Math.floor(Math.random() * 18) + 2;
    const randomCircles = Math.floor(Math.random() * 10) + 10;

    for (let i = 0; i < randomCircles; i++) {
        spawnCircle(15, 1, restitution);
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function spawnCircle(radius, mass, restitution) {
    let validPosition = false;
    let x, y;

    while (!validPosition) {
        x = radius + Math.random() * (canvas.width - radius * 2);
        y = radius + Math.random() * (canvas.height - radius * 2);

        validPosition = true;

        // Kiểm tra biên trước
        // if (
        //     x - radius < 0 ||
        //     x + radius > canvas.width ||
        //     y - radius < 0 ||
        //     y + radius > canvas.height
        // )
        // {
        //     validPosition = false;
        //     continue;
        // }

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

            /*
            Không nên vì chỉ được kiểm tra khi đã có object trong mảng.
            thì vòng lặp không chạy và hình đầu tiên có thể spawn ngoài mép.
            Nên chuyển phần kiểm tra biên ra ngoài vòng for.
            */
            // if (x - radius < 0 || x + radius > canvas.width || y - radius < 0 || y + radius > canvas.height) {
            //     validPosition = false;
            //     break;
            // }
        }
    }

    let vx = (Math.random() * 200) - 100; // Velocity between -100 and 100
    let vy = (Math.random() * 200) - 100; // Velocity between -100 and 100

    gameObjects.push(new Circle(context, x, y, vx, vy, radius, mass, restitution));
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

    if (distance === 0) {
        return;
    }

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
    
    // Áp dụng hệ số đàn hồi
    speed *= Math.min(
        obj1.restitution,
        obj2.restitution
    );

    if (speed < 0) {
        //break; break chỉ được phép sử dụng bên trong: for, while, do...while, switch 
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
}

function detectEdgeCollisions() {
    let obj;
    for (let i = 0; i < gameObjects.length; i++) {
        obj = gameObjects[i];

        // Check for left and right
        if (obj.x < obj.radius) {
            obj.vx = Math.abs(obj.vx) * restitution;
            obj.x = obj.radius;
        } else if (obj.x > canvasWidth - obj.radius) {
            obj.vx = -Math.abs(obj.vx) * restitution;
            obj.x = canvasWidth - obj.radius;
        }

        // Check for bottom and top
        if (obj.y < obj.radius) {
            obj.vy = Math.abs(obj.vy) * restitution;
            obj.y = obj.radius;
        } else if (obj.y > canvasHeight - obj.radius) {
            obj.vy = -Math.abs(obj.vy) * restitution;
            obj.y = canvasHeight - obj.radius;
        }
    }
}

