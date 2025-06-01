import { useState } from 'react'
import './App.css'

const TileColor = {
  Gray: 'gray',
  Black: 'black',
  Red: 'red',
  Green: 'green',
  Yellow: 'yellow',
  Pink: 'pink',
  Purple: 'purple',
  Orange: 'orange',
  White: 'white',
  Blue: 'blue'
} as const

type TileColor = typeof TileColor[keyof typeof TileColor]

interface PuzzleState {
  grid: TileColor[][]
  corners: TileColor[]
  targetColor: TileColor
}

function App() {
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    grid: [
      [TileColor.White, TileColor.Pink, TileColor.Gray],
      [TileColor.Green, TileColor.Orange, TileColor.Blue],
      [TileColor.Yellow, TileColor.Purple, TileColor.Black]
    ],
    corners: [TileColor.White, TileColor.Gray, TileColor.Yellow, TileColor.Black],
    targetColor: TileColor.Red
  })

  const handleTileClick = (row: number, col: number) => {
    const currentColor = puzzleState.grid[row][col]
    const newState = { ...puzzleState }
    
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

  const applyBlackTileLogic = (grid: TileColor[][], row: number): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    // Move all tiles in the row one position to the right
    const currentRow = newGrid[row]
    const lastTile = currentRow[2]
    for (let i = 2; i > 0; i--) {
      currentRow[i] = currentRow[i - 1]
    }
    currentRow[0] = lastTile
    return newGrid
  }

  const applyRedTileLogic = (grid: TileColor[][]): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    // Turn all white tiles black and all black tiles red
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (newGrid[r][c] === TileColor.White) {
          newGrid[r][c] = TileColor.Black
        } else if (newGrid[r][c] === TileColor.Black) {
          newGrid[r][c] = TileColor.Red
        }
      }
    }
    return newGrid
  }

  const applyYellowTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    // Move tile up one position
    if (row > 0) {
      const temp = newGrid[row - 1][col]
      newGrid[row - 1][col] = newGrid[row][col]
      newGrid[row][col] = temp
    }
    return newGrid
  }

  const applyPurpleTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    // Move tile down one position
    if (row < 2) {
      const temp = newGrid[row + 1][col]
      newGrid[row + 1][col] = newGrid[row][col]
      newGrid[row][col] = temp
    }
    return newGrid
  }

  const applyWhiteTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    const adjacentPositions = [
      [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]
    ]
    
    let hasAdjacentGray = false
    adjacentPositions.forEach(([r, c]) => {
      if (r >= 0 && r < 3 && c >= 0 && c < 3 && grid[r][c] === TileColor.Gray) {
        hasAdjacentGray = true
        newGrid[r][c] = TileColor.White // Turn gray tiles white
      }
    })
    
    if (!hasAdjacentGray) {
      newGrid[row][col] = TileColor.Gray // White tile turns gray
    }
    
    return newGrid
  }

  const applyBlueTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    const centerTileColor = grid[1][1] // Middle tile (1,1)
    
    // Copy the behavior of the center tile
    switch (centerTileColor) {
      case TileColor.Gray:
        // Do nothing
        break
      case TileColor.Black:
        return applyBlackTileLogic(newGrid, row)
      case TileColor.Red:
        return applyRedTileLogic(newGrid)
      case TileColor.Green:
        return applyGreenTileLogic(newGrid, row, col)
      case TileColor.Yellow:
        return applyYellowTileLogic(newGrid, row, col)
      case TileColor.Pink:
        return applyPinkTileLogic(newGrid, row, col)
      case TileColor.Purple:
        return applyPurpleTileLogic(newGrid, row, col)
      case TileColor.Orange:
        return applyOrangeTileLogic(newGrid, row, col)
      case TileColor.White:
        return applyWhiteTileLogic(newGrid, row, col)
      case TileColor.Blue:
        // Blue copying blue - do nothing to avoid infinite recursion
        break
    }
    
    return newGrid
  }

  const applyPinkTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    const surroundingPositions = [
      [row-1, col-1], [row-1, col], [row-1, col+1],
      [row, col-1], [row, col+1],
      [row+1, col-1], [row+1, col], [row+1, col+1]
    ]
    
    const surroundingColors: TileColor[] = []
    surroundingPositions.forEach(([r, c]) => {
      if (r >= 0 && r < 3 && c >= 0 && c < 3) {
        surroundingColors.push(grid[r][c])
      }
    })
    
    let colorIndex = 0
    surroundingPositions.forEach(([r, c]) => {
      if (r >= 0 && r < 3 && c >= 0 && c < 3) {
        const nextIndex = (colorIndex + 1) % surroundingColors.length
        newGrid[r][c] = surroundingColors[nextIndex]
        colorIndex++
      }
    })
    
    return newGrid
  }

  const applyGreenTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    const mirrorRow = 2 - row
    const mirrorCol = 2 - col
    
    if (mirrorRow >= 0 && mirrorRow < 3 && mirrorCol >= 0 && mirrorCol < 3) {
      const temp = newGrid[row][col]
      newGrid[row][col] = newGrid[mirrorRow][mirrorCol]
      newGrid[mirrorRow][mirrorCol] = temp
    }
    
    return newGrid
  }

  const applyOrangeTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    const adjacentPositions = [
      [row-1, col], [row+1, col], [row, col-1], [row, col+1]
    ]
    
    const adjacentColors: { [key: string]: number } = {}
    adjacentPositions.forEach(([r, c]) => {
      if (r >= 0 && r < 3 && c >= 0 && c < 3) {
        const color = grid[r][c]
        adjacentColors[color] = (adjacentColors[color] || 0) + 1
      }
    })
    
    let mostCommonColor: TileColor = grid[row][col] // Keep current color as default
    let maxCount = 0
    let hasMultipleMajorities = false
    
    Object.entries(adjacentColors).forEach(([color, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostCommonColor = color as TileColor
        hasMultipleMajorities = false
      } else if (count === maxCount && maxCount > 0) {
        hasMultipleMajorities = true
      }
    })
    
    // Only change if there's a clear majority
    if (!hasMultipleMajorities && maxCount > 0) {
      newGrid[row][col] = mostCommonColor
    }
    
    return newGrid
  }


  const updateCorners = (grid: TileColor[][]): TileColor[] => {
    return [
      grid[0][0], grid[0][2], grid[2][0], grid[2][2]
    ]
  }

  const handleCornerClick = () => {
    setPuzzleState({
      grid: [
        [TileColor.White, TileColor.Pink, TileColor.Gray],
        [TileColor.Green, TileColor.Orange, TileColor.Blue],
        [TileColor.Yellow, TileColor.Purple, TileColor.Black]
      ],
      corners: [TileColor.White, TileColor.Gray, TileColor.Yellow, TileColor.Black],
      targetColor: TileColor.Red
    })
  }

  return (
    <div className="app">
      <h1>Mora Jai Box Solver</h1>
      <div className="puzzle-container">
        <div className="corner top-left" onClick={() => handleCornerClick()}>
          <div className={`corner-tile ${puzzleState.corners[0]}`}></div>
        </div>
        <div className="corner top-right" onClick={() => handleCornerClick()}>
          <div className={`corner-tile ${puzzleState.corners[1]}`}></div>
        </div>
        
        <div className="grid">
          {puzzleState.grid.map((row, rowIndex) => 
            row.map((color, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`tile ${color}`}
                onClick={() => handleTileClick(rowIndex, colIndex)}
              >
              </div>
            ))
          )}
        </div>

        <div className="corner bottom-left" onClick={() => handleCornerClick()}>
          <div className={`corner-tile ${puzzleState.corners[2]}`}></div>
        </div>
        <div className="corner bottom-right" onClick={() => handleCornerClick()}>
          <div className={`corner-tile ${puzzleState.corners[3]}`}></div>
        </div>
      </div>
      
      <div className="info">
        <p>Target: Get all corners to be <span className={puzzleState.targetColor}>{puzzleState.targetColor}</span></p>
        <p>Click corners to reset puzzle</p>
        <div className="tile-legend">
          <h3>Tile Behaviors:</h3>
          <div className="legend-grid">
            <div><span className="gray legend-tile"></span> Gray — No function</div>
            <div><span className="black legend-tile"></span> Black — Moves row tiles right</div>
            <div><span className="red legend-tile"></span> Red — White→Black, Black→Red</div>
            <div><span className="green legend-tile"></span> Green — Swaps with mirrored position</div>
            <div><span className="yellow legend-tile"></span> Yellow — Moves up one position</div>
            <div><span className="pink legend-tile"></span> Pink — Rotates adjacent tiles clockwise</div>
            <div><span className="purple legend-tile"></span> Purple — Moves down one position</div>
            <div><span className="orange legend-tile"></span> Orange — Matches majority adjacent color</div>
            <div><span className="white legend-tile"></span> White — Expands to adjacent gray or turns gray</div>
            <div><span className="blue legend-tile"></span> Blue — Copies center tile behavior</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
