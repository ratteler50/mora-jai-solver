import {useState} from 'react'
import './App.css'
import {
  TileColor,
  type TileColor as TileColorType,
} from './tileLogic'
import {
  solvePuzzle,
  type SolverResult,
  applyMove,
  type Move,
} from './solver'
import PuzzleGrid from './components/PuzzleGrid';
import SetupControls from './components/SetupControls';
import SolutionDisplay from './components/SolutionDisplay';
import TileBehaviorsInfo from './components/TileBehaviorsInfo';
import CountrySymbolsInfo from './components/CountrySymbolsInfo';

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
      const move: Move = { row, col };
      const newSolverState = applyMove(puzzleState, move);

      setPuzzleState({
        ...puzzleState, // Preserve targetCorners
        grid: newSolverState.grid,
        corners: newSolverState.corners,
      });
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

  const handleGridCornerClick = (cornerIndex: number) => {
    if (mode === 'setup') {
      setPuzzleState(prevState => {
        const newTargetCorners = [...prevState.targetCorners];
        newTargetCorners[cornerIndex] = setupState.selectedBrushColor;
        return { ...prevState, targetCorners: newTargetCorners };
      });
    } else {
      handleResetToInitial(); // Play mode corner click resets
    }
  };

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

  // getCurrentStepState is now passed as a prop to SolutionDisplay
  // const getCurrentStepState = (): PuzzleState | null => {
  const isWinning = checkWinCondition();

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
          <SetupControls
            puzzleTargetCorners={puzzleState.targetCorners}
            selectedBrushColor={setupState.selectedBrushColor}
            countrySymbols={countrySymbols}
            allColors={allColors}
            onBrushColorSelect={handleBrushColorSelect}
            onTargetColorSelect={handleTargetColorSelect}
          />
        )}

        <div className="main-layout">
          {/* Left Panel - Main Puzzle */}
          <div className="left-panel">
            <div className={`puzzle-container ${isWinning ? 'winning' : ''}`}>
              <PuzzleGrid
                grid={puzzleState.grid}
                targetCorners={puzzleState.targetCorners}
                currentCorners={puzzleState.corners}
                mode={mode}
                handleTileClick={handleTileClick}
                handleCornerClick={handleGridCornerClick}
                shouldHighlightTile={shouldHighlightTile}
              />
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
                  {/* Solver buttons are now in SolutionDisplay, this div is removed. */}
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Solution Display and Tile Behaviors */}
          <div className="center-panel">
            <SolutionDisplay
              mode={mode}
              solverState={solverState}
              puzzleStateForEstimator={puzzleState}
              handleSolvePuzzle={handleSolvePuzzle}
              handleToggleSolution={handleToggleSolution}
              handleStepNext={handleStepNext}
              handleStepPrev={handleStepPrev}
              handleStepReset={handleStepReset}
              getCurrentStepState={() => {
                if (!solverState.result || !solverState.result.solved || solverState.currentStep < 0) {
                  return null;
                }
                // Return the state after the current step (currentStep + 1 because states[0] is initial state)
                return solverState.result.states[solverState.currentStep + 1] || null;
              }}
              isWinning={isWinning}
            />
            <TileBehaviorsInfo />
          </div>

          {/* Right Panel - Country Symbols */}
          <div className="right-panel">
            <CountrySymbolsInfo countrySymbols={countrySymbols} />
          </div>
        </div>
      </div>
  )
}

export default App
