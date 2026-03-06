
const musicSlider = document.getElementById("musicControl");
const soundSlider = document.getElementById("soundControl");
const brightnessSlider = document.getElementById("brightnessControl");

const music = document.getElementById("musicPlayer");
const soundEffect = document.getElementById("soundEffect");
const background = document.getElementById("background");


music.volume = 0.5;
music.play();


musicSlider.addEventListener("input", () => {
    music.volume = musicSlider.value / 100;
});


soundSlider.addEventListener("input", () => {
    soundEffect.volume = soundSlider.value / 100;
    soundEffect.play();
});


brightnessSlider.addEventListener("input", () => {
    const level = brightnessSlider.value;
    background.style.filter = `brightness(${level}%)`;
});



        
   function goBack() {
            window.history.back();
        }
function openMenu() { alert("Open Menu"); }


