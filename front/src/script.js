const app = new Application({
	preparation: PreparationScene,
	computer: ComputerScene,
	online: OnlineScene,
});

app.start("preparation");

let musicButton = document.getElementById('music-btn');

let isPlaying = false
let audio = null
function playMusic() {
	if (!isPlaying) {
		musicButton.className = "audio-button";
		audio = new Audio('audio.mp3')
		audio.play().then(r => isPlaying = true)
		audio.addEventListener('ended', (ev) =>{
			console.log("ended")
			audio.play()
		})
	} else {
		musicButton.className = "audio-off-button";
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

let sfxButton = document.getElementById('sfx-btn');
let sfxOn = true;

function onOffSfx() {
	if (sfxOn) {
		sfxButton.className = "sfx-off-button";
	} else {
		sfxButton.className = "sfx-button";
	}
 	sfxOn = !sfxOn;
}

function isSfxPlaying() {
	return sfxOn;
}