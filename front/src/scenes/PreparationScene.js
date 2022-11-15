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
];

class PreparationScene extends Scene {
	draggedShip = null;
	draggedOffsetX = 0;
	draggedOffestY = 0;

	removeEventListeners = [];

	init() {
		this.manually();
	}

	start() {
		const { player, opponent } = this.app;

		opponent.clear();
		player.removeAllShots();
		player.ships.forEach((ship) => (ship.killed = false));

		this.removeEventListeners = [];

		document
			.querySelectorAll(".app-actions")
			.forEach((element) => element.classList.add("hidden"));

		document
			.querySelector('[data-scene="preparation"]')
			.classList.remove("hidden");

		const manuallyButton = document.querySelector('[data-action="manually"]');
		const randomizeButton = document.querySelector('[data-action="randomize"]');
		const aiButton = document.querySelector('[data-computer="AI"]');
		const randomButton = document.querySelector('[data-type="random"]');

		this.removeEventListeners.push(
			addListener(manuallyButton, "click", () => this.manually())
		);

		this.removeEventListeners.push(
			addListener(randomizeButton, "click", () => this.placementByValue())
		);

		this.removeEventListeners.push(
			addListener(aiButton, "click", () => this.startComputerByValue())
		)

		this.removeEventListeners.push(
			addListener(randomButton, "click", () =>
				this.app.start("online", "random")
			)
		);
	}

	stop() {
		for (const removeEventListener of this.removeEventListeners) {
			removeEventListener();
		}

		this.removeEventListeners = [];
	}

	update() {
		const { mouse, player } = this.app;

		// Потенциально хотим начать тянуть корабль
		if (!this.draggedShip && mouse.left && !mouse.pLeft) {
			const ship = player.ships.find((ship) => ship.isUnder(mouse));

			if (ship) {
				const shipRect = ship.div.getBoundingClientRect();

				this.draggedShip = ship;
				this.draggedOffsetX = mouse.x - shipRect.left;
				this.draggedOffsetY = mouse.y - shipRect.top;

				ship.x = null;
				ship.y = null;
			}
		}

		// Перетаскивание
		if (mouse.left && this.draggedShip) {
			const { left, top } = player.root.getBoundingClientRect();
			const x = mouse.x - left - this.draggedOffsetX;
			const y = mouse.y - top - this.draggedOffsetY;

			this.draggedShip.div.style.left = `${x}px`;
			this.draggedShip.div.style.top = `${y}px`;
		}

		// Бросание
		if (!mouse.left && this.draggedShip) {
			const ship = this.draggedShip;
			this.draggedShip = null;

			const { left, top } = ship.div.getBoundingClientRect();
			const { width, height } = player.cells[0][0].getBoundingClientRect();

			const point = {
				x: left + width / 2,
				y: top + height / 2,
			};

			const cell = player.cells
				.flat()
				.find((cell) => isUnderPoint(point, cell));

			if (cell) {
				const x = parseInt(cell.dataset.x);
				const y = parseInt(cell.dataset.y);

				player.removeShip(ship);
				player.addShip(ship, x, y);
			} else {
				player.removeShip(ship);
				player.addShip(ship);
			}
		}

		// Врощаение
		if (this.draggedShip && mouse.delta) {
			this.draggedShip.toggleDirection();
		}

		if (player.complete) {
			document.querySelector('[data-computer="AI"]').disabled = false;
			document.querySelector('[data-type="random"]').disabled = false;
		} else {
			document.querySelector('[data-computer="AI"]').disabled = true;
		}
	}

	randomize() {
		const { player } = this.app;

		player.randomize(ShipView);

		this.setStartCord(player)
	}

	borders() {
		const { player } = this.app;
		let a = true
		while (a) {
			console.log("v")
			player.borders(ShipView);
			a = false
			for (let i = 0; i < 10; i++) {
				const ship = player.ships[i];
				if (ship.x == null) {
					a = true
				}
			}
		}

		this.setStartCord(player)
	}

	diagonal() {
		const { player } = this.app;

		player.diagonal(ShipView);

		this.setStartCord(player)
	}

	setStartCord(player) {
		for (let i = 0; i < 10; i++) {
			const ship = player.ships[i];

			ship.startX = shipDatas[i].startX;
			ship.startY = shipDatas[i].startY;
		}
	}

	manually() {
		const { player } = this.app;

		player.removeAllShips();

		for (const { size, direction, startX, startY } of shipDatas) {
			const ship = new ShipView(size, direction, startX, startY);
			player.addShip(ship);
		}
	}

	placementByValue() { //в зависимости от выбора radio расстанавливаем
		let radios = document.getElementsByName('ship-placement');
		let val ="";
		for (let i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
				val = radios[i].value;
				break;
			}
		}
		switch (val) {
			case "2":
				this.borders();
				break;

			case "3":
				this.diagonal();
				break;

			default:
				this.randomize();
				break;
		}
	}

	startComputerByValue() { //в зависимости от выбора radio выбираем сложность
		let radios = document.getElementsByName('difficult-level');
		let val ="";
		for (let i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
				val = radios[i].value;
				break;
				}
		}	
		switch (val) {
			case "2":
				this.startComputer("middle");
				break;
			
			case "3":
				this.startComputer("hard");
				break;

			default:
				this.startComputer("simple");
				break;
		}
	}

	startComputer(level) {
		let firstCells = [];
		let smartAttack = true;

		if (level === "simple") {
			smartAttack = false;
		} else if (level === "hard") {
			for (let y = 0; y < 10; y++) {
				for (let x = 0; x < 10; x++) {
					if (x === y || x === 9 - y) {
						firstCells.push({ x, y });
					}
				}
			}
		}

		this.app.start("computer", firstCells, smartAttack);
	}
}
