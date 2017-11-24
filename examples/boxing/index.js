const EventEmitter = require('events').EventEmitter
const RecursiveTimer = require('./recursive-timer');

const Boxer = require('./boxer');
const BoxerStory = require('./boxer-story');

const eventEmitter = new EventEmitter();

/*
class Bid {
}
*/

class MatchStory {
  constructor(boxerRed, boxerBlue) {
    boxerRed.opponent = boxerBlue;
    boxerBlue.opponent = boxerRed;

    const onMatchEnd = () => {
      this.boxerRedStory.stopFighting();
      this.boxerBlueStory.stopFighting();
      this.showResult();
      // this.onFinish()
    };
    const matchTimeLimit = 30000;

    this.boxerRedStory = new BoxerStory(boxerRed)
      .withTimeLimit(matchTimeLimit)
      .ifHadKnockout(onMatchEnd)
      .ifTimeLimitReached(onMatchEnd);
    this.boxerBlueStory = new BoxerStory(boxerBlue)
      .withTimeLimit(matchTimeLimit)
      .ifHadKnockout(onMatchEnd)
      .ifTimeLimitReached(onMatchEnd);
  }

  // tell(onFinish)
  tell() {
    // this.onFinish = onFinish
    this.boxerRedStory.tell()
    this.boxerBlueStory.tell();
  }

  showResult() {
    console.log(`that's all...`);
  }
}

const ali = new Boxer('Ali');
const fraizer = new Boxer('Fraizer');
const matchStory1 = new MatchStory(ali, fraizer);

const tyson = new Boxer('Tyson');
const holyfield = new Boxer('Holyfield');
const matchStory2 = new MatchStory(tyson, holyfield);

matchStory2.tell();
