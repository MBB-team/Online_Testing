// function for timer
function Timer(duration /* in ms */ , props) {
  this.ontick = props && typeof props.ontick === "function" ? props.ontick : function() {};
  this.onend = props && typeof props.onend === "function" ? props.onend : function() {};
  this.interval = props && typeof props.interval === "number" ? props.interval : 1000 / 10;
  this.elapsed = 0;

  var running = false,
  start, end, self = this;

  this.start = function() {
    if (running) return self;

    start = new Date().getTime();
    end = start + duration;
    tick();
    running = true;

    return self;
  };

  function tick() {
    var now = new Date().getTime();
    self.ontick.call(self);
    self.elapsed = now - start;

    if (now < end) setTimeout(tick, self.interval);
    else self.onend.call(self);
  }
}
