import React from 'react';

const TileBehaviorsInfo: React.FC = () => {
  return (
    <details className="spoiler-section tile-behaviors-section">
      <summary className="spoiler-toggle">Tile Behaviors</summary>
      <div className="spoiler-content">
        <h3>How Each Tile Works:</h3>
        <div className="behaviors-grid">
          <div className="behavior-item" data-testid="behavior-item">
            <span className="white behavior-tile"></span>
            <div className="behavior-info"><strong>White</strong><small>Expands to adjacent gray or turns gray</small></div>
          </div>
          <div className="behavior-item" data-testid="behavior-item">
            <span className="black behavior-tile"></span>
            <div className="behavior-info"><strong>Black</strong><small>Moves row tiles right</small></div>
          </div>
          <div className="behavior-item" data-testid="behavior-item">
            <span className="red behavior-tile"></span>
            <div className="behavior-info"><strong>Red</strong><small>White→Black, Black→Red</small></div>
          </div>
          <div className="behavior-item" data-testid="behavior-item">
            <span className="yellow behavior-tile"></span>
            <div className="behavior-info"><strong>Yellow</strong><small>Moves up one position</small></div>
          </div>
          <div className="behavior-item" data-testid="behavior-item">
            <span className="purple behavior-tile"></span>
            <div className="behavior-info"><strong>Purple</strong><small>Moves down one position</small></div>
          </div>
          <div className="behavior-item" data-testid="behavior-item">
            <span className="green behavior-tile"></span>
            <div className="behavior-info"><strong>Green</strong><small>Swaps with mirrored position</small></div>
          </div>
          <div className="behavior-item" data-testid="behavior-item">
            <span className="pink behavior-tile"></span>
            <div className="behavior-info"><strong>Pink</strong><small>Rotates adjacent tiles clockwise</small></div>
          </div>
          <div className="behavior-item" data-testid="behavior-item">
            <span className="orange behavior-tile"></span>
            <div className="behavior-info"><strong>Orange</strong><small>Matches majority adjacent color</small></div>
          </div>
          <div className="behavior-item" data-testid="behavior-item">
            <span className="blue behavior-tile"></span>
            <div className="behavior-info"><strong>Blue</strong><small>Copies center tile behavior</small></div>
          </div>
          <div className="behavior-item" data-testid="behavior-item">
            <span className="gray behavior-tile"></span>
            <div className="behavior-info"><strong>Gray</strong><small>No function (empty space)</small></div>
          </div>
        </div>
      </div>
    </details>
  );
};

export default TileBehaviorsInfo;
