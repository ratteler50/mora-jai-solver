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
  type SolverResult
} from './solver'

type AppMode = 'setup' | 'play'

interface PuzzleState {
  grid: TileColorType[][]
  corners: TileColorType[]
  targetColor: TileColorType
}

interface SetupState {
  selectedBrushColor: TileColorType
}

interface SolverState {
  isRunning: boolean
  result: SolverResult | null
  showSolution: boolean
}

function App() {
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
    showSolution: false
  })
  const [initialPuzzleState, setInitialPuzzleState] = useState<PuzzleState>({
    grid: defaultGrid,
    corners: [defaultGrid[0][0], defaultGrid[0][2], defaultGrid[2][0], defaultGrid[2][2]],
    targetColor: TileColor.Red
  })
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    grid: defaultGrid,
    corners: [defaultGrid[0][0], defaultGrid[0][2], defaultGrid[2][0], defaultGrid[2][2]],
    targetColor: TileColor.Red
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
    setPuzzleState({
      ...puzzleState,
      targetColor: color
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
      showSolution: false
    })
  }

  const handleSolvePuzzle = async () => {
    setSolverState({
      isRunning: true,
      result: null,
      showSolution: false
    })

    // Run solver in next tick to allow UI to update
    setTimeout(() => {
      const result = solvePuzzle(puzzleState)
      setSolverState({
        isRunning: false,
        result: result,
        showSolution: true
      })
    }, 50)
  }

  const handleToggleSolution = () => {
    setSolverState({
      ...solverState,
      showSolution: !solverState.showSolution
    })
  }

  const checkWinCondition = (): boolean => {
    return mode === 'play' && puzzleState.corners.every(corner => corner === puzzleState.targetColor)
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
              <h3>Corner Symbol:</h3>
              <div className="symbol-grid">
                {countrySymbols.map(symbol => (
                  <div
                    key={symbol.color}
                    className={`symbol-item ${puzzleState.targetColor === symbol.color ? 'selected' : ''}`}
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
          </div>
        )}

        <div className="main-layout">
          {/* Left Panel - Main Puzzle */}
          <div className="left-panel">
            <div className={`puzzle-container ${isWinning ? 'winning' : ''}`}>
              <div className="corner top-left" onClick={mode === 'play' ? handleResetToInitial : undefined}>
                <div className={`corner-tile ${puzzleState.corners[0]} ${isWinning ? 'winning' : ''}`}></div>
              </div>
              <div className="corner top-right" onClick={mode === 'play' ? handleResetToInitial : undefined}>
                <div className={`corner-tile ${puzzleState.corners[1]} ${isWinning ? 'winning' : ''}`}></div>
              </div>

              <div className="grid">
                {puzzleState.grid.map((row, rowIndex) =>
                    row.map((color, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`tile ${color} ${mode === 'setup' ? 'setup-mode' : ''}`}
                            onClick={() => handleTileClick(rowIndex, colIndex)}
                        >
                        </div>
                    ))
                )}
              </div>

              <div className="corner bottom-left"
                   onClick={mode === 'play' ? handleResetToInitial : undefined}>
                <div className={`corner-tile ${puzzleState.corners[2]} ${isWinning ? 'winning' : ''}`}></div>
              </div>
              <div className="corner bottom-right"
                   onClick={mode === 'play' ? handleResetToInitial : undefined}>
                <div className={`corner-tile ${puzzleState.corners[3]} ${isWinning ? 'winning' : ''}`}></div>
              </div>
            </div>

            <div className="info">
              {isWinning && (
                <div className="win-message">
                  <h2>🎉 Puzzle Solved! 🎉</h2>
                  <p>All corners match the target color!</p>
                </div>
              )}
              
              <p>Target: Get all corners to be <span
                  className={puzzleState.targetColor}>{puzzleState.targetColor}</span>
              </p>
              
              {mode === 'setup' ? (
                <div>
                  <p>🎨 Setup Mode: Configure your puzzle</p>
                  <p>Select a brush color and click tiles to paint them</p>
                  <p>Choose your target color, then switch to Play Mode</p>
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
                      <ol>
                        {formatMoves(solverState.result.moves, solverState.result.states).map((move, index) => (
                          <li key={index}>{move}</li>
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
                      const hitLimit = solverState.result.totalStatesExplored >= 50000
                      
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
                        src="/mora-jai-solver/images/corner-symbols/mount_holly.png"
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
