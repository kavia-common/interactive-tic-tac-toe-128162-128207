import React, { useState } from 'react';
import './App.css';

/**
 * Calculate the winner of a given Tic Tac Toe board.
 * @param {Array<('X'|'O'|null)>} squares - The current board state (length 9).
 * @returns {{ player: 'X'|'O', line: number[] }|null} The winner and the winning line, or null if no winner yet.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export default function App() {
  /** This is the main Tic Tac Toe React component providing gameplay, score tracking, and UI. */

  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null); // 'X' | 'O' | null
  const [winningLine, setWinningLine] = useState([]);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });

  const currentPlayer = xIsNext ? 'X' : 'O';
  const gameOver = Boolean(winner) || isDraw;

  const handleSquareClick = (index) => {
    if (board[index] || gameOver) return; // ignore clicks on filled or finished game

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;

    const result = calculateWinner(nextBoard);
    if (result) {
      // Winner found
      setBoard(nextBoard);
      setWinner(result.player);
      setWinningLine(result.line);
      setScores((prev) => ({ ...prev, [result.player]: prev[result.player] + 1 }));
      return;
    }

    // Check draw
    if (nextBoard.every(Boolean)) {
      setBoard(nextBoard);
      setIsDraw(true);
      setScores((prev) => ({ ...prev, ties: prev.ties + 1 }));
      return;
    }

    // Continue game
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
  };

  const getStatusText = () => {
    if (winner) return `${winner} wins!`;
    if (isDraw) return "It's a tie!";
    return `Current player: ${currentPlayer}`;
  };

  // PUBLIC_INTERFACE
  const nextRound = () => {
    /** Resets the board for the next round and alternates the starting player. */
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const newGame = () => {
    /** Fully resets the game including scores and board, with X starting first. */
    setScores({ X: 0, O: 0, ties: 0 });
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setXIsNext(true);
  };

  const renderSquare = (i) => {
    const value = board[i];
    const isWinning = winningLine.includes(i);
    const isX = value === 'X';
    const isO = value === 'O';
    const classes = [
      'square',
      value ? 'filled' : '',
      isX ? 'x' : '',
      isO ? 'o' : '',
      isWinning ? 'win' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        key={i}
        type="button"
        className={classes}
        onClick={() => handleSquareClick(i)}
        disabled={Boolean(value) || gameOver}
        aria-label={`Cell ${i + 1}, ${value ? value : 'empty'}`}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="app">
      <div className="container">
        <header className="top">
          <h1 className="title">Tic Tac Toe</h1>
          <p
            className={`status ${winner ? 'status-win' : isDraw ? 'status-draw' : 'status-turn'}`}
            role="status"
            aria-live="polite"
          >
            {getStatusText()}
          </p>

          <div className="scoreboard" aria-label="Scoreboard">
            <div className={`score-card ${!gameOver && currentPlayer === 'X' ? 'active' : ''}`}>
              <div className="label">
                <span className="mark mark-x">X</span> Player
              </div>
              <div className="score">{scores.X}</div>
              {!gameOver && currentPlayer === 'X' && <span className="badge">Your turn</span>}
            </div>

            <div className="score-card neutral">
              <div className="label">Ties</div>
              <div className="score">{scores.ties}</div>
            </div>

            <div className={`score-card ${!gameOver && currentPlayer === 'O' ? 'active' : ''}`}>
              <div className="label">
                <span className="mark mark-o">O</span> Player
              </div>
              <div className="score">{scores.O}</div>
              {!gameOver && currentPlayer === 'O' && <span className="badge">Your turn</span>}
            </div>
          </div>
        </header>

        <main className="game">
          <div className={`board ${gameOver ? 'board-finished' : ''}`} role="grid" aria-label="Tic Tac Toe board">
            {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
          </div>

          <div className="controls">
            <button className="btn btn-primary" type="button" onClick={nextRound} aria-label="Start next round">
              Next Round
            </button>
            <button className="btn btn-secondary" type="button" onClick={newGame} aria-label="Reset scores and board">
              New Game
            </button>
          </div>
        </main>

        <footer className="footer">
          <span className="hint">Tip: Click any empty square to place your mark.</span>
        </footer>
      </div>
    </div>
  );
}
