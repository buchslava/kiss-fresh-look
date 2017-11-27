const RecursiveTimer = require('./recursive-timer');
const constants = require('./constants');

module.exports = class BoxerStory {
  constructor(boxer) {
    this.boxer = boxer;
    this.recursiveTimer = new RecursiveTimer(this.boxer);
  }

  withTimeLimit(timeLimit) {
    this.timeLimit = timeLimit;

    return this;
  }

  ifTimeLimitReached(onTimeoutLimitReached) {
    this.onTimeoutLimitReached = onTimeoutLimitReached;

    return this;
  }

  ifHadKnockout(onKnockout) {
    this.boxer.shouldBeReadyToPunch(onKnockout);

    return this;
  }

  tell() {
    this.recursiveTimer
      .withInitialValue(constants.PUNCH)
      .withTimeLimit(this.timeLimit)
      .withCustomTimeout(this.boxer.getNextTimeout)
      .calculateNextValue(this.boxer.getNextPunch)
      .ifTimeLimitReached(this.onTimeoutLimitReached)
      .start(this.boxer.fight);
  }

  stopFighting() {
    this.recursiveTimer.stop();
  }
}
