const stdin = process.stdin;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

class RecursiveTimer {
  constructor(context) {
    this.context = context;
  }

  stop() {
    clearTimeout(this.globalTimeout);
  }

  process(value, actionFun, getNextTimeoutFun, getNextValueFun) {
    const action = actionFun.bind(this.context);
    const getNextTimeout = getNextTimeoutFun.bind(this.context);
    const getNextValue = getNextValueFun.bind(this.context);

    action(value);

    const timeout = getNextTimeout();
    const nextValue = getNextValue();

    clearTimeout(this.globalTimeout);

    this.globalTimeout = setTimeout(() => {
      this.process(nextValue, actionFun, getNextTimeoutFun, getNextValueFun);
    }, timeout);
  }
}

const RED_STATE = 0;
const YELLLOW_BEFORE_GREEN_STATE = 1;
const GREEN_STATE = 2;
const YELLOW_AFTER_GREEN_STATE = 3;

class TrafficLight {
  constructor() {
    this.RED = Symbol('RED');
    this.YELLOW = Symbol('YELLOW');
    this.GREEN = Symbol('GREEN');

    this.flow = [this.RED, this.YELLOW, this.GREEN, this.YELLOW];
    this.current = 0;
  }

  setAndShowLight(newLightValue) {
    this.current = newLightValue;

    console.log(String(this.flow[this.current]), new Date());
  }

  getNextLight() {
    return this.current + 1 < this.flow.length ? this.current + 1 : 0;
  }

  getNextTimeout() {
    const nextLight = this.getNextLight();

    return nextLight === RED_STATE || nextLight === GREEN_STATE ? 2000 : 5000;
  }

  isRedOrYellowAfterGreen() {
    return this.current === RED_STATE || this.current === YELLOW_AFTER_GREEN_STATE;
  }
}

class TrafficLightStory {
  constructor() {
    this.trafficLight = new TrafficLight();
    this.recursiveTimer = new RecursiveTimer(this.trafficLight);
  }

  tell() {
    this.recursiveTimer.process(
      RED_STATE,
      this.trafficLight.setAndShowLight,
      this.trafficLight.getNextTimeout,
      this.trafficLight.getNextLight);
  }

  requestGreen() {
    if (this.trafficLight.isRedOrYellowAfterGreen()) {
      this.recursiveTimer.stop();
      this.recursiveTimer.process(
        YELLLOW_BEFORE_GREEN_STATE,
        this.trafficLight.setAndShowLight,
        this.trafficLight.getNextTimeout,
        this.trafficLight.getNextLight);
    }
  }
}

const trafficLightStory = new TrafficLightStory();

trafficLightStory.tell();

stdin.on('data', key => {
  if ( key === '\u0003' ) {
    process.exit();
  }

  trafficLightStory.requestGreen();
});
