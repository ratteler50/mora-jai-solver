import React from 'react';
import { type TileColor as TileColorType } from '../tileLogic';

interface SetupControlsProps {
  puzzleTargetCorners: TileColorType[];
  selectedBrushColor: TileColorType;
  countrySymbols: Array<{ color: TileColorType; name: string; image: string; description: string }>;
  allColors: TileColorType[];
  onBrushColorSelect: (color: TileColorType) => void;
  onTargetColorSelect: (color: TileColorType) => void;
}

const SetupControls: React.FC<SetupControlsProps> = ({
  puzzleTargetCorners,
  selectedBrushColor,
  countrySymbols,
  allColors,
  onBrushColorSelect,
  onTargetColorSelect,
}) => {
  return (
    <div className="setup-controls">
      <div className="control-section">
        <h3>Set All Corners (Country Symbol):</h3>
        <div className="symbol-grid">
          {countrySymbols.map(symbol => (
            <div
              key={symbol.color}
              className={`symbol-item ${puzzleTargetCorners.every(c => c === symbol.color) ? 'selected' : ''}`}
              onClick={() => onTargetColorSelect(symbol.color)}
              data-testid={`country-symbol-item-${symbol.name}`}
            >
              <img
                src={symbol.image}
                alt={`${symbol.name} symbol`}
                className="symbol-image"
              />
              <div className="symbol-info">
                <strong>{symbol.name}</strong>
                <small>{symbol.description}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="control-section">
        <h3>Brush Color:</h3>
        <div className="color-palette">
          {allColors.map(color => (
            <button
              key={color}
              className={`color-btn ${color} ${selectedBrushColor === color ? 'selected' : ''}`}
              onClick={() => onBrushColorSelect(color)}
                    data-testid={`color-btn-${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetupControls;
