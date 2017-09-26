const stdin = process.stdin;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

class RecursiveTimer {
  constructor(context) {
    this.context = context;
    this.initialValue = null;
    this.fixedTimeout = null;
  }

  withInitialValue(initialValue) {
    this.initialValue = initialValue;

    return this;
  }

  withCustomTimeout(getNextTimeoutFun) {
    this.getNextTimeout = getNextTimeoutFun.bind(this.context);

    return this;
  }

  withFixedTimeout(fixedTimeout) {
    this.fixedTimeout = fixedTimeout;

    return this;
  }

  calculateNextValue(getNextValueFun) {
    this.getNextValue = getNextValueFun.bind(this.context);

    return this;
  }

  start(actionFun) {
    if (this.getNextValue && this.fixedTimeout) {
      throw Error('Timeout is missing!');
    }

    this.action = actionFun.bind(this.context);

    const nextTimeout = this.fixedTimeout || this.getNextTimeout();
    const nextValue = this.getNextValue ? this.getNextValue() : null;
 
    this.action(this.initialValue);

    this.globalTimeout = setTimeout(() => {
      this.process(nextValue);
    }, nextTimeout);
  }

  restartFrom(value) {
    clearTimeout(this.globalTimeout);

    this.process(value);
  }

  process(value) {
    this.action(value);

    const timeout = this.fixedTimeout || this.getNextTimeout();
    const nextValue = this.getNextValue ? this.getNextValue() : null;

    clearTimeout(this.globalTimeout);
  
    this.globalTimeout = setTimeout(() => {
      this.process(nextValue);
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
    this.recursiveTimer
      .withInitialValue(RED_STATE)
      .withCustomTimeout(this.trafficLight.getNextTimeout)
      .calculateNextValue(this.trafficLight.getNextLight)
      .start(this.trafficLight.setAndShowLight);
  }

  requestGreen() {
    if (this.trafficLight.isRedOrYellowAfterGreen()) {
      this.recursiveTimer.restartFrom(YELLLOW_BEFORE_GREEN_STATE);
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
