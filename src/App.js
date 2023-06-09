import { useState } from 'react';

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}


function Board({xIsNext, squares, onPlay}) {
  
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let board = [];
  const sideSize = 3;
  for (let i = 0; i < sideSize; i++) {
    let entry = [];
    for (let j = i*sideSize; j < (i+1)*sideSize; j++){
      entry.push(
      <Square value={squares[j]} onSquareClick={() => handleClick(j)} />
      );
    }
    board.push(
    <div key={i} className="board-row">
      {entry}
    </div>
    );
  }
  
  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0,currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSortToggle() {
    setIsAscending(!isAscending);
  }

  const oldHistory = history.slice(0, history.length - 1);
  const moves = oldHistory.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    }
    else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{sortedMoves}</ol>
        <span>You are at move #{history.length - 1}</span>
      </div>
      <div className="game-info">
        <button onClick={handleSortToggle}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

