const EventEmitter = require('events').EventEmitter
const RecursiveTimer = require('./recursive-timer');

const Boxer = require('./boxer');
const BoxerStory = require('./boxer-story');

const eventEmitter = new EventEmitter();

// Bid {

class MatchStory {
  constructor(boxerRed, boxerBlue) {
    boxerRed.opponent = boxerBlue;
    boxerBlue.opponent = boxerRed;
    this.stories = [new BoxerStory(boxerRed), new BoxerStory(boxerBlue)];
  }

  tell() {
    const onMatchEnd = () => {
      this.stories.forEach(story => {
        story.stopFighting()
      });

      this.showResult();
    };

    this.stories.forEach(story => {
      story
      .withTimeLimit(30000)
      .ifHadKnockout(onMatchEnd)
      .ifTimeLimitReached(onMatchEnd)
      .tell();
    });
  }

  showResult() {
    console.log(`that's all...`);
  }
}

const ali = new Boxer('Ali', eventEmitter);
const fraizer = new Boxer('Fraizer', eventEmitter);
const matchStory1 = new MatchStory(ali, fraizer);

const tyson = new Boxer('Tyson', eventEmitter);
const holyfield = new Boxer('Holyfield', eventEmitter);
const matchStory2 = new MatchStory(tyson, holyfield);

matchStory2.tell();
