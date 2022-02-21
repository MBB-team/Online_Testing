var can = document.createElement("canvas"),
  ctx = can.getContext('2d'),
  sta = -Math.PI / 2,
  dur = 3 * 1000;

can.width = 100;
can.height = 100;
document.body.appendChild(can);
ctx.font = "normal 30px Arial";

var myTimer = new Timer(dur, {
  ontick: function () {
    var pct = this.elapsed / dur,
      sec = Math.ceil((dur - this.elapsed) / 1000),
      wid = ctx.measureText(sec).width;

    ctx.clearRect(0, 0, 100, 100);

    ctx.fillStyle = "#777";
    ctx.arc(50, 50, 50, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.arc(50, 50, 50, sta, sta + 2 * Math.PI * pct);
    ctx.fill();

    ctx.fillStyle = "#111";
    ctx.fillText(sec, 50 - wid / 2 + 1, 61);
    ctx.fillStyle = "#eee";
    ctx.fillText(sec, 50 - wid / 2, 60);
  },
  onend: function () {
    this.ontick();
  },
  interval: 1000 / 60
}).start();

var timer2 = new Timer(dur);
timer2.ontick = function () {
  console.log(this.elapsed);
};
timer2.start();
