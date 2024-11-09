import { canvas, context, namecontainer, timer, tileOptions, leaderboardbtn, gameContainer, newgamebtn, MenuContainer } from "../elements.js";
import { isConnected, checkArrays, ShowGameOverScreen, ShowLeaderBoard, HideGameOverScreen } from "../utils/utils.js";


window.onload = () => {
    window.requestAnimationFrame(updateAll);
}

let DefaultMap;
let loaded = false;
let pname;
let gameMap = [[]];
let SelectedTile = 1;
let rotationSteps = 0; // Cycle through 0, 1, 2, 3
let intervalId;


const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const tileImages = {
    1: new Image(),
    2: new Image(),
    3: new Image(),
    4: new Image(),
    5: new Image(),
    6: new Image(),
    7: new Image(),
    8: new Image(),
    9: new Image(),
};


// Set the source for each tile image
tileImages[1].src = '/Trakz/assets/empty.svg';
tileImages[2].src = '/Trakz/assets/bridge.svg';
tileImages[3].src = '/Trakz/assets/mountain.svg';
tileImages[4].src = '/Trakz/assets/oasis.svg';
tileImages[5].src = '/Trakz/assets/bridge_rotated.svg'
tileImages[6].src = '/Trakz/assets/straight_rail.svg'; // number 6 // rotated -> 61, 62, 63, 64
tileImages[7].src = '/Trakz/assets/curve_rail.svg'; // number 7 // rotated -> 71, 72, 73 
tileImages[8].src = '/Trakz/assets/mountain_rail.svg'; // number 8 // rotated -> 81, 82, 83
tileImages[9].src = '/Trakz/pics/tiles/bridge_rail.png'; // number 9 // rotated -> 91, 92, 93


const loadImages = Promise.all(
    Object.values(tileImages).map(img => {
        return new Promise(resolve => {
            img.onload = resolve;
        });
    })
);

const updateAll = () => {
    window.requestAnimationFrame(updateAll);
}

const DrawStraight = (ctx, img, value, x, y, cellSize) => {
    if (value === 6 || value === 7 || value == 8 || value == 9) {
        ctx.drawImage(img, x, y, cellSize, cellSize);
        return true;
    } else if (value === 61 || value === 71 || value == 81 || value == 91) {
        ctx.translate(x + cellSize / 2, y + cellSize / 2);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
        return true;
    } if (value === 62 || value === 72 || value == 82 || value == 92) {
        ctx.translate(x + cellSize / 2, y + cellSize / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
        return true;
    } if (value === 63 || value === 73 || value == 83 || value == 93) {
        ctx.translate(x + cellSize / 2, y + cellSize / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
        return true;
    }
    return false
}

const drawMap = (ctx, arr) => {
    // Ensure cells are square by taking the minimum of width and height per cell
    const cellWidth = canvasWidth / arr[0].length;
    const cellHeight = canvasHeight / arr.length;
    const cellSize = Math.min(cellWidth, cellHeight); // Square cell size

    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas before drawing

    for (let row = 0; row < arr.length; row++) {
        for (let col = 0; col < arr[row].length; col++) {
            const value = arr[row][col];
            let img = tileImages[value];
            ctx.save();

            if (value === 31 || value === 32 || value === 33) {
                img = tileImages[3];
            }
            if (value === 61 || value === 62 || value === 63) {
                img = tileImages[6];
            }
            if (value === 71 || value === 72 || value === 73) {
                img = tileImages[7];
            }
            if (value === 81 || value === 82 || value === 83) {
                img = tileImages[8];
            }
            if (value === 91 || value === 92 || value === 93) {
                img = tileImages[9];
            }
            const x = col * cellSize;
            const y = row * cellSize;

            if (value === 31) {
                ctx.translate(x + cellSize / 2, y + cellSize / 2);
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
            } else if (value === 32) {
                ctx.translate(x + cellSize / 2, y + cellSize / 2);
                ctx.rotate(Math.PI);
                ctx.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
            } else if (value === 33) {
                ctx.translate(x + cellSize / 2, y + cellSize / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
            } else if (!DrawStraight(ctx, img, value, x, y, cellSize)) {
                ctx.drawImage(img, x, y, cellSize, cellSize);
            }
            ctx.restore();
        }
    }
};


const getTileCoordinates = (x, y, map) => {
    const cw = canvas.getBoundingClientRect().width;
    const ch = canvas.getBoundingClientRect().height;

    const cellWidth = cw / map[0].length;
    const cellHeight = ch / map.length;


    // Adjust for exact bounding by clamping values to avoid off-by-one errors
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    return [row, col];
};

// Was picked from github of a game forgot the repo
const shakeCanvas = (context, canvas, intensity = 5, duration = 300) => {
    const originalTransform = context.getTransform(); // Save the original canvas transform
    const startTime = performance.now();

    function animateShake(time) {
        const elapsed = time - startTime;

        if (elapsed < duration) {
            const progress = elapsed / duration;
            const magnitude = intensity * (1 - progress); // Diminish the shake over time

            // Random offset to create shake effect
            const offsetX = (Math.random() * 2 - 1) * magnitude;
            const offsetY = (Math.random() * 2 - 1) * magnitude;

            // Clear the canvas and apply shake transformation
            context.setTransform(1, 0, 0, 1, offsetX, offsetY);
            context.clearRect(-offsetX, -offsetY, canvas.width, canvas.height);

            // Redraw your canvas content here (your game elements, background, etc.)
            drawMap(context, gameMap)

            // Continue shaking
            requestAnimationFrame(animateShake);
        } else {
            // Reset to the original transform after shaking
            context.setTransform(originalTransform);
            drawMap(context, gameMap)
        }
    }

    requestAnimationFrame(animateShake);
}

const EnsureRailPlaement = (row, col) => {
    if (DefaultMap[row][col] === 4) {
        console.log("Cannot Place Tile");
        shakeCanvas(context, canvas);
        return false;
    }

    // For The
    if ((DefaultMap[row][col] == 2 || DefaultMap[row][col] == 5) && SelectedTile != 4) {
        console.log("This Rail Cannot be placed here");
        shakeCanvas(context, canvas);
        return false;
    }

    // ensures Rail 3 can only be placed on 31 32 33 and 3
    if ((DefaultMap[row][col] === 3 || DefaultMap[row][col] === 31 || DefaultMap[row][col] === 32 || DefaultMap[row][col] === 33) && SelectedTile !== 3) {
        console.log("This Rail Cannot be placed here");
        shakeCanvas(context, canvas);
        return false;
    }

    // ensure Rail 1 and 2 can only be placed on 1
    if (DefaultMap[row][col] === 1 && (SelectedTile === 3 || SelectedTile === 4)) {
        console.log("This Rail Cannot be placed here");
        shakeCanvas(context, canvas);
        return false;
    }

    if (SelectedTile === 3) {
        if (DefaultMap[row][col] === 31 && rotationSteps !== 1) {
            console.log("Cannot Place Rail Here");
            shakeCanvas(context, canvas);
            return false;
        } else if (DefaultMap[row][col] === 32 && rotationSteps !== 2) {
            console.log("Cannot Place Rail Here");
            shakeCanvas(context, canvas);
            return false;
        } else if (DefaultMap[row][col] === 33 && rotationSteps !== 3) {
            console.log("Cannot Place Rail Here");
            shakeCanvas(context, canvas);
            return false;
        }
    }

    return true;
}


canvas.addEventListener('click', (event) => {
    let tile = 5 + SelectedTile;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const [row, col] = getTileCoordinates(x, y, gameMap);


    // Nothing can be placed on pond

    if (!EnsureRailPlaement(row, col)) {
        return;
    }

    // For Tile 3
    if (DefaultMap[row][col] >= 31 && DefaultMap[row][col] <= 33) {
        tile = (tile * 10) + rotationSteps;
    }

    // For Tile 4
    if (DefaultMap[row][col] === 2 && SelectedTile === 4) {

        // on 2 only straight can be placed
        if (rotationSteps !== 0) {
            console.log("This Rail Cannot be placed here from tile 4");
            shakeCanvas(context, canvas);
            return;
        }

        if (rotationSteps !== 0) {
            tile = tile * 10;
            tile += rotationSteps;
        }
    }
    // For Tile 5
    if (DefaultMap[row][col] === 5 && SelectedTile === 4) {
        console.log(rotationSteps);
        // on 2 only straight can be placed
        if (rotationSteps === 0 || rotationSteps === 2) {
            console.log("This Rail Cannot be placed here");
            shakeCanvas(context, canvas);
            return;
        }

        if (rotationSteps !== 0) {
            tile = tile * 10;
            tile += rotationSteps;
        }
    }

    // For Tile 1 and 2 
    if (DefaultMap[row][col] === 1 && (SelectedTile === 1 || SelectedTile === 2)) {
        if (rotationSteps !== 0) {
            tile = tile * 10;
            tile += rotationSteps;
        }
    }

    gameMap[row][col] = tile;
    drawMap(context, gameMap);
    if (checkArrays(gameMap, DefaultMap)) {
        if (isConnected(gameMap)) {
            clearInterval(intervalId);
            localStorage.setItem(pname, JSON.stringify(timer.textContent));
            ShowGameOverScreen();
        }
    };
});
// Go Back to Default Tile
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const [row, col] = getTileCoordinates(x, y, DefaultMap);
    gameMap[row][col] = DefaultMap[row][col];
    drawMap(context, gameMap);

});

window.addEventListener('keydown', (event) => {
    if (event.key === 'R' || event.key === 'r') {
        rotationSteps = (rotationSteps + 1) % 4; // Cycle through 0, 1, 2, 3
        const selectedTile = document.querySelector('.selected-tile');

        if (rotationSteps == 0) {
            selectedTile.classList.remove('rotated'); // Remove rotation 360,0
            selectedTile.classList.remove('rotatedtwice'); // Remove rotation 360,0
            selectedTile.classList.remove('rotatedthrice'); // Remove rotation 360,0
        }

        if (rotationSteps == 1) {
            selectedTile.classList.add('rotated'); // Add rotation 90
        }
        if (rotationSteps == 2) {
            selectedTile.classList.add('rotatedtwice'); // Add rotation 180
            selectedTile.classList.remove('rotated'); // Remove rotation 360,0
        }
        if (rotationSteps == 3) {
            selectedTile.classList.add('rotatedthrice'); // Add rotation 270
            selectedTile.classList.remove('rotatedtwice'); // Remove rotation 360,0
            selectedTile.classList.remove('rotated'); // Remove rotation 360,0
        }
    }

});

leaderboardbtn.addEventListener('click', e => {
    e.preventDefault();
    gameContainer.style.display = 'none';
    ShowLeaderBoard();
})

newgamebtn.addEventListener('click', e => {
    e.preventDefault();
    gameContainer.style.display = 'none';
    MenuContainer.style.display = 'flex';
    HideGameOverScreen();
})

// Tile Selection Mechanism
tileOptions.forEach((tile) => {
    tile.addEventListener('click', () => {
        rotationSteps = 0;
        tileOptions.forEach((t) => t.classList.remove('selected-tile'));
        tileOptions.forEach((t) => t.classList.remove('rotated'));
        tileOptions.forEach((t) => t.classList.remove('rotatedtwice'));
        tileOptions.forEach((t) => t.classList.remove('rotatedthrice'));
        tile.classList.add('selected-tile');

        SelectedTile = Number(tile.id.replace("tile", ""));

    });
});


function startTimer() {
    let seconds = 0;
    let minutes = 0;

    const intervalid = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }

        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

    // Function to stop the timer
    return intervalid;
}


const StartGame = (playername, map) => {
    pname = playername;
    context.imageSmoothingEnabled = false;
    DefaultMap = map.map(row => [...row]); // To Store initial state
    gameMap = map;
    namecontainer.innerText = playername;
    if (loaded) {
        drawMap(context, map)
    } else {
        loadImages.then(() => {
            loaded = true;
            drawMap(context, map);
        });
    }
    intervalId = startTimer();
}

export {
    StartGame,
}
