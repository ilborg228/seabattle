class ComputerScene extends Scene {
	playerTurn = true;
	status = null;
	removeEventListeners = [];
	bot = null; //тут поле для ИИ
	smartAttack = true; //будет ли добивание
	isShown = false //

	init() {
		this.status = document.querySelector(".battlefield-status");
	}

	start(firstCells, smartAttack) {
		const { socket, player, opponent } = this.app;
		this.smartAttack = smartAttack;
		const BotClass = BotAI;
		if (smartAttack) {
			this.bot = new BotClass(player, firstCells);
		}

		document
			.querySelectorAll(".app-actions")
			.forEach((element) => element.classList.add("hidden"));

		document
			.querySelector('[data-scene="computer"]')
			.classList.remove("hidden");

		opponent.clear();
		opponent.randomize(ShipView);

		this.removeEventListeners = [];

		const gaveupButton = document.querySelector('[data-action="gaveup"]');
		const againButton = document.querySelector('[data-action="again"]');

		gaveupButton.classList.remove("hidden");
		againButton.classList.add("hidden");

		this.removeEventListeners.push(
			addListener(gaveupButton, "click", () => {
				socket.emit("gaveup", "offline");
				this.app.start("preparation");
			})
		);

		this.removeEventListeners.push(
			addListener(againButton, "click", () => {
				this.isShown = false
				this.app.start("preparation");
			})
		);
	}

	stop() {
		for (const removeEventListener of this.removeEventListeners) {
			removeEventListener();
		}

		this.removeEventListeners = [];
	}

	updateStat(socket, win) {
		if (!this.isShown) {
			if (win)
				socket.emit("win")
			else
				socket.emit("lose")
			this.isShown = true
		}
	}

	update() {
		const { socket, mouse, opponent, player } = this.app;

		const isEnd = opponent.loser || player.loser;

		const cells = opponent.cells.flat();
		cells.forEach((cell) => cell.classList.remove("battlefield-item__active"));

		if (isEnd) {
			if (opponent.loser) {
				this.status.textContent = "Вы выиграли!";
				this.updateStat(socket,true)
			} else {
				this.status.textContent = "Вы проиграли ((";
				this.updateStat(socket,false)
			}

			document.querySelector('[data-action="gaveup"]').classList.add("hidden");

			document.querySelector('[data-action="again"]').classList.remove("hidden");

			return;
		}

		if (isUnderPoint(mouse, opponent.table)) {
			const cell = cells.find((cell) => isUnderPoint(mouse, cell));

			if (cell) {
				cell.classList.add("battlefield-item__active");

				if (this.playerTurn && mouse.left && !mouse.pLeft) {
					const x = parseInt(cell.dataset.x);
					const y = parseInt(cell.dataset.y);

					const shot = new ShotView(x, y);
					const result = opponent.addShot(shot);

					if (result) {
						this.playerTurn = shot.variant === "miss" ? false : true;
					}
				}
			}
		}

		if (!this.playerTurn) {
			if (!this.smartAttack) { //если не думает над атакой, то как было оставляем
				const x = getRandomBetween(0, 9);
				const y = getRandomBetween(0, 9);

				const shot = new ShotView(x, y);
				const result = player.addShot(shot);

				if (result) {
					this.playerTurn = shot.variant === "miss";
				}
			} else { //иначе обращаемся к ИИ
				this.playerTurn = !this.bot.atack();
			}
		}

		if (this.playerTurn) {
			this.status.textContent = "Ваш ход:";
		} else {
			this.status.textContent = "Ход комьютера:";
		}
	}
}
