import { FC, memo } from "react";
import { Square as SquareModel } from "../../model/square";

interface Props {
  square: SquareModel;
  onClick: () => void;
}

const SquareComponent: FC<Props> = ({ onClick, square }) => {
  return (
    <button
      className={`square ${square.isNew ? "square--new" : ""} ${square.isActive ? "square--active" : ""}`}
      onClick={onClick}
    >
      {square.value}
    </button>
  );
};

export const Square = memo(SquareComponent);
