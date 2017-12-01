const EventEmitter = require('events').EventEmitter;

const RecursiveTimer = require('./recursive-timer');
const Boxer = require('./boxer');
const MatchStory= require('./match-story');
const eventEmitter = new EventEmitter();

// Bid {

const ali = new Boxer('Ali', eventEmitter);
const fraizer = new Boxer('Fraizer', eventEmitter);
const matchStory1 = new MatchStory(ali, fraizer);

const tyson = new Boxer('Tyson', eventEmitter);
const holyfield = new Boxer('Holyfield', eventEmitter);
const matchStory2 = new MatchStory(tyson, holyfield);

matchStory2.tell();
