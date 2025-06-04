import React from 'react';
import { type TileColor as TileColorType } from '../tileLogic';
import { type SolverResult, type PuzzleState, formatMoves, estimateSolvability } from '../solver';

interface SolutionDisplayProps {
  mode: 'setup' | 'play';
  solverState: {
    isRunning: boolean;
    result: SolverResult | null;
    showSolution: boolean;
    currentStep: number;
  };
  puzzleStateForEstimator: PuzzleState; // Needs to be full PuzzleState for estimateSolvability
  handleSolvePuzzle: () => void;
  handleToggleSolution: () => void;
  handleStepNext: () => void;
  handleStepPrev: () => void;
  handleStepReset: () => void;
  getCurrentStepState: () => PuzzleState | null;
  isWinning: boolean;
}

const MAX_STATES_EXPLORED_LIMIT = 5000000; // Consistent with solver.ts

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
  mode,
  solverState,
  puzzleStateForEstimator,
  handleSolvePuzzle,
  handleToggleSolution,
  handleStepNext,
  handleStepPrev,
  handleStepReset,
  getCurrentStepState,
  isWinning
}) => {
  if (mode !== 'play') {
    return null;
  }

  const solverButtons = (
    <div className="solver-section">
      <button
        className="solver-button"
        onClick={handleSolvePuzzle}
        disabled={solverState.isRunning || isWinning}
      >
        {solverState.isRunning ? '🤔 Solving...' : '🧠 Auto-Solve'}
      </button>
      {solverState.result && (
        <button
          className="solver-toggle"
          onClick={handleToggleSolution}
        >
          {solverState.showSolution ? '📄 Hide Solution' : '📋 Show Solution'}
        </button>
      )}
    </div>
  );

  if (!solverState.showSolution || !solverState.result) {
    return solverButtons;
  }

  const { result, currentStep } = solverState;
  const formattedMoveList = result.solved ? formatMoves(result.moves, result.states) : [];
  const currentStepPreviewState = getCurrentStepState(); // Renamed for clarity within this scope

  return (
    <>
      {solverButtons}
      <div className="solution-display">
        {result.solved ? (
          <div>
            <h4>✅ Solution Found!</h4>
            <p><strong>Moves:</strong> {result.moves.length}</p>
            <p><strong>Time:</strong> {result.timeMs.toFixed(1)}ms</p>
            <p><strong>States explored:</strong> {result.totalStatesExplored.toLocaleString()}</p>
            <div className="moves-list">
              <h5>Move Sequence:</h5>
              <div className="step-controls">
                <button className="step-button" onClick={handleStepReset} disabled={currentStep === -1}>⏮️ Reset</button>
                <button className="step-button" onClick={handleStepPrev} disabled={currentStep <= -1}>⬅️ Prev</button>
                <span className="step-indicator">
                  Step {currentStep + 1} of {result.moves.length}
                  {currentStep === -1 && " (Initial)"}
                </span>
                <button className="step-button" onClick={handleStepNext} disabled={currentStep >= result.moves.length - 1}>Next ➡️</button>
              </div>
              {currentStep >= 0 && formattedMoveList[currentStep] && (
                <div className="current-step">
                  <h6>Current Move:</h6>
                  <p className="highlighted-move">{formattedMoveList[currentStep]}</p>
                </div>
              )}
              {currentStepPreviewState && currentStep >= 0 && (
                <div className="state-preview">
                  <h6>Expected State After Step {currentStep + 1}:</h6>
                          <div className="preview-grid" data-testid="solution-preview-grid">
                    {currentStepPreviewState.grid.map((row, rowIndex) =>
                      row.map((color, colIndex) => (
                        <div
                          key={`preview-${rowIndex}-${colIndex}`}
                          className={`preview-tile ${color}`}
                                  data-testid={`preview-tile-${rowIndex}-${colIndex}`}
                        ></div>
                      ))
                    )}
                  </div>
                </div>
              )}
              <ol>
                {formattedMoveList.map((move, index) => (
                  <li key={index} className={index === currentStep ? 'current-step-item' : ''}>{move}</li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div>
            <h4>❌ No Solution Found</h4>
            <p>Explored {result.totalStatesExplored.toLocaleString()} states in {result.timeMs.toFixed(1)}ms</p>
            {(() => {
              const estimate = estimateSolvability(puzzleStateForEstimator);
              const hitLimit = result.totalStatesExplored >= MAX_STATES_EXPLORED_LIMIT;

              if (hitLimit) {
                return <p><strong>Analysis:</strong> Search limit reached - puzzle may be too complex or unsolvable.</p>;
              } else if (!estimate.likely) {
                return <p><strong>Analysis:</strong> {estimate.reason}</p>;
              } else {
                return <p><strong>Analysis:</strong> Puzzle appears unsolvable with current configuration.</p>;
              }
            })()}
          </div>
        )}
      </div>
    </>
  );
};

export default SolutionDisplay;
