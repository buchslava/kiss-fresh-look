const constants = require('./constants');
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
            this.eventEmitter.emit('match-finished', this.getName(), this.getWinnerColor());
        };

        this.forEachBoxerStory(story => story
            .withTimeLimit(30000)
            .ifHadKnockout(onMatchFinished)
            .ifTimeLimitReached(onMatchFinished)
            .tell());
    }

    getWinnerColor() {
        const isRedKnockout = this.boxerRed.missedPunches
        .filter(punchDescriptor => punchDescriptor.type === constants.KNOCKOUT).length > 0;
        const isBlueKnockout = this.boxerBlue.missedPunches
        .filter(punchDescriptor => punchDescriptor.type === constants.KNOCKOUT).length > 0;

        if (isRedKnockout) {
            return 'blue';
        } else if (isBlueKnockout) {
            return 'red';
        } else {
            return this.boxerRed.missedPunches.length > this.boxerBlue.missedPunches.length ? 'blue' : 'red';
        }
    }
}
