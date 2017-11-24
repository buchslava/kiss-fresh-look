const util = require('./util');

const PUNCH = 1;
const KNOCKOUT = 2;

module.exports = class Boxer {
    constructor(name) {
        this.name = name;
        this.missedPunches = [];
    }

    fight(punchType) {
        console.log(`${this.name}: ${punchType} ${this.missedPunches.length}`);

        eventEmitter.emit('punch', { author: this.name, type: punchType });
    }

    getNextPunch() {
        const power = getRandom(0, 10);

        if (power === 9) {
            return KNOCKOUT;
        }

        return PUNCH;
    }

    shouldBeReadyToPunch(onKnockout) {
        eventEmitter.on('punch', punchDescriptor => {
            if (punchDescriptor.author === this.opponent.name) {
                this.missedPunches.push(punchDescriptor);

                if (punchDescriptor.type === KNOCKOUT) {
                    onKnockout();
                }
            }
        });

        return this;
    }

    getNextTimeout() {
        return getRandom(200, 5000);
    }
}
