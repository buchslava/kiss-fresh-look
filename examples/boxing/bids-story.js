const util = require('./util');

class BidsComplete {
    constructor(match, bids) {
        this.match = match;
        this.bids = bids;
    }
}

module.exports = class BidsStory {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    collectBids(...matches) {
        this.bidCompletes = matches.reduce((result, match) => {
            const men = util.getMen(util.getRandom(10, 50));
            const bids = men.map(man => ({
                man,
                bid: util.getRandom(10, 100),
                boxer: util.getRandom(0, 2) === 0 ? 'red' : 'blue'
            }));

            result[match.getName()] = new BidsComplete(match.getName(), bids);

            return result;
        }, {});

        this.eventEmitter.emit('bids-ready');

        return this;
    }

    onBidsCollected(fun) {
        this.eventEmitter.on('bids-ready', () => fun());

        return this;
    }

    matchFinished() {
        this.eventEmitter.on('match-finished', (match, winnerColor) => {
            console.log('winners!', match, winnerColor, this.bidCompletes[match]);
        });
    }
}
