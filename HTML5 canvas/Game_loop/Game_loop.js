// Một game loop tệ không nên
// while (running) {
//     draw();
// }

/*
Một game loop khác nhưng vẫn chưa tốt, 
vì không biết khi nào trình duyệt thực sự sẵn sàng vẽ frame mới. nên:
Một số frame bạn tính toán ra có thể
Bị ghi đè bởi frame kế tiếp.
*/
// setInterval(gameLoop, 16);

// function gameLoop() {
//     draw();
// }

// The proper game loop, đây là cách nên dùng 
// window.requestAnimationFrame(gameLoop);

// function gameLoop() {
//     draw();
//     window.requestAnimationFrame(gameLoop);
// }

"use strict";
let canvas;
let context;

let lastTime = 0;
let fps = 0;


window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {

    if (lastTime !== 0) {
        let deltaTime = timeStamp - lastTime;
        fps = 1000 / deltaTime; 
        //console.log("FPS: ", fps.toFixed(2));
    }

    lastTime = timeStamp;

    draw();
    window.requestAnimationFrame(gameLoop);
}

function draw(){
    // Xóa toàn bộ canvas trước khi vẽ frame mới, okay hiểu 
    context.clearRect(0, 0, canvas.width, canvas.height);

    let randomColor = Math.random() > 0.5? '#ff8080' : '#0099b0';
    context.fillStyle = randomColor;
    context.fillRect(100, 50, 200, 175);

    // y > 225
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("FPS: " + fps.toFixed(2), 100, 250);
}

