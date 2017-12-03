module.exports = {
    getRandom: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min
    },
    getMen: quantity => {
        const result = [];

        for (let i = 0; i < quantity; i++) {
            result.push(`man${i}`);
        }

        return result;
    }
};