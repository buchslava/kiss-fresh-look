const BoxerStory = require('./boxer-story');

module.exports = class MatchStory {
    constructor(boxerRed, boxerBlue) {
        boxerRed.opponent = boxerBlue;
        boxerBlue.opponent = boxerRed;
        this.stories = [new BoxerStory(boxerRed), new BoxerStory(boxerBlue)];
    }

    forEachBoxerStory(cb) {
        this.stories.forEach(story => cb(story));
    }

    tell() {
        const onMatchEnd = () => {
            this.forEachBoxerStory(story => story.stopFighting());
            this.showResult();
        };

        this.forEachBoxerStory(story => story
            .withTimeLimit(30000)
            .ifHadKnockout(onMatchEnd)
            .ifTimeLimitReached(onMatchEnd)
            .tell());
    }

    showResult() {
        console.log(`that's all...`);
    }
}
