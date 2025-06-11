import {useState} from 'react'
import './App.css'
import {
  TileColor,
  type TileColor as TileColorType,
  applyBlackTileLogic,
  applyRedTileLogic,
  applyGreenTileLogic,
  applyYellowTileLogic,
  applyPinkTileLogic,
  applyPurpleTileLogic,
  applyOrangeTileLogic,
  applyWhiteTileLogic,
  applyBlueTileLogic
} from './tileLogic'
import {
  solvePuzzle,
  formatMoves,
  estimateSolvability,
  maxStates,
  type SolverResult
} from './solver'
import premadeBoxesData from './premade_boxes.json';

const colorNameToEnum: { [key: string]: TileColorType } = {
  "white": TileColor.White,
  "black": TileColor.Black,
  "red": TileColor.Red,
  "yellow": TileColor.Yellow,
  "purple": TileColor.Purple,
  "green": TileColor.Green,
  "pink": TileColor.Pink,
  "orange": TileColor.Orange,
  "blue": TileColor.Blue,
  "grey": TileColor.Gray,
  "gray": TileColor.Gray
};

type AppMode = 'setup' | 'play'

interface PuzzleState {
  grid: TileColorType[][]
  corners: TileColorType[]
  targetCorners: TileColorType[] // Array of 4 target colors: [topLeft, topRight, bottomLeft, bottomRight]
}

interface SetupState {
  selectedBrushColor: TileColorType
}

interface SolverState {
  isRunning: boolean
  result: SolverResult | null
  showSolution: boolean
  currentStep: number
}

interface PremadeBox {
  location: string;
  pattern: string; // Should contain 9 grid colors
  corners: string; // Should contain 4 corner colors
}

const premadeBoxes: PremadeBox[] = premadeBoxesData as PremadeBox[];

function App() {
  const handlePremadeBoxSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocation = event.target.value;
    // If the placeholder (empty value) is selected, do nothing.
    if (!selectedLocation) {
      return;
    }

    const foundBox = premadeBoxes.find(box => box.location === selectedLocation);
    if (!foundBox) {
      console.error(`Premade box with location "${selectedLocation}" not found.`);
      // Reset dropdown to placeholder
      event.target.value = "";
      return;
    }

    const gridColorStrings = foundBox.pattern.split(' ').map(colorStr => colorStr.toLowerCase());
    const cornerColorStrings = foundBox.corners.split(' ').map(colorStr => colorStr.toLowerCase());

    if (gridColorStrings.length < 9) {
      console.error(`Grid pattern for "${selectedLocation}" is too short. Needs 9 colors, got ${gridColorStrings.length}.`);
      event.target.value = ""; // Reset dropdown
      return;
    }

    if (cornerColorStrings.length < 4) {
      console.error(`Corner pattern for "${selectedLocation}" is too short. Needs 4 colors, got ${cornerColorStrings.length}.`);
      event.target.value = ""; // Reset dropdown
      return;
    }

    const newGrid: TileColorType[][] = [
      [TileColor.Gray, TileColor.Gray, TileColor.Gray], // Initialize with defaults
      [TileColor.Gray, TileColor.Gray, TileColor.Gray],
      [TileColor.Gray, TileColor.Gray, TileColor.Gray]
    ];

    for (let i = 0; i < 9; i++) {
      const colorName = gridColorStrings[i];
      const tileColor = colorNameToEnum[colorName];
      if (!tileColor) {
        console.error(`Invalid color name "${colorName}" in grid pattern for "${selectedLocation}" at index ${i}. Defaulting to Gray.`);
        newGrid[Math.floor(i/3)][i%3] = TileColor.Gray;
      } else {
        newGrid[Math.floor(i/3)][i%3] = tileColor;
      }
    }

    const newTargetCorners: TileColorType[] = [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red]; // Initialize with defaults

    // cornerColorStrings is TL, TR, BR, BL
    // targetCorners state array is TL, TR, BL, BR

    const targetCornerSourceColors = [ // Directly from cornerColorStrings in TL, TR, BR, BL order
        cornerColorStrings[0], // TL
        cornerColorStrings[1], // TR
        cornerColorStrings[2], // BR
        cornerColorStrings[3]  // BL
    ];

    // Map to targetCorners state order [TL, TR, BL, BR]
    const mappedColorsForState = [
        colorNameToEnum[targetCornerSourceColors[0]], // TL
        colorNameToEnum[targetCornerSourceColors[1]], // TR
        colorNameToEnum[targetCornerSourceColors[3]], // BL (from source index 3)
        colorNameToEnum[targetCornerSourceColors[2]]  // BR (from source index 2)
    ];

    for (let i = 0; i < 4; i++) {
        if (!mappedColorsForState[i]) {
            let originalStringColor = "";
            if (i === 0) originalStringColor = targetCornerSourceColors[0]; // TL
            else if (i === 1) originalStringColor = targetCornerSourceColors[1]; // TR
            else if (i === 2) originalStringColor = targetCornerSourceColors[3]; // BL
            else if (i === 3) originalStringColor = targetCornerSourceColors[2]; // BR
            console.error(`Invalid color name "${originalStringColor}" in corner pattern for "${selectedLocation}". Defaulting to Red.`);
            newTargetCorners[i] = TileColor.Red;
        } else {
            newTargetCorners[i] = mappedColorsForState[i];
        }
    }

    setPuzzleState({
      grid: newGrid,
      corners: updateCorners(newGrid),
      targetCorners: newTargetCorners,
    });

    // Reset dropdown to placeholder to allow re-selection
    event.target.value = "";
  };

  const defaultGrid = [
    [TileColor.Gray, TileColor.Gray, TileColor.Gray],
    [TileColor.Gray, TileColor.Gray, TileColor.Gray],
    [TileColor.Gray, TileColor.Gray, TileColor.Gray]
  ]
  
  const [mode, setMode] = useState<AppMode>('setup')
  const [setupState, setSetupState] = useState<SetupState>({
    selectedBrushColor: TileColor.White
  })
  const [solverState, setSolverState] = useState<SolverState>({
    isRunning: false,
    result: null,
    showSolution: false,
    currentStep: -1
  })
  const [initialPuzzleState, setInitialPuzzleState] = useState<PuzzleState>({
    grid: defaultGrid,
    corners: [defaultGrid[0][0], defaultGrid[0][2], defaultGrid[2][0], defaultGrid[2][2]],
    targetCorners: [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red]
  })
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    grid: defaultGrid,
    corners: [defaultGrid[0][0], defaultGrid[0][2], defaultGrid[2][0], defaultGrid[2][2]],
    targetCorners: [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red]
  })

  const handleTileClick = (row: number, col: number) => {
    if (mode === 'setup') {
      // Setup mode: paint with selected brush color
      const newGrid = puzzleState.grid.map((r, rIndex) =>
        r.map((c, cIndex) =>
          rIndex === row && cIndex === col ? setupState.selectedBrushColor : c
        )
      )
      const newState = {
        ...puzzleState,
        grid: newGrid,
        corners: updateCorners(newGrid)
      }
      setPuzzleState(newState)
    } else {
      // Play mode: apply tile logic
      const currentColor = puzzleState.grid[row][col]
      const newState = {...puzzleState}

      switch (currentColor) {
        case TileColor.Gray:
          // Gray tiles do nothing
          break
        case TileColor.Black:
          newState.grid = applyBlackTileLogic(newState.grid, row)
          break
        case TileColor.Red:
          newState.grid = applyRedTileLogic(newState.grid)
          break
        case TileColor.Green:
          newState.grid = applyGreenTileLogic(newState.grid, row, col)
          break
        case TileColor.Yellow:
          newState.grid = applyYellowTileLogic(newState.grid, row, col)
          break
        case TileColor.Pink:
          newState.grid = applyPinkTileLogic(newState.grid, row, col)
          break
        case TileColor.Purple:
          newState.grid = applyPurpleTileLogic(newState.grid, row, col)
          break
        case TileColor.Orange:
          newState.grid = applyOrangeTileLogic(newState.grid, row, col)
          break
        case TileColor.White:
          newState.grid = applyWhiteTileLogic(newState.grid, row, col)
          break
        case TileColor.Blue:
          newState.grid = applyBlueTileLogic(newState.grid, row, col)
          break
      }

      newState.corners = updateCorners(newState.grid)
      setPuzzleState(newState)
    }
  }


  const updateCorners = (grid: TileColorType[][]): TileColorType[] => {
    return [
      grid[0][0], grid[0][2], grid[2][0], grid[2][2]
    ]
  }

  const handleModeSwitch = () => {
    if (mode === 'setup') {
      // Switching from setup to play: save current state as initial
      setInitialPuzzleState(puzzleState)
      setMode('play')
    } else {
      // Switching from play to setup: go back to setup mode
      setMode('setup')
    }
  }

  const handleTargetColorSelect = (color: TileColorType) => {
    // Set all corners to the same color (for backwards compatibility)
    setPuzzleState({
      ...puzzleState,
      targetCorners: [color, color, color, color]
    })
  }

  const handleCornerTargetSelect = (cornerIndex: number, color: TileColorType) => {
    const newTargetCorners = [...puzzleState.targetCorners]
    newTargetCorners[cornerIndex] = color
    setPuzzleState({
      ...puzzleState,
      targetCorners: newTargetCorners
    })
  }

  const handleBrushColorSelect = (color: TileColorType) => {
    setSetupState({
      ...setupState,
      selectedBrushColor: color
    })
  }

  const handleResetToInitial = () => {
    setPuzzleState({...initialPuzzleState})
    setSolverState({
      isRunning: false,
      result: null,
      showSolution: false,
      currentStep: -1
    })
  }

  const handleSolvePuzzle = async () => {
    setSolverState({
      isRunning: true,
      result: null,
      showSolution: false,
      currentStep: -1
    })

    // Run solver in next tick to allow UI to update
    setTimeout(() => {
      const result = solvePuzzle(puzzleState)
      setSolverState({
        isRunning: false,
        result: result,
        showSolution: true,
        currentStep: -1
      })
    }, 50)
  }

  const handleToggleSolution = () => {
    setSolverState({
      ...solverState,
      showSolution: !solverState.showSolution,
      currentStep: -1
    })
  }

  const handleStepNext = () => {
    if (solverState.result && solverState.result.solved) {
      const maxStep = solverState.result.moves.length - 1
      setSolverState({
        ...solverState,
        currentStep: Math.min(solverState.currentStep + 1, maxStep)
      })
    }
  }

  const handleStepPrev = () => {
    setSolverState({
      ...solverState,
      currentStep: Math.max(solverState.currentStep - 1, -1)
    })
  }

  const handleStepReset = () => {
    setSolverState({
      ...solverState,
      currentStep: -1
    })
  }

  const checkWinCondition = (): boolean => {
    return mode === 'play' && puzzleState.corners.every((corner, index) => corner === puzzleState.targetCorners[index])
  }

  const shouldHighlightTile = (row: number, col: number): boolean => {
    if (!solverState.result || !solverState.result.solved || solverState.currentStep < 0) {
      return false
    }
    const currentMove = solverState.result.moves[solverState.currentStep]
    return currentMove && currentMove.row === row && currentMove.col === col
  }

  const getCurrentStepState = (): PuzzleState => {
    if (!solverState.result || !solverState.result.solved || solverState.currentStep < 0) {
      return puzzleState
    }
    // Return the state after the current step (currentStep + 1 because states[0] is initial state)
    return solverState.result.states[solverState.currentStep + 1] || puzzleState
  }

  const isWinning = checkWinCondition()

  const allColors = [
    TileColor.White, TileColor.Black, TileColor.Red, TileColor.Yellow, 
    TileColor.Purple, TileColor.Green, TileColor.Pink, TileColor.Orange, 
    TileColor.Blue, TileColor.Gray
  ]

  const countrySymbols = [
    {
      color: TileColor.White,
      name: "Mora Jai",
      image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-mora-jai.jpg",
      description: "White Arch"
    },
    {
      color: TileColor.Black,
      name: "Orinda Aries", 
      image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-orinda-aries.jpg",
      description: "Black Mirror"
    },
    {
      color: TileColor.Red,
      name: "Fenn Aries",
      image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-fenn-aries.jpg", 
      description: "Red Pentagon"
    },
    {
      color: TileColor.Yellow,
      name: "Arch Aries",
      image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-arch-aries.jpg",
      description: "Yellow Mountain"
    },
    {
      color: TileColor.Purple,
      name: "Ejara",
      image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-eraja.jpg",
      description: "Purple Hourglass"
    },
    {
      color: TileColor.Green,
      name: "Nuance",
      image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-nuance.jpg",
      description: "Green Diamond"
    },
    {
      color: TileColor.Pink,
      name: "Verra",
      image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-verra.jpg",
      description: "Pink Jigsaw"
    },
    {
      color: TileColor.Orange,
      name: "Corarica",
      image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-corarica.jpg",
      description: "Orange Chevron"
    },
    {
      color: TileColor.Blue,
      name: "Mt Holly",
      image: "/mora-jai-solver/images/corner-symbols/mount_holly.png",
      description: "Blue Throne"
    }
  ]

  return (
      <div className="app">
        <h1>Mora Jai Box Solver</h1>
        
        <div className="mode-controls">
          <button 
            className={`mode-button ${mode === 'setup' ? 'active' : ''}`}
            onClick={handleModeSwitch}
          >
            {mode === 'setup' ? '🎮 Switch to Play Mode' : '⚙️ Switch to Setup Mode'}
          </button>
        </div>

        {mode === 'setup' && (
          <div className="setup-controls">
            <div className="control-section">
              <h3>Set All Corners (Country Symbol):</h3>
              <div className="symbol-grid">
                {countrySymbols.map(symbol => (
                  <div
                    key={symbol.color}
                    className={`symbol-item ${puzzleState.targetCorners.every(c => c === symbol.color) ? 'selected' : ''}`}
                    onClick={() => handleTargetColorSelect(symbol.color)}
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
                    className={`color-btn ${color} ${setupState.selectedBrushColor === color ? 'selected' : ''}`}
                    onClick={() => handleBrushColorSelect(color)}
                  />
                ))}
              </div>
            </div>
            <div className="control-section">
              <h3>Load Premade Box:</h3>
              <select onChange={handlePremadeBoxSelect} defaultValue="">
                <option value="" disabled>Select a premade box...</option>
                {premadeBoxes.map(box => (
                  <option key={box.location} value={box.location}>
                    {box.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="main-layout">
          {/* Left Panel - Main Puzzle */}
          <div className="left-panel">
            <div className={`puzzle-container ${isWinning ? 'winning' : ''}`}>
              <div className="corner top-left" onClick={mode === 'setup' ? () => handleCornerTargetSelect(0, setupState.selectedBrushColor) : handleResetToInitial}>
                <div className={`corner-tile ${puzzleState.targetCorners[0]} ${puzzleState.corners[0] === puzzleState.targetCorners[0] ? 'winning' : ''}`}></div>
              </div>
              <div className="corner top-right" onClick={mode === 'setup' ? () => handleCornerTargetSelect(1, setupState.selectedBrushColor) : handleResetToInitial}>
                <div className={`corner-tile ${puzzleState.targetCorners[1]} ${puzzleState.corners[1] === puzzleState.targetCorners[1] ? 'winning' : ''}`}></div>
              </div>

              <div className="grid">
                {puzzleState.grid.map((row, rowIndex) =>
                    row.map((color, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`tile ${color} ${mode === 'setup' ? 'setup-mode' : ''} ${shouldHighlightTile(rowIndex, colIndex) ? 'highlighted' : ''}`}
                            onClick={() => handleTileClick(rowIndex, colIndex)}
                        >
                        </div>
                    ))
                )}
              </div>

              <div className="corner bottom-left"
                   onClick={mode === 'setup' ? () => handleCornerTargetSelect(2, setupState.selectedBrushColor) : handleResetToInitial}>
                <div className={`corner-tile ${puzzleState.targetCorners[2]} ${puzzleState.corners[2] === puzzleState.targetCorners[2] ? 'winning' : ''}`}></div>
              </div>
              <div className="corner bottom-right"
                   onClick={mode === 'setup' ? () => handleCornerTargetSelect(3, setupState.selectedBrushColor) : handleResetToInitial}>
                <div className={`corner-tile ${puzzleState.targetCorners[3]} ${puzzleState.corners[3] === puzzleState.targetCorners[3] ? 'winning' : ''}`}></div>
              </div>
            </div>

            <div className="info">
              {isWinning && (
                <div className="win-message">
                  <h2>🎉 Puzzle Solved! 🎉</h2>
                  <p>All corners match the target color!</p>
                </div>
              )}
              
              <p>Targets: Get corners to be 
                <span className={puzzleState.targetCorners[0]}>{puzzleState.targetCorners[0]}</span>, 
                <span className={puzzleState.targetCorners[1]}>{puzzleState.targetCorners[1]}</span>, 
                <span className={puzzleState.targetCorners[2]}>{puzzleState.targetCorners[2]}</span>, 
                <span className={puzzleState.targetCorners[3]}>{puzzleState.targetCorners[3]}</span>
              </p>
              
              {mode === 'setup' ? (
                <div>
                  <p>🎨 Setup Mode: Configure your puzzle</p>
                  <p>Select a brush color and click tiles to paint them</p>
                  <p>Click corner circles to set individual target colors</p>
                  <p>Or choose a country symbol to set all corners the same</p>
                </div>
              ) : (
                <div>
                  <p>🎮 Play Mode: Solve the puzzle</p>
                  <p>Click tiles to activate their behaviors</p>
                  <p>Click corners to reset to initial state</p>
                  
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
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Solution Display and Tile Behaviors */}
          <div className="center-panel">
            {mode === 'play' && solverState.showSolution && solverState.result && (
              <div className="solution-display">
                {solverState.result.solved ? (
                  <div>
                    <h4>✅ Solution Found!</h4>
                    <p><strong>Moves:</strong> {solverState.result.moves.length}</p>
                    <p><strong>Time:</strong> {solverState.result.timeMs.toFixed(1)}ms</p>
                    <p><strong>States explored:</strong> {solverState.result.totalStatesExplored.toLocaleString()}</p>
                    
                    <div className="moves-list">
                      <h5>Move Sequence:</h5>
                      
                      {/* Step Navigation Controls */}
                      <div className="step-controls">
                        <button 
                          className="step-button"
                          onClick={handleStepReset}
                          disabled={solverState.currentStep === -1}
                        >
                          ⏮️ Reset
                        </button>
                        <button 
                          className="step-button"
                          onClick={handleStepPrev}
                          disabled={solverState.currentStep <= -1}
                        >
                          ⬅️ Prev
                        </button>
                        <span className="step-indicator">
                          Step {solverState.currentStep + 1} of {solverState.result.moves.length}
                          {solverState.currentStep === -1 && " (Initial)"}
                        </span>
                        <button 
                          className="step-button"
                          onClick={handleStepNext}
                          disabled={solverState.currentStep >= solverState.result.moves.length - 1}
                        >
                          Next ➡️
                        </button>
                      </div>

                      {/* Current Step Highlight */}
                      {solverState.currentStep >= 0 && (
                        <div className="current-step">
                          <h6>Current Move:</h6>
                          <p className="highlighted-move">
                            {formatMoves(solverState.result.moves, solverState.result.states)[solverState.currentStep]}
                          </p>
                        </div>
                      )}

                      {/* Expected State Preview */}
                      {solverState.currentStep >= 0 && (
                        <div className="state-preview">
                          <h6>Expected State After Step {solverState.currentStep + 1}:</h6>
                          <div className="preview-grid">
                            {getCurrentStepState().grid.map((row, rowIndex) =>
                              row.map((color, colIndex) => (
                                <div
                                  key={`preview-${rowIndex}-${colIndex}`}
                                  className={`preview-tile ${color}`}
                                >
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                      
                      <ol>
                        {formatMoves(solverState.result.moves, solverState.result.states).map((move, index) => (
                          <li 
                            key={index}
                            className={index === solverState.currentStep ? 'current-step-item' : ''}
                          >
                            {move}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4>❌ No Solution Found</h4>
                    <p>Explored {solverState.result.totalStatesExplored.toLocaleString()} states in {solverState.result.timeMs.toFixed(1)}ms</p>
                    {(() => {
                      const estimate = estimateSolvability(puzzleState)
                      const hitLimit = solverState.result.totalStatesExplored >= maxStates
                      
                      if (hitLimit) {
                        return (
                          <p><strong>Analysis:</strong> Search limit reached - puzzle may be too complex or unsolvable</p>
                        )
                      } else if (!estimate.likely) {
                        return (
                          <p><strong>Analysis:</strong> {estimate.reason}</p>
                        )
                      } else {
                        return (
                          <p><strong>Analysis:</strong> Puzzle appears unsolvable with current configuration</p>
                        )
                      }
                    })()}
                  </div>
                )}
              </div>
            )}
            
            <details className="spoiler-section">
              <summary className="spoiler-toggle">Tile Behaviors</summary>
              <div className="spoiler-content">
                <h3>How Each Tile Works:</h3>
                <div className="behaviors-grid">
                  <div className="behavior-item">
                    <span className="white behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>White</strong>
                      <small>Expands to adjacent gray or turns gray</small>
                    </div>
                  </div>
                  <div className="behavior-item">
                    <span className="black behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>Black</strong>
                      <small>Moves row tiles right</small>
                    </div>
                  </div>
                  <div className="behavior-item">
                    <span className="red behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>Red</strong>
                      <small>White→Black, Black→Red</small>
                    </div>
                  </div>
                  <div className="behavior-item">
                    <span className="yellow behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>Yellow</strong>
                      <small>Moves up one position</small>
                    </div>
                  </div>
                  <div className="behavior-item">
                    <span className="purple behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>Purple</strong>
                      <small>Moves down one position</small>
                    </div>
                  </div>
                  <div className="behavior-item">
                    <span className="green behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>Green</strong>
                      <small>Swaps with mirrored position</small>
                    </div>
                  </div>
                  <div className="behavior-item">
                    <span className="pink behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>Pink</strong>
                      <small>Rotates adjacent tiles clockwise</small>
                    </div>
                  </div>
                  <div className="behavior-item">
                    <span className="orange behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>Orange</strong>
                      <small>Matches majority adjacent color</small>
                    </div>
                  </div>
                  <div className="behavior-item">
                    <span className="blue behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>Blue</strong>
                      <small>Copies center tile behavior</small>
                    </div>
                  </div>
                  <div className="behavior-item">
                    <span className="gray behavior-tile"></span>
                    <div className="behavior-info">
                      <strong>Gray</strong>
                      <small>No function (empty space)</small>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Right Panel - Country Symbols */}
          <div className="right-panel">
            <details className="spoiler-section">
              <summary className="spoiler-toggle">Country Symbols</summary>
              <div className="spoiler-content">
                <h3>Country Symbols & Target Colors:</h3>
                <div className="countries-grid">
                  <div className="country-item">
                    <img
                        src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-mora-jai.jpg"
                        alt="Mora Jai symbol"
                        className="country-symbol-img"
                    />
                    <div className="country-info">
                      <strong>Mora Jai</strong>
                      <span className="white legend-tile"></span>
                      <small>White Arch</small>
                    </div>
                  </div>
                  <div className="country-item">
                    <img
                        src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-orinda-aries.jpg"
                        alt="Orinda Aries symbol"
                        className="country-symbol-img"
                    />
                    <div className="country-info">
                      <strong>Orinda Aries</strong>
                      <span className="black legend-tile"></span>
                      <small>Black Mirror</small>
                    </div>
                  </div>
                  <div className="country-item">
                    <img
                        src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-fenn-aries.jpg"
                        alt="Fenn Aries symbol"
                        className="country-symbol-img"
                    />
                    <div className="country-info">
                      <strong>Fenn Aries</strong>
                      <span className="red legend-tile"></span>
                      <small>Red Pentagon</small>
                    </div>
                  </div>
                  <div className="country-item">
                    <img
                        src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-arch-aries.jpg"
                        alt="Arch Aries symbol"
                        className="country-symbol-img"
                    />
                    <div className="country-info">
                      <strong>Arch Aries</strong>
                      <span className="yellow legend-tile"></span>
                      <small>Yellow Mountain</small>
                    </div>
                  </div>
                  <div className="country-item">
                    <img
                        src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-eraja.jpg"
                        alt="Ejara symbol"
                        className="country-symbol-img"
                    />
                    <div className="country-info">
                      <strong>Ejara</strong>
                      <span className="purple legend-tile"></span>
                      <small>Purple Hourglass</small>
                    </div>
                  </div>
                  <div className="country-item">
                    <img
                        src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-nuance.jpg"
                        alt="Nuance symbol"
                        className="country-symbol-img"
                    />
                    <div className="country-info">
                      <strong>Nuance</strong>
                      <span className="green legend-tile"></span>
                      <small>Green Diamond</small>
                    </div>
                  </div>
                  <div className="country-item">
                    <img
                        src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-verra.jpg"
                        alt="Verra symbol"
                        className="country-symbol-img"
                    />
                    <div className="country-info">
                      <strong>Verra</strong>
                      <span className="pink legend-tile"></span>
                      <small>Pink Jigsaw</small>
                    </div>
                  </div>
                  <div className="country-item">
                    <img
                        src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/05/blue-prince-country-symbols-corarica.jpg"
                        alt="Corarica symbol"
                        className="country-symbol-img"
                    />
                    <div className="country-info">
                      <strong>Corarica</strong>
                      <span className="orange legend-tile"></span>
                      <small>Orange Chevron</small>
                    </div>
                  </div>
                  <div className="country-item">
                    <img
                        // src="/mora-jai-solver/images/corner-symbols/mount_holly.png"
                        alt="Mount Holly symbol"
                        className="country-symbol-img"
                    />
                    <div className="country-info">
                      <strong>Mt Holly</strong>
                      <span className="blue legend-tile"></span>
                      <small>Blue Throne</small>
                    </div>
                  </div>
                </div>
                <p className="spoiler-note">
                  <strong>How to solve:</strong> Look at the symbols in the
                  corners
                  of your puzzle box.
                  Each symbol represents a country. Get all four corners to match
                  that country's flag color,
                  then click the corners to complete the puzzle.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
  )
}

export default App
