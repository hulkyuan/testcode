function draw() {
    window.requestAnimationFrame(draw);
    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');
    var time = new Date().getTime() * 0.002;
    
    // draw stuff
    c.fillStyle = "red";
    c.fillRect(Math.sin( time )*50+70, Math.cos( time )*50+70, 20, 20);
    
    // fade background
    c.fillStyle = "rgba(255, 255, 255, 0.1)";
    c.fillRect(0, 0, canvas.width, canvas.height);

}
draw();