const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
let currentPlayer = 'X';
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleClick(event) {
  if (currentPlayer === 'O' || !gameActive) return;
  const index = event.target.dataset.index;

  if (board[index] !== "") return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add(currentPlayer.toLowerCase());

  if (checkWinner()) {
    statusText.textContent = `🎉 Player ${currentPlayer} wins!`;
    gameActive = false;
    highlightWinningCells(checkWinner());
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "🤝 It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = 'O';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  if (!gameActive) return;
  const bestMove = findBestMove();
  board[bestMove] = 'O';
  cells[bestMove].textContent = 'O';
  cells[bestMove].classList.add('o');

  if (checkWinner()) {
    statusText.textContent = `🎉 Player O wins!`;
    gameActive = false;
    highlightWinningCells(checkWinner());
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "🤝 It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  let result = checkWinnerForMinimax();
  if (result !== null) {
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'tie') return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinnerForMinimax() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== "")) {
        return 'tie';
    }
    return null;
}


function checkWinner() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return condition;
    }
  }
  return null;
}

function highlightWinningCells(combo) {
  combo.forEach(index => {
    cells[index].classList.add('winning-cell');
  });
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove('x', 'o', 'winning-cell');
  });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
statusText.textContent = `Player ${currentPlayer}'s turn`;