console.log("Resizing and scaling an image on the canvas...");

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

window.onload = function() {
    let img = document.getElementById("myImage");
    // Draw the image at its original size
    context.drawImage(img, 10, 30, 100, 200);
    context.drawImage(img, 120, 30, img.width / 2, img.height / 2);

    //được hỗ trợ khá rộng rãi trên các trình duyệt hiện đại.
    /*
    Đối với Pixel Art
    - Nếu bạn làm game pixel art (ví dụ như Mario cổ điển hoặc Terraria)
    , thường bạn sẽ muốn tắt làm mượt
    để các pixel vẫn giữ được độ sắc nét khi phóng to.
    - Ngược lại, với các hình ảnh thông thường hoặc sprite HD, nên bật,
    để có chất lượng hiển thị tốt hơn.
    */
    context.imageSmoothingEnabled = true;

    /*
    'low'
    'medium'
    'high'
    không được tất cả trình duyệt hỗ trợ hoàn toàn.
    */
    context.imageSmoothingQuality = 'high';
    context.drawImage(img, 200, 30, img.width * 3, img.height * 3);

}

