class Battlefield {
	ships = [];
	shots = [];

	_private_matrix = null;
	_private_changed = true;

	diagonalForribden = false

	get loser() {
		for (const ship of this.ships) {
			if (!ship.killed) {
				return false;
			}
		}

		return true;
	}

	get matrix() {
		if (!this._private_changed) {
			this._private_matrix;
		}

		const matrix = [];

		for (let y = 0; y < 10; y++) {
			const row = [];

			for (let x = 0; x < 10; x++) {
				const item = {
					x,
					y,
					ship: null,
					free: true,

					shoted: false,
					wounded: false,
				};

				if (this.diagonalForribden && (x === y || 9 - x === y)) {
					item.free = false;
				}

				row.push(item);
			}

			matrix.push(row);
		}

		for (const ship of this.ships) {
			if (!ship.placed) {
				continue;
			}

			const { x, y } = ship;
			const dx = ship.direction === "row";
			const dy = ship.direction === "column";

			for (let i = 0; i < ship.size; i++) {
				const cx = x + dx * i;
				const cy = y + dy * i;

				const item = matrix[cy][cx];
				item.ship = ship;
			}

			for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++) {
				for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++) {
					if (this.inField(x, y)) {
						const item = matrix[y][x];
						item.free = false;
					}
				}
			}
		}

		for (const { x, y } of this.shots) {
			const item = matrix[y][x];
			item.shoted = true;

			if (item.ship) {
				item.wounded = true;
			}
		}

		this._private_matrix = matrix;
		this._private_changed = false;

		return this._private_matrix;
	}

	get complete() {
		if (this.ships.length !== 10) {
			return false;
		}

		for (const ship of this.ships) {
			if (!ship.placed) {
				return false;
			}
		}

		return true;
	}

	inField(x, y) {
		const isNumber = (n) =>
			parseInt(n) === n && !isNaN(n) && ![Infinity, -Infinity].includes(n);

		if (!isNumber(x) || !isNumber(y)) {
			return false;
		}

		return 0 <= x && x < 10 && 0 <= y && y < 10;
	}

	addShip(ship, x, y) {
		if (this.ships.includes(ship)) {
			return false;
		}

		this.ships.push(ship);

		if (this.inField(x, y)) {
			const dx = ship.direction === "row";
			const dy = ship.direction === "column";

			let placed = true;

			for (let i = 0; i < ship.size; i++) {
				const cx = x + dx * i;
				const cy = y + dy * i;

				if (!this.inField(cx, cy)) {
					placed = false;
					break;
				}

				const item = this.matrix[cy][cx];
				if (!item.free) {
					placed = false;
					break;
				}
			}

			if (placed) {
				Object.assign(ship, { x, y });
			}
		}

		this._private_changed = true;
		return true;
	}

	removeShip(ship) {
		if (!this.ships.includes(ship)) {
			return false;
		}

		const index = this.ships.indexOf(ship);
		this.ships.splice(index, 1);

		ship.x = null;
		ship.y = null;

		this._private_changed = true;
		return true;
	}

	removeAllShips() {
		const ships = this.ships.slice();

		for (const ship of ships) {
			this.removeShip(ship);
		}

		return ships.length;
	}

	addShot(shot) {
		for (const { x, y } of this.shots) {
			if (x === shot.x && y === shot.y) {
				return false;
			}
		}

		this.shots.push(shot);
		this._private_changed = true;

		const matrix = this.matrix;
		const { x, y } = shot;

		if (matrix[y][x].ship) {
			shot.setVariant("wounded");

			const { ship } = matrix[y][x];
			const dx = ship.direction === "row";
			const dy = ship.direction === "column";

			let killed = true;

			for (let i = 0; i < ship.size; i++) {
				const cx = ship.x + dx * i;
				const cy = ship.y + dy * i;
				const item = matrix[cy][cx];

				if (!item.wounded) {
					killed = false;
					break;
				}
			}

			if (killed) {
				ship.killed = true;

				for (let i = 0; i < ship.size; i++) {
					const cx = ship.x + dx * i;
					const cy = ship.y + dy * i;

					const shot = this.shots.find(
						(shot) => shot.x === cx && shot.y === cy
					);
					shot.setVariant("killed");
				}
			}
		}

		this._private_changed = true;
		return true;
	}

	removeShot(shot) {
		if (!this.shots.includes(shot)) {
			return false;
		}

		const index = this.shots.indexOf(shot);
		this.shots.splice(index, 1);

		this._private_changed = true;
		return true;
	}

	removeAllShots() {
		const shots = this.shots.slice();

		for (const shot of shots) {
			this.removeShot(shot);
		}

		return shots.length;
	}

	randomize(ShipClass = Ship) {
		this.diagonalForribden = false
		this.randomPlacement(ShipClass)
	}

	borders(ShipClass = Ship) {
		this.diagonalForribden = false
		do {
			this.removeAllShips();

			let sizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
			let coord = 0
			let row = true
			for (let i = 0; i < 4; i++) {
				while (coord < 9) {
					let size = getRandomFromArray(sizes)
					if (size === undefined) break;
					const direction = row ? "row" : "column";
					const ship = new ShipClass(size, direction)

					if (size + coord <= 9) {
						switch (i) {
							case 0:
								this.addShip(ship, coord, 0)
								sizes = removeFromArray(sizes, size)
								break;
							case 1:
								this.addShip(ship, 9, coord)
								sizes = removeFromArray(sizes, size)
								break;
							case 2:
								this.addShip(ship, coord, 9)
								sizes = removeFromArray(sizes, size)
								break;
							case 3:
								coord += 2
								this.addShip(ship, 0, coord)
								sizes = removeFromArray(sizes, size)
								break
							default:
								alert( "Нет таких значений" );
						}
					}
					coord += size + 1

				}
				coord = 0
				row = !row
			}
		} while (!this.checkShipsSpawnedRight())
	}

	diagonal(ShipClass = Ship) {
		this.diagonalForribden = true
		this.randomPlacement(ShipClass)
		this.diagonalForribden = false
	}

	randomPlacement(ShipClass = Ship) {
		this.removeAllShips();

		for (let size = 4; size >= 1; size--) {
			for (let n = 0; n < 5 - size; n++) {
				const direction = getRandomFrom("row", "column");
				const ship = new ShipClass(size, direction);

				while (!ship.placed) {
					const x = getRandomBetween(0, 9);
					const y = getRandomBetween(0, 9);

					this.removeShip(ship);
					this.addShip(ship, x, y);
				}
			}
		}
	}

	clear() {
		this.removeAllShots();
		this.removeAllShips();
	}

	//Это для ИИ
	/////////////////////////////////////////////////////////
	checkShipIsKilled(x, y) { //убит корабль по данным координатам или нет
		const matrix = this.matrix;
		if (!matrix[y][x].ship) {
			return false;
		}

		const { ship } = matrix[y][x];
		const dx = ship.direction === "row";
		const dy = ship.direction === "column";

		let killed = true;

		for (let i = 0; i < ship.size; i++) {
			const cx = ship.x + dx * i;
			const cy = ship.y + dy * i;
			const item = matrix[cy][cx];

			if (!item.wounded) {
				killed = false;
				break;
			}
		}

		return killed;
	}

	checkShip(x, y) { //есть ли корабль по данным координатам
		const matrix = this.matrix;
		return matrix[y][x].ship;
	}

	checkShot(sx, sy) { //есть ли попадание по данным координатам
		if (sx < 0 || sy < 0 || sx > 9 || sy > 9) {
            return false;
        }
		for (const { x, y } of this.shots) {
			if (sx === x && sy === y) {
				return true;
			}
		}
		return false;
	}
	/////////////////////////////////////////////////////////

	checkShipsSpawnedRight() {
		if (this.ships.length !== 10) {
			return false
		}
		for (let i = 0; i < this.ships.length; i++) {
			if (this.ships[i].x === null ||
				this.ships[i].y === null ||
				this.ships[i].direction === null
			) {
				return false
			}
		}
		return true
	}
}
