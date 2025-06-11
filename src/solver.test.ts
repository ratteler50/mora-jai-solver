import {solvePuzzle, formatMoves, estimateSolvability, type PuzzleState} from './solver'
import {TileColor} from './tileLogic'

describe('Solver Tests', () => {
  test('solves already solved puzzle', () => {
    const solvedState: PuzzleState = {
      grid: [
        [TileColor.Red, TileColor.Gray, TileColor.Red],
        [TileColor.Gray, TileColor.Gray, TileColor.Gray],
        [TileColor.Red, TileColor.Gray, TileColor.Red]
      ],
      targetCorners: [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red]
    }

    const result = solvePuzzle(solvedState)

    expect(result.solved).toBe(true)
    expect(result.moves).toHaveLength(0)
    expect(result.totalStatesExplored).toBe(1)
    expect(result.maxDepthReached).toBe(0)
  })

  test('detects unsolvable puzzle with no functional tiles', () => {
    const unsolvableState: PuzzleState = {
      grid: [
        [TileColor.Gray, TileColor.Gray, TileColor.Gray],
        [TileColor.Gray, TileColor.Gray, TileColor.Gray],
        [TileColor.Gray, TileColor.Gray, TileColor.Gray]
      ],
      targetCorners: [TileColor.Gray, TileColor.Gray, TileColor.Gray, TileColor.Gray] // Gray target means no change needed, but also no functional tiles
    }

    const estimate = estimateSolvability(unsolvableState)

    expect(estimate.likely).toBe(false)
    expect(estimate.reason).toContain("No functional tiles")
  })

  test('detects puzzle missing target color', () => {
    const state: PuzzleState = {
      grid: [
        [TileColor.Blue, TileColor.Green, TileColor.Blue],
        [TileColor.Green, TileColor.Blue, TileColor.Green],
        [TileColor.Blue, TileColor.Green, TileColor.Blue]
      ],
      targetCorners: [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red]
    }

    const estimate = estimateSolvability(state)

    expect(estimate.likely).toBe(false)
    expect(estimate.reason).toContain("Target color(s) red not present on the grid")
  })

  test('solves simple one-move puzzle', () => {
    const simpleState: PuzzleState = {
      grid: [
        [TileColor.White, TileColor.Gray, TileColor.White],
        [TileColor.Gray, TileColor.Red, TileColor.Gray],
        [TileColor.Black, TileColor.Gray, TileColor.Black]
      ],
      targetCorners: [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red]
    }

    const result = solvePuzzle(simpleState)

    expect(result.solved).toBe(true)
    expect(result.moves.length).toBeGreaterThan(0)
    expect(result.totalStatesExplored).toBeGreaterThan(1)
    expect(result.maxDepthReached).toBeGreaterThanOrEqual(result.moves.length)
  })

  test('formats moves correctly', () => {
    const moves = [
      {row: 0, col: 1},
      {row: 2, col: 0}
    ]

    const testState: PuzzleState = {
      grid: [
        [TileColor.White, TileColor.Red, TileColor.Blue],
        [TileColor.Green, TileColor.Yellow, TileColor.Purple],
        [TileColor.Blue, TileColor.Orange, TileColor.Black]
      ],
      targetCorners: [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red]
    }

    const states = [testState, testState] // For this simple test
    const formatted = formatMoves(moves, states)

    expect(formatted).toHaveLength(2)
    expect(formatted[0]).toBe('Top Center Red')
    expect(formatted[1]).toBe('Bottom Left Blue')
  })

  test('performance limits prevent infinite loops', () => {
    const complexState: PuzzleState = {
      grid: [
        [TileColor.Pink, TileColor.Orange, TileColor.Blue],
        [TileColor.Green, TileColor.Yellow, TileColor.Purple],
        [TileColor.White, TileColor.Black, TileColor.Red]
      ],
      targetCorners: [TileColor.Gray, TileColor.Gray, TileColor.Gray, TileColor.Gray] // Impossible target
    }

    const testMaxStates = 1000 // Use smaller limit for testing performance
    const startTime = performance.now()
    const result = solvePuzzle(complexState, testMaxStates)
    const endTime = performance.now()

    // Should complete reasonably quickly even if unsolvable
    expect(endTime - startTime).toBeLessThan(5000) // 5 seconds max
    expect(result.totalStatesExplored).toBeGreaterThanOrEqual(testMaxStates) // Should hit the test max states limit
    expect(result.totalStatesExplored).toBeLessThan(testMaxStates + 100) // But not too far over
    expect(result.maxDepthReached).toBeGreaterThan(0) // Should have explored some depth
  })

  test('depth tracking works correctly', () => {
    // Create a simple puzzle that requires exactly 1 move
    const oneMovePuzzle: PuzzleState = {
      grid: [
        [TileColor.Red, TileColor.Gray, TileColor.Red],
        [TileColor.Gray, TileColor.Red, TileColor.Gray],
        [TileColor.Black, TileColor.Gray, TileColor.Black]
      ],
      targetCorners: [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red]
    }

    const result = solvePuzzle(oneMovePuzzle)

    // For a BFS solution, maxDepthReached should equal the solution length
    expect(result.maxDepthReached).toBe(result.moves.length)
    expect(result.maxDepthReached).toBeGreaterThan(0)

  })

  test('user reported bug - pink goal with specific setup', () => {
    const bugReportState: PuzzleState = {
      grid: [
        [TileColor.Pink, TileColor.Pink, TileColor.Gray],
        [TileColor.Gray, TileColor.Gray, TileColor.Gray],
        [TileColor.Orange, TileColor.Orange, TileColor.Orange]
      ],
      targetCorners: [TileColor.Pink, TileColor.Pink, TileColor.Pink, TileColor.Pink]
    }

    console.log('Testing user reported bug case...')
    console.log('Initial grid:')
    console.log('pink  pink  gray')
    console.log('gray  gray  gray')
    console.log('orange orange orange')
    console.log('Target: pink')
    console.log('')

    // Debug: Show the grid with coordinates
    console.log('Grid with coordinates:')
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        console.log(`(${row},${col}): ${bugReportState.grid[row][col]}`)
      }
    }
    console.log('')

    const result = solvePuzzle(bugReportState)

    if (result.solved) {
      console.log('Solution found!')
      console.log('Moves:', result.moves.length)

      // Format the moves and verify they make sense
      const formattedMoves = formatMoves(result.moves, result.states)
      console.log('Formatted moves:')
      formattedMoves.forEach(move => console.log('  ' + move))

      // Show the relationship between moves and states
      console.log('Move/State alignment check:')
      for (let i = 0; i < Math.min(3, result.moves.length); i++) {
        const move = result.moves[i]
        const state = result.states[i]
        const tileAtMovePosition = state.grid[move.row][move.col]

        console.log(`  Move ${i + 1}: Position (${move.row}, ${move.col})`)
        console.log(`    State ${i} at that position: ${tileAtMovePosition}`)
        console.log(`    Formatted: ${formattedMoves[i]}`)
      }

      // The key test: The first move should be valid for the initial state
      const firstMove = result.moves[0]
      const initialTileAtFirstMove = bugReportState.grid[firstMove.row][firstMove.col]
      console.log('')
      console.log(`Critical test: First move at (${firstMove.row}, ${firstMove.col})`)
      console.log(`  Initial state has: ${initialTileAtFirstMove}`)
      console.log(`  Should not be gray!`)

      expect(initialTileAtFirstMove).not.toBe(TileColor.Gray)
    } else {
      console.log('No solution found')
      console.log('States explored:', result.totalStatesExplored)
    }
  })
})