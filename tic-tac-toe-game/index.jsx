const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // baris
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // kolom
  [0, 4, 8], [2, 4, 6],            // diagonal
];

function findWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const styles = `
.ttt-wrap {
  --bg: #14213d;
  --tile: #1f3158;
  --x: #fca311;
  --o: #8ecae6;
  --text: #f1f5f9;
  width: fit-content;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--bg);
  color: var(--text);
  border-radius: 14px;
  font-family: "Trebuchet MS", Verdana, sans-serif;
  text-align: center;
}
.ttt-wrap h2 { margin: 0 0 0.25rem; }
.ttt-turn { margin: 0 0 1rem; min-height: 1.4rem; opacity: 0.8; }
.board-row { display: flex; justify-content: center; }
.square {
  width: 84px;
  height: 84px;
  margin: 4px;
  font-size: 2.4rem;
  font-weight: bold;
  font-family: inherit;
  color: var(--text);
  background: var(--tile);
  border: 2px solid #34497a;
  border-radius: 10px;
  cursor: pointer;
}
.square:focus-visible, #reset:focus-visible {
  outline: 3px solid var(--x);
  outline-offset: 2px;
}
.square.is-x { color: var(--x); }
.square.is-o { color: var(--o); }
.ttt-message {
  margin: 1rem 0 0;
  min-height: 1.6rem;
  font-size: 1.3rem;
  font-weight: bold;
}
#reset {
  margin-top: 1rem;
  padding: 0.6rem 1.4rem;
  font: inherit;
  font-weight: bold;
  color: var(--bg);
  background: var(--x);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
`;

export function Board() {
  const { useState } = React;

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = findWinner(squares);
  const isDraw = !winner && squares.every((s) => s !== null);

  function handleClick(i) {
    // abaikan klik kalau game sudah selesai atau kotak sudah terisi
    if (winner || squares[i]) return;

    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function renderSquare(i) {
    const value = squares[i];
    const cls = "square" + (value === "X" ? " is-x" : value === "O" ? " is-o" : "");
    return (
      <button key={i} className={cls} onClick={() => handleClick(i)}>
        {value}
      </button>
    );
  }

  let message = "";
  if (winner) message = `Winner: ${winner}`;
  else if (isDraw) message = "Draw";

  return (
    <div className="ttt-wrap">
      <style>{styles}</style>
      <h2>Tic-Tac-Toe</h2>
      <p className="ttt-turn">
        {winner || isDraw ? "" : `Next: ${xIsNext ? "X" : "O"}`}
      </p>

      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}

      <p className="ttt-message">{message}</p>
      <button id="reset" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}