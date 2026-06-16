// 테트리스 보드 크기 (열 x 행)
const COLS = 10;
const ROWS = 20;
const DROP_INTERVAL_MS = 800;

// 한 번에 지운 줄 수에 따른 점수
const LINE_SCORES = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

const PIECE_TYPES = ["I", "O", "T", "S", "Z", "J", "L"];

const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");

// 7가지 테트로미노 블록 모양 (1 = 채워진 칸)
const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

let score = 0;
let dropTimer = null;
let isGameOver = false;

// 고정된 블록 (0 = 빈 칸, "I" | "O" | ... = 블록 종류)
let board = createEmptyBoard();
let currentPiece = null;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function createPiece(type) {
  const shape = SHAPES[type];
  if (!shape) {
    throw new Error(`Unknown piece type: ${type}`);
  }

  return {
    type,
    row: 0,
    col: Math.floor((COLS - shape[0].length) / 2),
    shape: shape.map((row) => [...row]),
  };
}

function getRandomPieceType() {
  const index = Math.floor(Math.random() * PIECE_TYPES.length);
  return PIECE_TYPES[index];
}

function canMove(piece, dx, dy, matrix) {
  const { shape, row, col } = piece;
  const nextRow = row + dy;
  const nextCol = col + dx;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] !== 1) {
        continue;
      }

      const boardRow = nextRow + r;
      const boardCol = nextCol + c;

      if (
        boardCol < 0 ||
        boardCol >= COLS ||
        boardRow < 0 ||
        boardRow >= ROWS
      ) {
        return false;
      }

      if (matrix[boardRow][boardCol] !== 0) {
        return false;
      }
    }
  }

  return true;
}

function isRowFull(row) {
  return row.every((cell) => cell !== 0);
}

function clearLines() {
  const remainingRows = board.filter((row) => !isRowFull(row));
  const linesCleared = ROWS - remainingRows.length;

  while (remainingRows.length < ROWS) {
    remainingRows.unshift(Array(COLS).fill(0));
  }

  board = remainingRows;
  return linesCleared;
}

function addScore(linesCleared) {
  if (linesCleared <= 0) {
    return;
  }

  score += LINE_SCORES[linesCleared] ?? linesCleared * 100;
  updateScoreDisplay();
}

function lockPiece() {
  if (!currentPiece) {
    return;
  }

  const { shape, row, col, type } = currentPiece;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] !== 1) {
        continue;
      }

      const boardRow = row + r;
      const boardCol = col + c;

      if (
        boardRow >= 0 &&
        boardRow < ROWS &&
        boardCol >= 0 &&
        boardCol < COLS
      ) {
        board[boardRow][boardCol] = type;
      }
    }
  }
}

function setGameOver() {
  isGameOver = true;
  currentPiece = null;
  stopDropTimer();
  showGameOver();
}

function trySpawnPiece() {
  currentPiece = createPiece(getRandomPieceType());

  if (!canMove(currentPiece, 0, 0, board)) {
    setGameOver();
    return false;
  }

  return true;
}

function settleLockedPiece() {
  lockPiece();

  const linesCleared = clearLines();
  if (linesCleared > 0) {
    addScore(linesCleared);
  }

  trySpawnPiece();
}

function movePieceDown() {
  if (isGameOver || !currentPiece || dropTimer === null) {
    return;
  }

  if (canMove(currentPiece, 0, 1, board)) {
    currentPiece.row += 1;
  } else {
    settleLockedPiece();
  }

  renderBoard();
}

function drawPiece(display) {
  if (!currentPiece) {
    return;
  }

  const { shape, row, col, type } = currentPiece;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] !== 1) {
        continue;
      }

      const boardRow = row + r;
      const boardCol = col + c;

      if (
        boardRow >= 0 &&
        boardRow < ROWS &&
        boardCol >= 0 &&
        boardCol < COLS
      ) {
        display[boardRow][boardCol] = type;
      }
    }
  }
}

function renderBoard() {
  const display = board.map((row) => [...row]);
  drawPiece(display);

  boardElement.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      const value = display[row][col];
      if (value) {
        cell.classList.add("cell--filled", `cell--${value.toLowerCase()}`);
      }

      boardElement.appendChild(cell);
    }
  }
}

function updateScoreDisplay() {
  scoreElement.textContent = String(score);
}

function showGameOver() {
  gameOverElement.hidden = false;
}

function hideGameOver() {
  gameOverElement.hidden = true;
}

function stopDropTimer() {
  if (dropTimer !== null) {
    clearInterval(dropTimer);
    dropTimer = null;
  }
}

function startDropTimer() {
  stopDropTimer();
  dropTimer = setInterval(movePieceDown, DROP_INTERVAL_MS);
}

function resetGameState() {
  stopDropTimer();
  board = createEmptyBoard();
  score = 0;
  isGameOver = false;
  currentPiece = null;
  hideGameOver();
  updateScoreDisplay();
}

function showPreview() {
  resetGameState();
  currentPiece = createPiece("T");
  renderBoard();
}

function beginPlay() {
  resetGameState();
  trySpawnPiece();
  if (!isGameOver) {
    startDropTimer();
  }
  renderBoard();
}

function startGame() {
  beginPlay();
}

function restartGame() {
  beginPlay();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

showPreview();
