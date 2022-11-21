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

let modal = document.getElementById('modalWindow');
let btn = document.getElementById('aboutButton');
let close = document.getElementsByClassName('close')[0];

btn.onclick = function() {
	modal.style.display = "block";
}

close.onclick = function() {
	modal.style.display = "none";
}

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}