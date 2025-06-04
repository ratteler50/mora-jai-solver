import React from 'react';
import { type TileColor as TileColorType } from '../tileLogic';

interface PuzzleGridProps {
  grid: TileColorType[][];
  targetCorners: TileColorType[];
  currentCorners: TileColorType[];
  mode: 'setup' | 'play';
  handleTileClick: (row: number, col: number) => void;
  handleCornerClick: (cornerIndex: number) => void;
  shouldHighlightTile: (row: number, col: number) => boolean;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  grid,
  targetCorners,
  currentCorners,
  mode,
  handleTileClick,
  handleCornerClick,
  shouldHighlightTile
}) => {
  return (
    <div className="puzzle-container">
      {/* Top Left Corner */}
      <div className="corner top-left" onClick={() => handleCornerClick(0)} data-testid="corner-top-left">
        <div className={`corner-tile ${targetCorners[0]} ${currentCorners[0] === targetCorners[0] ? 'winning' : ''}`}></div>
      </div>
      {/* Top Right Corner */}
      <div className="corner top-right" onClick={() => handleCornerClick(1)} data-testid="corner-top-right">
        <div className={`corner-tile ${targetCorners[1]} ${currentCorners[1] === targetCorners[1] ? 'winning' : ''}`}></div>
      </div>

      <div className="grid" data-testid="puzzle-grid-internal">
        {grid.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`tile ${color} ${mode === 'setup' ? 'setup-mode' : ''} ${shouldHighlightTile(rowIndex, colIndex) ? 'highlighted' : ''}`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
              data-testid={`tile-${rowIndex}-${colIndex}`}
            >
            </div>
          ))
        )}
      </div>

      {/* Bottom Left Corner */}
      <div className="corner bottom-left" onClick={() => handleCornerClick(2)} data-testid="corner-bottom-left">
        <div className={`corner-tile ${targetCorners[2]} ${currentCorners[2] === targetCorners[2] ? 'winning' : ''}`}></div>
      </div>
      {/* Bottom Right Corner */}
      <div className="corner bottom-right" onClick={() => handleCornerClick(3)} data-testid="corner-bottom-right">
        <div className={`corner-tile ${targetCorners[3]} ${currentCorners[3] === targetCorners[3] ? 'winning' : ''}`}></div>
      </div>
    </div>
  );
};

export default PuzzleGrid;
