const app = new Application({
	preparation: PreparationScene,
	computer: ComputerScene,
	online: OnlineScene,
});

app.start("preparation");

let placement = null;

//Read Json from file
function onChange(event) {
	let reader = new FileReader();
	reader.onload = onReaderLoad;
	reader.readAsText(event.target.files[0]);
}
function onReaderLoad(event){
	placement = JSON.parse(event.target.result);
	console.log(placement);
}
document.getElementById('file-selector').addEventListener('change', onChange);

function load() {
	const { player } = app;

	player.removeAllShips();

	for (const { size, direction, x, y } of placement) {
		const ship = new ShipView(size, direction, x, y);
		player.addShip(ship);
	}
}