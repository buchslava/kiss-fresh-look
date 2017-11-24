module.exports = class RecursiveTimer {
  constructor(context) {
    this.context = context;
    this.initialValue = null;
    this.fixedTimeout = null;
    this.stopped = false;
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

  withTimeLimit(timeLimit) {
    this.timeLimit = timeLimit;

    return this;
  }

  ifTimeLimitReached(onTimeLimitReachedFun) {
    this.onTimeLimitReached = onTimeLimitReachedFun.bind(this.context);

    return this;
  }

  calculateNextValue(getNextValueFun) {
    this.getNextValue = getNextValueFun.bind(this.context);

    return this;
  }

  checkConstraints() {
    if (!(this.getNextTimeout || this.fixedTimeout)) {
      throw Error('Timeout is confusing or missing!');
    }

    if (!this.getNextValue) {
      throw Error('Function for value calculating is missing!');
    }
  }

  start(actionFun) {
    this.timeStart = new Date().getTime();
    this.checkConstraints();

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

  stop() {
    clearTimeout(this.globalTimeout);
    this.stopped = true;
  }

  process(value) {
    this.action(value);

    const timeout = this.fixedTimeout || this.getNextTimeout();
    const nextValue = this.getNextValue ? this.getNextValue() : null;

    clearTimeout(this.globalTimeout);

    const currentTime = new Date().getTime();

    if (this.timeStart && this.timeLimit && currentTime - this.timeStart > this.timeLimit) {
      this.stop();

      if (this.onTimeLimitReached) {
        this.onTimeLimitReached();
      }

      return;
    }

    if (!this.stopped) {
      this.globalTimeout = setTimeout(() => {
        this.process(nextValue);
      }, timeout);
    }
  }
}
