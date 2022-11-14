class BotAI {
    runningCell = null; //текущая ячейка
    shipCell = null;    //ячейка, в которой запоминается положение первого попадания по кораблю
    dir = null;         //направление
    field = null;       //поле, по которому стреляем
    firstCells = [];    //ячейки, обстреливаемые в первую очередь

    constructor(field, firstCells) {
        this.field = field;
        this.firstCells = firstCells;
    }

    checkAroundByDir() { //обстрел соседних клеток по направлению
        var nx = this.runningCell.getX();
        var ny = this.runningCell.getY();
        if (this.dir === "right") {
            if (!this.checkCell(nx + 1, ny)) {
                nx++;
            } else {
                this.dir = "left";
                this.runningCell = this.shipCell;
                return this.checkAroundByDir();
            }
        } else if (this.dir === "up") {
            if (!this.checkCell(nx, ny + 1)) {
                ny++;
            } else {
                this.dir = "down";
                this.runningCell = this.shipCell;
                return this.checkAroundByDir();
            }
        } else if (this.dir === "left") {
            nx--;
        } else if (this.dir === "down") {
            ny--;
        }
        this.runningCell = new FieldCell(nx, ny);
        if (!this.checkCell(nx, ny)) { //фиксируем попадание, если возможно (можно без if, но на всякий...)
            this.addShot(this.runningCell);
        }
        if (this.field.checkShipIsKilled(nx, ny)) { //убит ли корабль
            this.dir = null;        //если да, то направление - null и клетка корабля - пуста
            this.shipCell = null;
        }
        return this.field.checkShip(nx, ny); //было ли попадание или нет
    }

    checkAround() { //поиск направления (как и пред. функция, но направление мы не знаем)
        var nx = this.runningCell.getX();
        var ny = this.runningCell.getY();
        let changed = false;
        if (!this.checkCell(nx + 1, ny)) {
            nx++;
            if (this.field.checkShip(nx, ny)) {
                this.dir = "right";
                changed = true;
            }
        } else if (!this.checkCell(nx - 1, ny)) {
            nx--;
            if (this.field.checkShip(nx, ny)) {
                this.dir = "left";
                changed = true;
            }
        } else if (!this.checkCell(nx, ny + 1)) {
            ny++;
            if (this.field.checkShip(nx, ny)) {
                this.dir = "up";
                changed = true;
            }
        } else if (!this.checkCell(nx, ny - 1)) {
            ny--;
            if (this.field.checkShip(nx, ny)) {
                this.dir = "down";
                changed = true;
            }
        }
        this.runningCell = new FieldCell(nx, ny);
        if (!this.field.checkShot(nx, ny)) {
            this.addShot(this.runningCell);
        }
        if (this.field.checkShipIsKilled(nx, ny)) {
            this.dir = null;
            this.shipCell = null;
        }
        return changed;
    }

    isKilledShipsNear(cx, cy) { //поиск убитых кораблей в соседних клетках (бот типа умный дофига, в такие клетки не стреляет)
        for (let y = cy - 1; y <= cy + 1; y++) {
            for (let x = cx - 1; x <= cx + 1; x++) {
                if (x < 0 || y < 0 || x > 9 || y > 9) {
                    break;
                }
                if (this.field.checkShipIsKilled(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    atack() {
        if (this.shipCell === null) { //случай, если нет корабля
            do {
                if (this.firstCells != null && this.firstCells.length > 0) {
                    const item = this.firstCells.pop();
                    this.runningCell = new FieldCell(item.x, item.y);
                } else {
                    this.runningCell = this.getRandomCell();
                }
            } while (this.checkCell(this.runningCell.getX(), this.runningCell.getY()) || 
                    this.isKilledShipsNear(this.runningCell.getX(), this.runningCell.getY())); //добыча координат для атаки
            
            this.addShot(this.runningCell);

            if (!this.field.checkShip(this.runningCell.getX(), this.runningCell.getY())) { //клетка пуста
                this.shipCell = null; //все по нулям на всякий
                this.dir = null;
                return false; //промазал, выход из функции
            } else { //на клетке корабль
                if (this.field.checkShipIsKilled(this.runningCell.getX(), this.runningCell.getY())) {
                    this.shipCell = null;
                    this.dir = null;
                    return true; //если вдруг по однопалубному попали
                }
                this.shipCell = this.runningCell; //запоминаем относительное положение корабля
                return true;
            }
        } else { //мы знаем, где примерно корабль
            if (this.dir === null) {
                this.runningCell = this.shipCell;
                return this.checkAround(); //не знаем направление - значит ищем
            } else { //иначе
                if (this.checkAroundByDir()) {
                    return true; //попали - крут
                } else { //не попали, значит не то направление
                    if (this.dir === "right") {
                        this.dir = "left";
                    } else if (this.dir === "up") {
                        this.dir = "down";
                    }
                    return false; //вот так
                }
            }
        }
    }

    addShot(cell) { //добавить попадание на поле
        const shot = new ShotView(cell.getX(), cell.getY());
		this.field.addShot(shot);
    }

    getRandomCell() { //получить рандомну клетку
        return new FieldCell(getRandomBetween(0, 9), getRandomBetween(0, 9));
    }

    checkCell(x, y) { //проверить, была ли клетка под атакой
        if (x < 0 || y < 0 || x > 9 || y > 9) {
            return true;
        }
        return this.field.checkShot(x, y);
    }
}

class FieldCell { //а это я из джавы взял, мб без него можно обойтись
    x = null;
    y = null; 

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }
    
    getY() {
        return this.y;
    }

    setCords(x, y) {
        this.x = x;
        this.y = y;
    }
}