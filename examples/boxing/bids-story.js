const util = require('./util');

module.exports = class BidsStory {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    collectBids(...matches) {
        for (const m of matches) {
            console.log(m.getName());
        }

        // todo: bids for every match

        const men = util.getMen(util.getRandom(10, 50));

        this.bids = men.map(man => ({
            man,
            bid: util.getRandom(10, 100),
            boxer: util.getRandom(0, 2) === 0 ? 'red' : 'blue'
        }));

        this.eventEmitter.emit('bids-ready');

        return this;
    }

    onBidsCollected(fun) {
        this.eventEmitter.on('bids-ready', () => fun());

        return this;
    }

    matchFinished() {
        this.eventEmitter.on('match-finished', () => {
            console.log('winners!');
        });
    }
}
