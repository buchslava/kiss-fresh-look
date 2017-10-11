const constants = require('./constants');
const TrafficLight = require('./traffic-light');
const RecursiveTimer = require('./recursive-timer');

module.exports = class TrafficLightStory {
  constructor() {
    this.trafficLight = new TrafficLight();
    this.recursiveTimer = new RecursiveTimer(this.trafficLight);
  }

  tell() {
    this.recursiveTimer
      .withInitialValue(constants.RED_STATE)
      .withCustomTimeout(this.trafficLight.getNextTimeout)
      .calculateNextValue(this.trafficLight.getNextLight)
      .start(this.trafficLight.setAndShowLight);
  }

  requestGreen() {
    if (this.trafficLight.isRedOrYellowAfterGreen()) {
      this.recursiveTimer.restartFrom(constants.YELLLOW_BEFORE_GREEN_STATE);
    }
  }
}
