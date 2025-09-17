const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
let currentPlayer = 'X';
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleClick(event) {
  const index = event.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add(currentPlayer.toLowerCase()); // Add 'x' or 'o' class

  if (checkWinner()) {
    statusText.textContent = `🎉 Player ${currentPlayer} wins!`;
    gameActive = false;
    highlightWinningCells(checkWinner());
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "🤝 It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return condition; // Return winning combo
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
