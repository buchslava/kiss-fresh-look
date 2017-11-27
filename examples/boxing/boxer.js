const util = require('./util');
const constants = require('./constants');

module.exports = class Boxer {
    constructor(name, eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.name = name;
        this.missedPunches = [];
    }

    fight(punchType) {
        console.log(`${this.name}: ${punchType} ${this.missedPunches.length}`);

        this.eventEmitter.emit('punch', { author: this.name, type: punchType });
    }

    getNextPunch() {
        const power = util.getRandom(0, 10);

        if (power === 9) {
            return constants.KNOCKOUT;
        }

        return constants.PUNCH;
    }

    shouldBeReadyToPunch(onKnockout) {
        this.eventEmitter.on('punch', punchDescriptor => {
            if (punchDescriptor.author === this.opponent.name) {
                this.missedPunches.push(punchDescriptor);

                if (punchDescriptor.type === constants.KNOCKOUT) {
                    onKnockout();
                }
            }
        });

        return this;
    }

    getNextTimeout() {
        return util.getRandom(200, 5000);
    }
}
