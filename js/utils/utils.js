import { leaderboardlist, endGame, leaderBoard } from "../elements.js";

function checkArrays(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array1[i].length; j++) {
            if (array1[i][j] !== 4 && array2.some(row => row.includes(array1[i][j]))) {
                return false;
            }
        }
    }
    return true;
}


function isConnected(arr) {
    // Define connection mappings for each number
    const connections = {
        71: new Set(['bottom', 'left']),
        72: new Set(['top', 'left']),
        73: new Set(['top', 'right']),
        7: new Set(['bottom', 'right']),

        81: new Set(['bottom', 'left']),
        82: new Set(['top', 'left']),
        83: new Set(['top', 'right']),
        8: new Set(['bottom', 'right']),

        61: new Set(['left', 'right']),
        62: new Set(['top', 'bottom']),
        63: new Set(['left', 'right']),
        6: new Set(['top', 'bottom']),

        91: new Set(['left', 'right']),
        92: new Set(['top', 'bottom']),
        93: new Set(['left', 'right']),
        9: new Set(['top', 'bottom']),

        4: new Set() // obstacle
    };

    // Define opposite connections for validation
    const opposite = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
    };

    const rows = arr.length;
    const cols = arr[0].length;

    // Check each cell in the array
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cellValue = arr[i][j];

            // Check if the cell value is valid
            if (!connections.hasOwnProperty(cellValue)) {
                return false;
            }

            // Get the current cell's connections
            const currentConnections = connections[cellValue];

            // Check the top neighbor
            if (currentConnections.has('top')) {
                if (i === 0 || !connections[arr[i - 1][j]] || !connections[arr[i - 1][j]].has(opposite.top)) {
                    return false;
                }
            }

            // Check the bottom neighbor
            if (currentConnections.has('bottom')) {
                if (i === rows - 1 || !connections[arr[i + 1][j]] || !connections[arr[i + 1][j]].has(opposite.bottom)) {
                    return false;
                }
            }

            // Check the left neighbor
            if (currentConnections.has('left')) {
                if (j === 0 || !connections[arr[i][j - 1]] || !connections[arr[i][j - 1]].has(opposite.left)) {
                    return false;
                }
            }

            // Check the right neighbor
            if (currentConnections.has('right')) {
                if (j === cols - 1 || !connections[arr[i][j + 1]] || !connections[arr[i][j + 1]].has(opposite.right)) {
                    return false;
                }
            }
        }
    }

    // If all checks passed, return true
    return true;
}

const addLeaderboardItem = (newItem) => {
    // Create a new list item
    const newListItem = document.createElement('li');
    newListItem.textContent = newItem;
    // Append the new item to the leaderboard list
    leaderboardlist.appendChild(newListItem);

}

const ShowLeaderBoard = () => {
    HideGameOverScreen();
    leaderBoard.style.display = 'flex';
    leaderboardlist.innerHTML = '';
    const allKeys = Object.keys(localStorage);
    const allItems = [];

    allKeys.forEach(key => {
        allItems.push(key)
    });

    for (const key in allItems) {
        addLeaderboardItem(`${allItems[key]}  ${localStorage.getItem(allItems[key]).replace(/"/g, '')}s`)
    }
}

const ShowGameOverScreen = () => {
    endGame.style.display = "flex";
    endGame.style.opacity = "1";
}

function HideGameOverScreen() {
    endGame.style.opacity = "0";
    endGame.style.display = "none";
}

export {
    checkArrays,
    isConnected,
    addLeaderboardItem,
    ShowGameOverScreen,
    HideGameOverScreen,
    ShowLeaderBoard,
}