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

export interface PuzzleState {
  grid: TileColorType[][]
  corners: TileColorType[]
  targetColor: TileColorType
}

export interface Move {
  row: number
  col: number
  // Note: We don't store color here because tiles can move during the solution
  // The color should be determined by looking at the grid at the time of the move
}

export interface SolverResult {
  solved: boolean
  moves: Move[]
  states: PuzzleState[]
  totalStatesExplored: number
  timeMs: number
}

// Helper function to create a string key from a grid state for visited tracking
const gridToKey = (grid: TileColorType[][]): string => {
  return grid.flat().join(',')
}

// Helper function to check if puzzle is solved
const isSolved = (state: PuzzleState): boolean => {
  return state.corners.every(corner => corner === state.targetColor)
}

// Helper function to update corners from grid
const updateCorners = (grid: TileColorType[][]): TileColorType[] => {
  return [grid[0][0], grid[0][2], grid[2][0], grid[2][2]]
}

// Apply a specific tile's logic to get the new state
const applyMove = (state: PuzzleState, move: Move): PuzzleState => {
  const { row, col } = move
  let newGrid = state.grid.map(r => [...r])
  const tileColor = state.grid[row][col] // Get the current color at this position

  switch (tileColor) {
    case TileColor.Gray:
      // Gray tiles do nothing
      break
    case TileColor.Black:
      newGrid = applyBlackTileLogic(newGrid, row)
      break
    case TileColor.Red:
      newGrid = applyRedTileLogic(newGrid)
      break
    case TileColor.Green:
      newGrid = applyGreenTileLogic(newGrid, row, col)
      break
    case TileColor.Yellow:
      newGrid = applyYellowTileLogic(newGrid, row, col)
      break
    case TileColor.Pink:
      newGrid = applyPinkTileLogic(newGrid, row, col)
      break
    case TileColor.Purple:
      newGrid = applyPurpleTileLogic(newGrid, row, col)
      break
    case TileColor.Orange:
      newGrid = applyOrangeTileLogic(newGrid, row, col)
      break
    case TileColor.White:
      newGrid = applyWhiteTileLogic(newGrid, row, col)
      break
    case TileColor.Blue:
      newGrid = applyBlueTileLogic(newGrid, row, col)
      break
  }

  return {
    grid: newGrid,
    corners: updateCorners(newGrid),
    targetColor: state.targetColor
  }
}

// Generate all possible moves from current state
const generateMoves = (state: PuzzleState): Move[] => {
  const moves: Move[] = []
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const color = state.grid[row][col]
      // Skip gray tiles as they do nothing
      if (color !== TileColor.Gray) {
        moves.push({ row, col })
      }
    }
  }
  
  return moves
}

// Main solver function using BFS to find optimal solution
export const solvePuzzle = (initialState: PuzzleState): SolverResult => {
  const startTime = performance.now()
  
  if (isSolved(initialState)) {
    return {
      solved: true,
      moves: [],
      states: [initialState],
      totalStatesExplored: 1,
      timeMs: performance.now() - startTime
    }
  }

  const queue: Array<{
    state: PuzzleState
    moves: Move[]
    states: PuzzleState[]
  }> = [{
    state: initialState,
    moves: [],
    states: [initialState]
  }]
  
  const visited = new Set<string>()
  visited.add(gridToKey(initialState.grid))
  
  let statesExplored = 1
  const maxStates = 5000000 // Prevent infinite loops or excessive computation
  
  while (queue.length > 0 && statesExplored < maxStates) {
    const current = queue.shift()!
    const possibleMoves = generateMoves(current.state)
    
    for (const move of possibleMoves) {
      const newState = applyMove(current.state, move)
      const stateKey = gridToKey(newState.grid)
      
      // Skip if we've seen this state before
      if (visited.has(stateKey)) {
        continue
      }
      
      visited.add(stateKey)
      statesExplored++
      
      const newMoves = [...current.moves, move]
      const newStates = [...current.states, newState]
      
      // Check if this state is solved
      if (isSolved(newState)) {
        return {
          solved: true,
          moves: newMoves,
          states: newStates,
          totalStatesExplored: statesExplored,
          timeMs: performance.now() - startTime
        }
      }
      
      // Add to queue for further exploration
      queue.push({
        state: newState,
        moves: newMoves,
        states: newStates
      })
    }
  }
  
  // No solution found within limits
  return {
    solved: false,
    moves: [],
    states: [initialState],
    totalStatesExplored: statesExplored,
    timeMs: performance.now() - startTime
  }
}

// Helper function to convert grid coordinates to descriptive position names
const getPositionName = (row: number, col: number): string => {
  const rowNames = ['Top', 'Center', 'Bottom']
  const colNames = ['Left', 'Center', 'Right']
  
  return `${rowNames[row]} ${colNames[col]}`
}

// Helper function to format moves for display using the stored states
export const formatMoves = (moves: Move[], states: PuzzleState[]): string[] => {
  const formattedMoves: string[] = []
  
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i]
    const currentState = states[i] // Use the state at the time this move was made
    const tileColor = currentState.grid[move.row][move.col]
    const positionName = getPositionName(move.row, move.col)
    
    formattedMoves.push(
      `${i + 1}. Click ${tileColor} tile at ${positionName}`
    )
  }
  
  return formattedMoves
}

// Helper function to estimate if a puzzle might be solvable (heuristic)
export const estimateSolvability = (state: PuzzleState): {
  likely: boolean
  reason: string
} => {
  // Basic heuristics to help users understand why puzzles might be unsolvable
  
  // Check if target color exists on the grid
  const hasTargetColor = state.grid.flat().includes(state.targetColor)
  if (!hasTargetColor) {
    return {
      likely: false,
      reason: `Target color ${state.targetColor} is not present on the grid`
    }
  }
  
  // Check if there are any functional tiles (non-gray)
  const functionalTiles = state.grid.flat().filter(color => color !== TileColor.Gray)
  if (functionalTiles.length === 0) {
    return {
      likely: false,
      reason: "No functional tiles available (all gray)"
    }
  }
  
  // Check if there are tiles that can potentially affect corners
  let canAffectCorners = false
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const color = state.grid[row][col]
      if (color === TileColor.Gray) continue
      
      // These tiles can directly affect corners or move pieces around
      const effectiveTiles: TileColorType[] = [
        TileColor.Green, TileColor.Yellow, TileColor.Purple, TileColor.Pink, 
        TileColor.White, TileColor.Red, TileColor.Black, TileColor.Orange,
        TileColor.Blue
      ]
      
      if (effectiveTiles.includes(color)) {
        canAffectCorners = true
        break
      }
    }
  }
  
  if (!canAffectCorners) {
    return {
      likely: false,
      reason: "No tiles that can meaningfully affect corner positions"
    }
  }
  
  return {
    likely: true,
    reason: "Puzzle appears solvable"
  }
}