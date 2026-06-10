console.log("Drawing only a part of an image");

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

window.onload = function() {
    let img = document.getElementById("myImage");
    //context.drawImage(img, 10, 30, 750, 400);
    //ontext.drawImage(img, 100, 0, 200, 100, 10, 30, 200, 100);
    context.drawImage(img, 100, 0, 200, 50, 10, 30, 400, 100);
}

