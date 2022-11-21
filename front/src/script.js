const app = new Application({
	preparation: PreparationScene,
	computer: ComputerScene,
	online: OnlineScene,
});

app.start("preparation");

let isPlaying = false
let audio = null
function playMusic() {
	if (!isPlaying) {
		audio = new Audio('audio.mp3')
		audio.play().then(r => isPlaying = true)
		audio.addEventListener('ended', (ev) =>{
			console.log("ended")
			audio.play()
		})
	} else {
		audio.pause()
		audio.currentTime = 0
		isPlaying = false
	}
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