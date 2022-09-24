import { Coordinate } from './coordinate';
import { Square } from './square';

export interface Board {
  squares: Square[];
  newMove: Coordinate | null;
}
