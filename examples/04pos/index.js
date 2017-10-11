const stdin = process.stdin;
const TrafficLightStory = require('./traffic-light-story');

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

const trafficLightStory = new TrafficLightStory();

trafficLightStory.tell();

stdin.on('data', key => {
  if ( key === '\u0003' ) {
    process.exit();
  }

  trafficLightStory.requestGreen();
});
