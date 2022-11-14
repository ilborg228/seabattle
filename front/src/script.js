const app = new Application({
	preparation: PreparationScene,
	computer: ComputerScene,
	online: OnlineScene,
});

app.start("preparation");


//Read Json from file
function onChange(event) {
	var reader = new FileReader();
	reader.onload = onReaderLoad;
	reader.readAsText(event.target.files[0]);
}
function onReaderLoad(event){
	var obj = JSON.parse(event.target.result);
	console.log(obj);
}
document.getElementById('file-selector').addEventListener('change', onChange);

function load() {
	const { player } = app;

	player.removeAllShips();

	for (const { size, direction, startX, startY } of shipDatas) {
		const ship = new ShipView(size, direction, startX, startY);
		player.addShip(ship);
	}
}