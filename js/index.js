import { SplashScreen } from './screens/Menu.js';
import { HideLeaderBoard } from './utils/utils.js';
import { menubtn } from './elements.js';


menubtn.addEventListener("click", (e) => {
    HideLeaderBoard();
})

SplashScreen();