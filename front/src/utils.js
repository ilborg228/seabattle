function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1))
}

function getRandomFrom(... args) {
    const index = Math.floor(Math.random() * args.length)
    return args[index]
}