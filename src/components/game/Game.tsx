import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC, memo, useState } from "react";
import { Board, BOARD_SIZE } from "../board/Board";
import { Board as BoardModel } from "../../model/board";
import { Square } from "../../model/square";

const calculateWinner = (squares: Square[]) => {
  if (squares.every((square) => square.value != null)) {
    return "Draw";
  }
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, ...b] = lines[i];
    if (
      squares[a].value &&
      b.every((value) => squares[value].value === squares[a].value)
    ) {
      lines[i].forEach((value) => (squares[value].isActive = true));
      return squares[a].value;
    }
  }
  return null;
};

const GameComponent: FC = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [history, setHistory] = useState<BoardModel[]>([
    {
      squares: Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => ({
        value: null,
        isActive: false,
        isNew: false,
      })),
      newMove: null,
    },
  ]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const handleClick = (i: number) => {
    const gameHistory = history.slice(0, stepNumber + 1);
    const current = gameHistory[gameHistory.length - 1];
    const squares: Square[] = structuredClone(current.squares.slice());
    if (calculateWinner(squares) || squares[i].value) {
      return;
    }
    squares.forEach((square) => (square.isNew = false));
    squares[i].value = xIsNext ? "X" : "O";
    squares[i].isNew = true;

    setHistory(
      gameHistory.concat([
        {
          squares,
          newMove: {
            x: Math.floor(i % BOARD_SIZE),
            y: Math.floor(i / BOARD_SIZE),
          },
        },
      ])
    );
    setStepNumber(gameHistory.length);
    setXIsNext((prev) => !prev);
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setHistory((prev) => prev.slice(0, step + 1));
    setXIsNext(step % 2 === 0);
  };

  const moves = history.map((step, move) => {
    const desc = move
      ? `Go to move #${move} (${step.newMove?.x}, ${step.newMove?.y})`
      : "Go to game start";
    return (
      <li key={move}>
        <Button onClick={() => jumpTo(move)}>{desc}</Button>
      </li>
    );
  });

  const winner = calculateWinner(history[stepNumber].squares);

  let status;
  if (winner) {
    status =
      winner === "Draw"
        ? "Draw! press go to game start for new game."
        : "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={history[stepNumber].squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ToggleButtonGroup
          exclusive
          value={order}
          onChange={(event, newValue) => {
            setOrder(newValue);
          }}
        >
          <ToggleButton value="desc">Descending</ToggleButton>
          <ToggleButton value="asc">Ascending</ToggleButton>
        </ToggleButtonGroup>
        <ol>{order === "asc" ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
};

export const Game = memo(GameComponent);
