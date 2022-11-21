module.exports = class PlayerStat {
    username = null
    winCount = null
    loseCount = null

    constructor(username, winCount = 0, loseCount = 0) {
        Object.assign(this, { username, winCount, loseCount });
    }
}