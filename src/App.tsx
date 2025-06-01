import { useState } from 'react'
import './App.css'

const TileColor = {
  White: 'white',
  Pink: 'pink',
  Green: 'green',
  Orange: 'orange',
  Blue: 'blue',
  Red: 'red',
  Yellow: 'yellow'
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
      [TileColor.White, TileColor.Pink, TileColor.White],
      [TileColor.Green, TileColor.Orange, TileColor.Green],
      [TileColor.White, TileColor.Pink, TileColor.White]
    ],
    corners: [TileColor.White, TileColor.White, TileColor.White, TileColor.White],
    targetColor: TileColor.Orange
  })

  const handleTileClick = (row: number, col: number) => {
    const currentColor = puzzleState.grid[row][col]
    const newState = { ...puzzleState }
    
    switch (currentColor) {
      case TileColor.White:
        newState.grid = applyWhiteTileLogic(newState.grid, row, col)
        break
      case TileColor.Pink:
        newState.grid = applyPinkTileLogic(newState.grid, row, col)
        break
      case TileColor.Green:
        newState.grid = applyGreenTileLogic(newState.grid, row, col)
        break
      case TileColor.Orange:
        newState.grid = applyOrangeTileLogic(newState.grid, row, col)
        break
    }
    
    newState.corners = updateCorners(newState.grid)
    setPuzzleState(newState)
  }

  const applyWhiteTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
    const newGrid = grid.map(r => [...r])
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]]
    
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr
      const newCol = col + dc
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        newGrid[newRow][newCol] = getNextColor(newGrid[newRow][newCol])
      }
    })
    
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
    
    let mostCommonColor: TileColor = TileColor.Orange
    let maxCount = 0
    Object.entries(adjacentColors).forEach(([color, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostCommonColor = color as TileColor
      }
    })
    
    newGrid[row][col] = mostCommonColor
    return newGrid
  }

  const getNextColor = (color: TileColor): TileColor => {
    const colors: TileColor[] = [TileColor.White, TileColor.Pink, TileColor.Green, TileColor.Orange]
    const currentIndex = colors.indexOf(color)
    return colors[(currentIndex + 1) % colors.length]
  }

  const updateCorners = (grid: TileColor[][]): TileColor[] => {
    return [
      grid[0][0], grid[0][2], grid[2][0], grid[2][2]
    ]
  }

  const handleCornerClick = () => {
    setPuzzleState({
      grid: [
        [TileColor.White, TileColor.Pink, TileColor.White],
        [TileColor.Green, TileColor.Orange, TileColor.Green],
        [TileColor.White, TileColor.Pink, TileColor.White]
      ],
      corners: [TileColor.White, TileColor.White, TileColor.White, TileColor.White],
      targetColor: TileColor.Orange
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
        <p>CURRENTLY WIP!  Right now only allows actions not solving!</p>
      </div>
    </div>
  )
}

export default App
