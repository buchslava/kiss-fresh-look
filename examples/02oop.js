const stdin = process.stdin;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

class TrafficLight {
  constructor() {
    this.RED = Symbol('RED');
    this.YELLOW = Symbol('YELLOW');
    this.GREEN = Symbol('GREEN');

    this.lights = [this.RED, this.YELLOW, this.GREEN, this.YELLOW];
    this.currentLight = 0;
    this.timeoutId = null;
  }

  process(currentLight) {
    this.currentLight = currentLight;

    const nextLight = this.currentLight + 1 < this.lights.length ? this.currentLight + 1 : 0;
    const timeoutValue = nextLight === 0 || nextLight === 2 ? 2000 : 5000;

    console.log(String(this.lights[currentLight]), new Date());

    clearTimeout(this.globalTimeout);

    this.globalTimeout = setTimeout(() => {
        this.process(nextLight);
    }, timeoutValue);
  }

  greenRequest() {
    if (this.currentLight === 0 || this.currentLight === 3) {
      clearTimeout(this.globalTimeout);

      this.process(1);
    }
  }
}

const trafficLight = new TrafficLight();

trafficLight.process(0);

stdin.on('data', key => {
  if ( key === '\u0003' ) {
    process.exit();
  }

  trafficLight.greenRequest();
});