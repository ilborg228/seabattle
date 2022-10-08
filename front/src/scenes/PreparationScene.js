const shipDatas = [
    { size: 4, direction: "row", startX: 10, startY: 345 },
    { size: 3, direction: "row", startX: 10, startY: 390 },
    { size: 3, direction: "row", startX: 120, startY: 390 },
    { size: 2, direction: "row", startX: 10, startY: 435 },
    { size: 2, direction: "row", startX: 88, startY: 435 },
    { size: 2, direction: "row", startX: 167, startY: 435 },
    { size: 1, direction: "row", startX: 10, startY: 480 },
    { size: 1, direction: "row", startX: 55, startY: 480 },
    { size: 1, direction: "row", startX: 100, startY: 480 },
    { size: 1, direction: "row", startX: 145, startY: 480 },
]


class PreparationScene extends Scene {

    draggedShip = null
    mouseOffsetX = null
    mouseOffsetY = null

    init() {
        console.log("PreparationScene init")
        const {player} = this.app

        for (const {size, direction, startX, startY} of shipDatas) {
            const ship = new ShipView(size, direction, startX, startY)
            player.addShip(ship)
        }
    }

    start() {

    }

    update() {
        const {mouse, player} = this.app

        if (!this.draggedShip && mouse.left && !mouse.prevLeft) {
            const ship = player.ships.find(ship => ship.isUnder(mouse))

            if (ship) {
                const rect = ship.div.getBoundingClientRect()
                this.mouseOffsetX = mouse.x - rect.left
                this.mouseOffsetY = mouse.y - rect.top

                this.draggedShip = ship
            }
        }

        if (mouse.left && this.draggedShip) {
            const {left, top} = player.root.getBoundingClientRect()
            const x = mouse.x - left - this.mouseOffsetX
            const y = mouse.y - top - this.mouseOffsetY

            this.draggedShip.div.style.left = `${x}px`
            this.draggedShip.div.style.top = `${y}px`
        }

        if (!mouse.left && this.draggedShip) {
            this.draggedShip = null
        }

        if (this.draggedShip && mouse.delta) {
            this.draggedShip.toggleDirection()
        }
    }

    stop() {

    }
}