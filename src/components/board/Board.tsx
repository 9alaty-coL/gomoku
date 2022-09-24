import { FC, memo } from "react";
import { Square } from "../square/Square";
import { Square as SquareModel } from "../../model/square";

export const BOARD_SIZE = 5;

interface Props {
  squares: SquareModel[];
  onClick: (i: number) => void;
}

const BoardComponent: FC<Props> = ({ squares, onClick }) => {
  const renderSquare = (i: number, isActive = false) => {
    return (
      <Square
        key={i}
        square={squares[i]}
        onClick={() => {onClick(i)}}
      />
    );
  };

  return (
    <>
      {Array.from(new Array(BOARD_SIZE)).map((value, rowIndex) => (
        /** I used index as a key here because component skeleton does'nt have identifier values .
         * and they are not computed and do not change. */
        <div key={rowIndex} className="board-row">
          {Array.from(new Array(BOARD_SIZE)).map((value, columnIndex) =>
            renderSquare(rowIndex * BOARD_SIZE + columnIndex)
          )}
        </div>
      ))}
    </>
  );
};

export const Board = memo(BoardComponent);
