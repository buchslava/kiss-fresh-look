const BoxerStory = require('./boxer-story');

module.exports = class MatchStory {
    constructor(boxerRed, boxerBlue, eventEmitter) {
        this.boxerRed = boxerRed;
        this.boxerBlue = boxerBlue;
        this.eventEmitter = eventEmitter;
        this.boxerRed.opponent = boxerBlue;
        this.boxerBlue.opponent = boxerRed;
        this.stories = [new BoxerStory(boxerRed), new BoxerStory(boxerBlue)];
    }

    getName() {
        return `${this.boxerRed.name}-${this.boxerBlue.name}`;
    }

    forEachBoxerStory(cb) {
        this.stories.forEach(story => cb(story));
    }

    box() {
        const onMatchFinished = () => {
            this.forEachBoxerStory(story => story.stopFighting());
            this.eventEmitter.emit('match-finished');
        };

        this.forEachBoxerStory(story => story
            .withTimeLimit(30000)
            .ifHadKnockout(onMatchFinished)
            .ifTimeLimitReached(onMatchFinished)
            .tell());
    }
}
