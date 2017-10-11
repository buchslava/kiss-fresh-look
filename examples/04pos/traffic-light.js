const constants = require('./constants');

module.exports = class TrafficLight {
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

    return nextLight === constants.RED_STATE || nextLight === constants.GREEN_STATE ? 2000 : 5000;
  }

  isRedOrYellowAfterGreen() {
    return this.current === constants.RED_STATE || this.current === constants.YELLOW_AFTER_GREEN_STATE;
  }
}
