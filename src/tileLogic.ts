export const TileColor = {
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

export type TileColor = typeof TileColor[keyof typeof TileColor]

export const applyBlackTileLogic = (grid: TileColor[][], row: number): TileColor[][] => {
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

export const applyRedTileLogic = (grid: TileColor[][]): TileColor[][] => {
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

export const applyGreenTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
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

export const applyYellowTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
  const newGrid = grid.map(r => [...r])
  // Move tile up one position
  if (row > 0) {
    const temp = newGrid[row - 1][col]
    newGrid[row - 1][col] = newGrid[row][col]
    newGrid[row][col] = temp
  }
  return newGrid
}

export const applyPinkTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
  const newGrid = grid.map(r => [...r])
  
  // Define positions in true clockwise order starting from top-left
  const surroundingPositions = [
    [row-1, col-1], [row-1, col], [row-1, col+1],  // Top row: left to right
    [row, col+1],                                   // Right side
    [row+1, col+1], [row+1, col], [row+1, col-1],  // Bottom row: right to left  
    [row, col-1]                                    // Left side
  ]
  
  // Get valid positions and their colors
  const validPositions: Array<[number, number]> = []
  const surroundingColors: TileColor[] = []
  surroundingPositions.forEach(([r, c]) => {
    if (r >= 0 && r < 3 && c >= 0 && c < 3) {
      validPositions.push([r, c])
      surroundingColors.push(grid[r][c])
    }
  })
  
  // Rotate clockwise: each tile gets the color of the previous tile in the sequence
  validPositions.forEach((position, index) => {
    const [r, c] = position
    const prevIndex = (index - 1 + surroundingColors.length) % surroundingColors.length
    newGrid[r][c] = surroundingColors[prevIndex]
  })
  
  return newGrid
}

export const applyPurpleTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
  const newGrid = grid.map(r => [...r])
  // Move tile down one position
  if (row < 2) {
    const temp = newGrid[row + 1][col]
    newGrid[row + 1][col] = newGrid[row][col]
    newGrid[row][col] = temp
  }
  return newGrid
}

export const applyOrangeTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
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
  let colorsWithMaxCount = 0
  
  Object.entries(adjacentColors).forEach(([color, count]) => {
    if (count > maxCount) {
      maxCount = count
      mostCommonColor = color as TileColor
      colorsWithMaxCount = 1
    } else if (count === maxCount) {
      colorsWithMaxCount++
    }
  })
  
  // Only change if there's a clear majority (only one color has the max count)
  if (colorsWithMaxCount === 1 && maxCount > 0) {
    newGrid[row][col] = mostCommonColor
  }
  
  return newGrid
}

export const applyWhiteTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
  const newGrid = grid.map(r => [...r])
  
  // White tile behavior: 
  // 1. Clicked white turns gray
  // 2. Adjacent gray tiles turn white
  // 3. Adjacent white tiles turn gray
  // 4. All other tiles remain unchanged
  
  // First: Clicked white turns gray
  newGrid[row][col] = TileColor.Gray
  
  // Second: Handle adjacent tiles
  const adjacentPositions = [
    [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]
  ]
  
  adjacentPositions.forEach(([r, c]) => {
    if (r >= 0 && r < 3 && c >= 0 && c < 3) {
      if (grid[r][c] === TileColor.Gray) {
        newGrid[r][c] = TileColor.White
      } else if (grid[r][c] === TileColor.White) {
        newGrid[r][c] = TileColor.Gray
      }
    }
  })
  
  return newGrid
}

export const applyBlueTileLogic = (grid: TileColor[][], row: number, col: number): TileColor[][] => {
  const newGrid = grid.map(r => [...r])
  const centerTileColor = grid[1][1] // Middle tile (1,1)
  
  // Copy the behavior of the center tile (apply to blue tile's own position)
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
    case TileColor.White: {
      // Blue copying white behavior: only affects blue tile and adjacent grays
      // 1. Blue tile (acting as white) turns gray
      newGrid[row][col] = TileColor.Gray
      
      // 2. Adjacent gray tiles turn blue (only grays, whites remain unchanged)
      const adjacentPositions = [
        [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]
      ]
      
      adjacentPositions.forEach(([r, c]) => {
        if (r >= 0 && r < 3 && c >= 0 && c < 3) {
          if (grid[r][c] === TileColor.Gray) {
            newGrid[r][c] = TileColor.Blue // Gray becomes blue
          } else if (grid[r][c] === TileColor.Blue) {
            newGrid[r][c] = TileColor.Gray // Adjacent blue becomes gray
          }
        }
      })
      return newGrid
    }
    case TileColor.Blue:
      // Blue copying blue - do nothing to avoid infinite recursion
      break
  }
  
  return newGrid
}