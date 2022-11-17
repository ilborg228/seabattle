const app = new Application({
	preparation: PreparationScene,
	computer: ComputerScene,
	online: OnlineScene,
});

app.start("preparation");

let isPlaying = false;
function playMusic() {
	let audio = new Audio('audio.mp3');
	audio.play();
}