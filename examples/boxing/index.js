const EventEmitter = require('events').EventEmitter;
const eventEmitter = new EventEmitter();

const RecursiveTimer = require('./recursive-timer');
const Boxer = require('./boxer');
const MatchStory = require('./match-story');
const BidsStory = require('./bids-story');

const Ali = new Boxer('Ali', eventEmitter);
const Fraizer = new Boxer('Fraizer', eventEmitter);
const AliFraizer = new MatchStory(Ali, Fraizer, eventEmitter);

const Tyson = new Boxer('Tyson', eventEmitter);
const Holyfield = new Boxer('Holyfield', eventEmitter);
const TysonHolyfield = new MatchStory(Tyson, Holyfield, eventEmitter);

new BidsStory(eventEmitter)
  .onBidsCollected(() => {    
    AliFraizer.box();
    TysonHolyfield.box();
  })
  .collectBids(AliFraizer, TysonHolyfield)
  .matchFinished();
