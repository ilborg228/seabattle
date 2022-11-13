class ShipView extends Ship {
	div = null;
	decks = [];

	startX = null;
	startY = null;

	constructor(size, direction, startX, startY) {
		super(size, direction);

		const div = document.createElement("div");
		div.classList.add("ship");

		for (let i = 0; i < size; i++) {
			const deck = document.createElement("img");
			deck.classList.add("deck");
			deck.src = 'ship.png'
			div.append(deck)
			this.decks.push(deck)
		}

		Object.assign(this, { div, startX, startY });

		this.setDirection(direction, true);
	}

	setDirection(newDirection, force = false) {
		if (!force && this.direction === newDirection) {
			return false;
		}

		this.div.classList.remove(`ship-${this.direction}-${this.size}`);
		this.direction = newDirection;
		this.div.classList.add(`ship-${this.direction}-${this.size}`);

		if (newDirection === "column") {
			this.decks.forEach(deck => {
				deck.classList.add("rotated")
			})
		} else {
			this.decks.forEach(deck => {
				deck.classList.remove("rotated")
			})
		}

		return true;
	}

	toggleDirection() {
		const newDirection = this.direction === "row" ? "column" : "row";
		this.setDirection(newDirection);
	}

	isUnder(point) {
		return isUnderPoint(point, this.div);
	}
}
