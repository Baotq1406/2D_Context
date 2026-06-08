console.log("Canvas animation test");

"use strict";
let canvas;
let context;

let secondsPassed = 0; // dẹt sơ, this is delta time.
let oldTimeStamp = 0;
let fps = 0;
let speed = 100;

let displayFps = 0; // Lưu FPS để hiển thị
let fpsTimer = 0; // Tính thời gian để làm chậm việc cập nhật số FPS

let rectX = 0;
let rectY = 0;


window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    window.requestAnimationFrame(gameLoop);
};

function gameLoop(timeStamp) {
    // Cập nhật vị trí của hình chữ nhật

    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    // Move forward in time with a maximum amount
    secondsPassed = Math.min(secondsPassed, 0.1);

    //console.log(seconds`Passed.toFixed(5));
    oldTimeStamp = timeStamp;
    fps = 1 / secondsPassed;
    
    // Chỉ cập nhật hiển thị FPS mỗi 0.25 giây để tránh việc số FPS nhảy liên tục
    fpsTimer += secondsPassed;
    if (fpsTimer > 0.25) {
        displayFps = fps.toFixed(2); 
        fpsTimer = 0;
    }

    /*
    Nguyên tắc này khi bạn bắt đầu thêm các tác vụ khác vào vòng lặp trò chơi (game loop). 
    Luôn cập nhật trạng thái của các đối tượng trong trò chơi trước, và sau cùng mới vẽ mọi thứ lên màn hình.
    */

    update(secondsPassed); // Cập nhật trạng thái game    
    draw(); // Vẽ trạng thái mới nhất lên màn hình

    window.requestAnimationFrame(gameLoop);
};

function update(secondsPassed) {
    // rectX += 1;
    // rectY += 1;
    rectX += speed * secondsPassed;
    rectY += speed * secondsPassed;

    checkRectPosition(); // Kiểm tra vị trí của hình chữ nhật
};

function checkRectPosition() {
    // sai do hai vi tri x va y cap tai hai thoi diem khac nhau
    // if (rectX > canvas.width) {  
    //     rectX = 0;
    // }
    // if (rectY > canvas.height) {
    //     rectY = 0;
    // }

    // right way
    if (rectX > canvas.width || rectY > canvas.height) {
        rectX = 0;
        rectY = 0;
    }
};

function draw() {
    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ff8080';
    context.fillRect(rectX, rectY, 150, 100);

    context.fillStyle = '#000000';
    context.font = "20px Arial";
    // Vẽ giá trị đã được làm tròn và được làm chậm tần suất cập nhật
    context.fillText("FPS: " + displayFps, canvas.width - 200, 30); // nếu muốn con số nó rõ ràng hơn thì sao...
};
