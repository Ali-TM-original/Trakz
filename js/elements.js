const StartButton = document.querySelector("#startbutton");
const helpbutton = document.querySelector("#rulebutton");
const helpclosebutton = document.querySelector("#helpclose");
const NameInput = document.querySelector("#nameinput");
const overlay = document.querySelector("#myNav");
const MenuContainer = document.querySelector("#menu");
const EasyButton = document.querySelector("#easybtn");
const HardButton = document.querySelector("#hardbtn");
const gameContainer = document.querySelector("#gamecontainer");
const namecontainer = document.querySelector("#namecontainer");
const timer = document.querySelector("#timer");
const leaderBoard = document.querySelector("#leaderboard");
const leaderboardlist = document.querySelector("#leaderboard-list");
const leaderboardbtn = document.querySelector('#leaderboard-btn');
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext('2d');
const tileOptions = document.querySelectorAll('.tile-option');
const endGame = document.querySelector('#endgame');
const newgamebtn = document.querySelector('#new-game-btn');

export {
    StartButton,
    helpbutton,
    NameInput,
    MenuContainer,
    EasyButton,
    HardButton,
    gameContainer,
    namecontainer,
    timer,
    canvas,
    context,
    overlay,
    helpclosebutton,
    tileOptions,
    leaderBoard,
    leaderboardlist,
    leaderboardbtn,
    endGame,
    newgamebtn,
}