let canvas = document.getElementById("canvas");
let test = document.getElementById("test");

canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;

var io = io.connect();   

let ctx = canvas.getContext("2d");

let x;
let y;
let mouseDown = false;

window.onmousedown = (e) => {
  ctx.moveTo(x, y);
  io.emit("down",{x,y});
  mouseDown = true;
};

window.onmouseup = (e) => {
  mouseDown = false;
};
io.on("ondraw",({x,y}) => {
    ctx.lineTo(x, y);
    ctx.stroke();
});

io.on("ondown",({x,y}) => {
    ctx.moveTo(x, y);
});

window.onmousemove = (e) => {
  x = e.clientX;
  y = e.clientY;

  if (mouseDown) {
    io.emit("draw",{x,y});
    ctx.lineTo(x, y);
    ctx.stroke();
  }
};