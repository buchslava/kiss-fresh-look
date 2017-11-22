module.exports = class RecursiveTimer {
  constructor() {
    this.initialValue = null;
    this.fixedTimeout = null;
  }

  for(context) {
    this.context = context;

    return this;
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

  checkConstraints() {
    if (!(this.getNextTimeout || this.fixedTimeout)) {
      throw Error('Timeout is confusing or missing!');
    }

    if (!this.getNextValue) {
      throw Error('Function for value calculating is missing!');
    }
  }

  start(actionFun) {
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
