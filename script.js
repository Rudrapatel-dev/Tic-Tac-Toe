// 1. Array: Represents the 3x3 grid
let board = ['', '', '', '', '', '', '', '', ''];

// 2. Stack: Keeps track of move history for the Undo feature
let moveStack = [];

let currentPlayer = 'X';
let gameActive = true;

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const undoBtn = document.getElementById('undoBtn');
const resetBtn = document.getElementById('resetBtn');

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function handleCellClick(e) {
    const clickedCell = e.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[cellIndex] !== '' || !gameActive) return;

    // Update Array
    board[cellIndex] = currentPlayer;
    
    // Push to Stack
    moveStack.push(cellIndex);
    
    updateUI();
    checkResult();
}

function updateUI() {
    cells.forEach((cell, index) => {
        cell.innerText = board[index];
        cell.className = `cell ${board[index].toLowerCase()}`;
    });
    undoBtn.disabled = moveStack.length === 0 || !gameActive;
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerText = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        undoBtn.disabled = true; // Disable undo after win
        return;
    }

    if (!board.includes('')) {
        statusDisplay.innerText = 'Game ended in a draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerText = `Player ${currentPlayer}'s Turn`;
}

// Stack operation: Pop the last move
function undoMove() {
    if (moveStack.length === 0 || !gameActive) return;

    // Pop the last move from the stack
    const lastMoveIndex = moveStack.pop();
    
    // Clear that spot in the array
    board[lastMoveIndex] = '';
    
    // Switch player back
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerText = `Player ${currentPlayer}'s Turn`;
    
    updateUI();
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    moveStack = []; // Clear the stack
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.innerText = `Player X's Turn`;
    updateUI();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
undoBtn.addEventListener('click', undoMove);
resetBtn.addEventListener('click', resetGame);

updateUI(); // Initial UI setup
