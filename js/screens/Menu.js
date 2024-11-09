import { StartButton, NameInput, MenuContainer, EasyButton, HardButton, gameContainer, helpbutton, overlay, helpclosebutton } from "../elements.js";
import { getRandomLevel } from "../data/data.js";
import { StartGame } from "./Game.js";

let difficulty = "easy";

const SplashScreen = () => {
    setTimeout(() => {
        document.getElementById("splash").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("splash").style.display = "none";
        }, 1000);
    }, 3000);
}

StartButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (NameInput.value.trim() === "") {
        NameInput.style.animation = "none"; // Temporarily remove the animation
        setTimeout(() => {
            NameInput.style.animation = "shake 0.4s linear"; // Re-add the animation
        }, 0); // Use a 0ms timeout to force the reflow

    } else {
        // NameInput.value
        MenuContainer.style.display = "none";
        gameContainer.style.display = "flex";
        StartGame(NameInput.value, getRandomLevel(difficulty));
    }

});

helpbutton.addEventListener("click", (e) => {
    e.preventDefault();
    overlay.style.width = "100%";

});

helpclosebutton.addEventListener("click", (e) => {
    e.preventDefault();
    overlay.style.width = "0%";

});



EasyButton.addEventListener("click", (e) => {
    e.preventDefault();
    difficulty = "easy";
    HardButton.classList.remove("selected");
    EasyButton.classList.add("selected");

})

HardButton.addEventListener("click", (e) => {
    e.preventDefault();
    difficulty = "hard";
    HardButton.classList.add("selected");
    EasyButton.classList.remove("selected");

})

export {

    SplashScreen
}