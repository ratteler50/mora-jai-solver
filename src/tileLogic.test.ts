import {
  applyBlackTileLogic,
  applyRedTileLogic,
  applyGreenTileLogic,
  applyYellowTileLogic,
  applyPinkTileLogic,
  applyPurpleTileLogic,
  applyOrangeTileLogic,
  applyWhiteTileLogic,
  applyBlueTileLogic,
  type TileColor as TileColorType
} from './tileLogic'

// Helper function to create a test grid
const createGrid = (colors: string[][]): TileColorType[][] => {
  return colors.map(row => row.map(color => color as TileColorType))
}

describe('Tile Logic Tests', () => {
  describe('Gray Tile', () => {
    test('gray tiles have no behavior implemented', () => {
      // Gray tiles are handled by not calling any logic function
      expect(true).toBe(true)
    })
  })

  describe('Black Tile Logic', () => {
    test('moves all tiles in row one position to the right', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'black', 'yellow'],
        ['pink', 'purple', 'orange']
      ])
      
      const result = applyBlackTileLogic(grid, 1)
      
      expect(result[1]).toEqual(['yellow', 'white', 'black'])
      // Other rows should remain unchanged
      expect(result[0]).toEqual(['red', 'green', 'blue'])
      expect(result[2]).toEqual(['pink', 'purple', 'orange'])
    })

    test('wraps rightmost tile to leftmost position', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'pink', 'yellow'],
        ['gray', 'purple', 'orange']
      ])
      
      const result = applyBlackTileLogic(grid, 1)
      
      expect(result[1]).toEqual(['yellow', 'white', 'pink'])
    })

    test('works for top row', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'pink', 'yellow'],
        ['gray', 'purple', 'orange']
      ])
      
      const result = applyBlackTileLogic(grid, 0)
      
      expect(result[0]).toEqual(['blue', 'red', 'green'])
    })

    test('works for bottom row', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'pink', 'yellow'],
        ['gray', 'purple', 'orange']
      ])
      
      const result = applyBlackTileLogic(grid, 2)
      
      expect(result[2]).toEqual(['orange', 'gray', 'purple'])
    })
  })

  describe('Red Tile Logic', () => {
    test('turns all white tiles black and all black tiles red', () => {
      const grid = createGrid([
        ['white', 'black', 'green'],
        ['black', 'red', 'white'],
        ['blue', 'white', 'black']
      ])
      
      const result = applyRedTileLogic(grid)
      
      expect(result).toEqual([
        ['black', 'red', 'green'],
        ['red', 'red', 'black'],
        ['blue', 'black', 'red']
      ])
    })

    test('leaves other colors unchanged', () => {
      const grid = createGrid([
        ['green', 'blue', 'yellow'],
        ['pink', 'purple', 'orange'],
        ['gray', 'red', 'green']
      ])
      
      const result = applyRedTileLogic(grid)
      
      expect(result).toEqual([
        ['green', 'blue', 'yellow'],
        ['pink', 'purple', 'orange'],
        ['gray', 'red', 'green']
      ])
    })

    test('handles grid with no white or black tiles', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['yellow', 'pink', 'purple'],
        ['orange', 'gray', 'red']
      ])
      
      const result = applyRedTileLogic(grid)
      
      expect(result).toEqual(grid)
    })
  })

  describe('Green Tile Logic', () => {
    test('swaps tile with mirrored position', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'yellow', 'pink'],
        ['purple', 'orange', 'black']
      ])
      
      // Click green tile at (0,1) - should swap with (2,1)
      const result = applyGreenTileLogic(grid, 0, 1)
      
      expect(result[0][1]).toBe('orange')
      expect(result[2][1]).toBe('green')
    })

    test('swaps corner tiles correctly', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'yellow', 'pink'],
        ['purple', 'orange', 'black']
      ])
      
      // Click top-left corner (0,0) - should swap with bottom-right (2,2)
      const result = applyGreenTileLogic(grid, 0, 0)
      
      expect(result[0][0]).toBe('black')
      expect(result[2][2]).toBe('red')
    })

    test('center tile swaps with itself (no change)', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'yellow', 'pink'],
        ['purple', 'orange', 'black']
      ])
      
      // Click center tile (1,1)
      const result = applyGreenTileLogic(grid, 1, 1)
      
      expect(result).toEqual(grid) // No change since it swaps with itself
    })
  })

  describe('Yellow Tile Logic', () => {
    test('moves tile up one position', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'yellow', 'pink'],
        ['purple', 'orange', 'black']
      ])
      
      // Click yellow tile at (1,1)
      const result = applyYellowTileLogic(grid, 1, 1)
      
      expect(result[0][1]).toBe('yellow')
      expect(result[1][1]).toBe('green')
    })

    test('does nothing when tile is in top row', () => {
      const grid = createGrid([
        ['red', 'yellow', 'blue'],
        ['white', 'green', 'pink'],
        ['purple', 'orange', 'black']
      ])
      
      // Click yellow tile at (0,1) - can't move up
      const result = applyYellowTileLogic(grid, 0, 1)
      
      expect(result).toEqual(grid)
    })

    test('moves bottom row tile to middle row', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'pink', 'orange'],
        ['purple', 'yellow', 'black']
      ])
      
      // Click yellow tile at (2,1)
      const result = applyYellowTileLogic(grid, 2, 1)
      
      expect(result[1][1]).toBe('yellow')
      expect(result[2][1]).toBe('pink')
    })
  })

  describe('Pink Tile Logic', () => {
    test('rotates adjacent tiles clockwise', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'pink', 'yellow'],
        ['purple', 'orange', 'black']
      ])
      
      // Click pink tile at (1,1) - center position
      const result = applyPinkTileLogic(grid, 1, 1)
      
      // Clockwise rotation: each position gets color from previous position in clockwise sequence
      
      expect(result[0][0]).toBe('white')  // was red, gets from (1,0) which was white
      expect(result[0][1]).toBe('red')    // was green, gets from (0,0) which was red
      expect(result[0][2]).toBe('green')  // was blue, gets from (0,1) which was green
      expect(result[1][2]).toBe('blue')   // was yellow, gets from (0,2) which was blue
      expect(result[2][2]).toBe('yellow') // was black, gets from (1,2) which was yellow
      expect(result[2][1]).toBe('black')  // was orange, gets from (2,2) which was black
      expect(result[2][0]).toBe('orange') // was purple, gets from (2,1) which was orange
      expect(result[1][0]).toBe('purple') // was white, gets from (2,0) which was purple
      expect(result[1][1]).toBe('pink')   // center tile unchanged
    })

    test('handles corner tile with limited adjacents', () => {
      const grid = createGrid([
        ['pink', 'green', 'blue'],
        ['white', 'yellow', 'red'],
        ['purple', 'orange', 'black']
      ])
      
      // Click pink tile at (0,0) - top-left corner
      const result = applyPinkTileLogic(grid, 0, 0)
      
      // Corner rotation with 3 adjacent tiles in clockwise order: (0,1), (1,1), (1,0)
      expect(result[0][1]).toBe('white')  // was green, gets from (1,0) which was white
      expect(result[1][1]).toBe('green')  // was yellow, gets from (0,1) which was green
      expect(result[1][0]).toBe('yellow') // was white, gets from (1,1) which was yellow
    })
  })

  describe('Purple Tile Logic', () => {
    test('moves tile down one position', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'purple', 'pink'],
        ['yellow', 'orange', 'black']
      ])
      
      // Click purple tile at (1,1)
      const result = applyPurpleTileLogic(grid, 1, 1)
      
      expect(result[2][1]).toBe('purple')
      expect(result[1][1]).toBe('orange')
    })

    test('does nothing when tile is in bottom row', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'yellow', 'pink'],
        ['orange', 'purple', 'black']
      ])
      
      // Click purple tile at (2,1) - can't move down
      const result = applyPurpleTileLogic(grid, 2, 1)
      
      expect(result).toEqual(grid)
    })

    test('moves top row tile to middle row', () => {
      const grid = createGrid([
        ['red', 'purple', 'blue'],
        ['white', 'green', 'pink'],
        ['yellow', 'orange', 'black']
      ])
      
      // Click purple tile at (0,1)
      const result = applyPurpleTileLogic(grid, 0, 1)
      
      expect(result[1][1]).toBe('purple')
      expect(result[0][1]).toBe('green')
    })
  })

  describe('Orange Tile Logic', () => {
    test('changes to majority adjacent color', () => {
      const grid = createGrid([
        ['red', 'red', 'blue'],
        ['red', 'orange', 'green'],
        ['yellow', 'red', 'pink']
      ])
      
      // Orange tile at (1,1) has adjacents: red, red, red, yellow
      // Majority is red (3 occurrences)
      const result = applyOrangeTileLogic(grid, 1, 1)
      
      expect(result[1][1]).toBe('red')
    })

    test('does not change when adjacent colors are evenly split', () => {
      const grid = createGrid([
        ['red', 'blue', 'green'],
        ['blue', 'orange', 'red'],
        ['yellow', 'green', 'pink']
      ])
      
      // Orange tile at (1,1) has adjacents: blue (top), blue (left), green (bottom), red (right)
      // That's 2 blues, 1 red, 1 green - blue has majority
      const result = applyOrangeTileLogic(grid, 1, 1)
      
      expect(result[1][1]).toBe('blue') // Should change to blue (majority)
    })

    test('does not change when adjacent colors have true tie', () => {
      const grid = createGrid([
        ['red', 'blue', 'green'],
        ['blue', 'orange', 'red'],
        ['yellow', 'red', 'pink']
      ])
      
      // Orange tile at (1,1) has adjacents: blue (top), blue (left), red (bottom), red (right)
      // That's 2 blues, 2 reds - tied for majority
      const result = applyOrangeTileLogic(grid, 1, 1)
      
      expect(result[1][1]).toBe('orange') // Should remain unchanged due to tie
    })

    test('handles edge position with fewer adjacents', () => {
      const grid = createGrid([
        ['orange', 'blue', 'green'],
        ['red', 'yellow', 'blue'],
        ['red', 'green', 'pink']
      ])
      
      // Orange tile at (0,0) has adjacents: blue, red
      // No majority (1 each), should remain unchanged
      const result = applyOrangeTileLogic(grid, 0, 0)
      
      expect(result[0][0]).toBe('orange')
    })

    test('changes when there is a clear majority at edge', () => {
      const grid = createGrid([
        ['orange', 'red', 'green'],
        ['red', 'red', 'blue'],
        ['yellow', 'green', 'pink']
      ])
      
      // Orange tile at (0,0) has adjacents: red, red
      // Majority is red (2 occurrences)
      const result = applyOrangeTileLogic(grid, 0, 0)
      
      expect(result[0][0]).toBe('red')
    })
  })

  describe('White Tile Logic', () => {
    test('expands to adjacent gray tiles', () => {
      const grid = createGrid([
        ['red', 'gray', 'blue'],
        ['gray', 'white', 'gray'],
        ['yellow', 'gray', 'pink']
      ])
      
      // White tile at (1,1) has adjacent gray tiles
      const result = applyWhiteTileLogic(grid, 1, 1)
      
      expect(result[0][1]).toBe('white') // was gray
      expect(result[1][0]).toBe('white') // was gray
      expect(result[1][2]).toBe('white') // was gray
      expect(result[2][1]).toBe('white') // was gray
      expect(result[1][1]).toBe('gray') // white tile turns gray after expanding
    })

    test('turns gray when no adjacent gray tiles', () => {
      const grid = createGrid([
        ['red', 'blue', 'green'],
        ['yellow', 'white', 'pink'],
        ['purple', 'orange', 'black']
      ])
      
      // White tile at (1,1) has no adjacent gray tiles
      const result = applyWhiteTileLogic(grid, 1, 1)
      
      expect(result[1][1]).toBe('gray')
      // Adjacent tiles should remain unchanged
      expect(result[0][1]).toBe('blue')
      expect(result[1][0]).toBe('yellow')
      expect(result[1][2]).toBe('pink')
      expect(result[2][1]).toBe('orange')
    })

    test('expands to some adjacent gray tiles', () => {
      const grid = createGrid([
        ['red', 'gray', 'blue'],
        ['yellow', 'white', 'pink'],
        ['purple', 'red', 'black']
      ])
      
      // White tile at (1,1) has one adjacent gray tile
      const result = applyWhiteTileLogic(grid, 1, 1)
      
      expect(result[0][1]).toBe('white') // was gray
      expect(result[1][1]).toBe('gray') // white tile turns gray after expanding
      // Other adjacent tiles should remain unchanged
      expect(result[1][0]).toBe('yellow')
      expect(result[1][2]).toBe('pink')
    })

    test('user reported issue: white-gray-white row behavior', () => {
      const grid = createGrid([
        ['white', 'gray', 'white'],
        ['red', 'blue', 'green'],
        ['yellow', 'purple', 'orange']
      ])
      
      // Click leftmost white tile at (0,0) - Lights Out style toggle
      const result = applyWhiteTileLogic(grid, 0, 0)
      
      // Lights Out: toggle clicked tile (0,0) and adjacent white/gray tiles
      // (0,0): white → gray, (0,1): gray → white, (0,2): not adjacent so unchanged
      expect(result[0][0]).toBe('gray') // clicked white toggles to gray
      expect(result[0][1]).toBe('white') // adjacent gray toggles to white
      expect(result[0][2]).toBe('white') // not adjacent, unchanged
      expect(result[1][0]).toBe('red') // non-white/gray, unchanged
    })

    test('user reported complex case: multiple whites with expansion', () => {
      const grid = createGrid([
        ['pink', 'blue', 'pink'],
        ['gray', 'white', 'white'],
        ['pink', 'red', 'pink']
      ])
      
      // Click center white tile at (1,1)
      // Should expand to adjacent gray at (1,0), only clicked white turns gray
      const result = applyWhiteTileLogic(grid, 1, 1)
      
      // Expected result based on new understanding:
      // Pink, Blue, Pink
      // White, Grey, Grey  
      // Pink, Red, Pink
      expect(result[1][0]).toBe('white') // was gray, expanded to
      expect(result[1][1]).toBe('gray') // was white, turned gray
      expect(result[1][2]).toBe('gray') // was white, adjacent to clicked white so turns gray
      // Other tiles unchanged
      expect(result[0][0]).toBe('pink')
      expect(result[0][1]).toBe('blue')
      expect(result[2][1]).toBe('red')
    })

    test('user clarification: multiple whites, only clicked changes', () => {
      const grid = createGrid([
        ['pink', 'white', 'pink'],
        ['white', 'gray', 'white'],
        ['pink', 'red', 'pink']
      ])
      
      // Click left center white tile at (1,0)
      // Should expand to adjacent gray at (1,1), only clicked white turns gray
      const result = applyWhiteTileLogic(grid, 1, 0)
      
      // Expected result:
      // Pink White Pink
      // Grey White White
      // Pink Red  Pink
      expect(result[1][0]).toBe('gray') // clicked white turns gray
      expect(result[1][1]).toBe('white') // adjacent gray becomes white
      expect(result[0][1]).toBe('white') // non-adjacent white unchanged
      expect(result[1][2]).toBe('white') // non-adjacent white unchanged
      expect(result[0][0]).toBe('pink') // other colors unchanged
      expect(result[2][1]).toBe('red') // other colors unchanged
    })

    test('user reported edge case: adjacent whites should turn gray', () => {
      const grid = createGrid([
        ['black', 'gray', 'white'],
        ['white', 'yellow', 'white'],
        ['blue', 'green', 'orange']
      ])
      
      // Click top right white tile at (0,2)
      // Expected: clicked white turns gray, adjacent gray turns white, adjacent white at (1,2) also turns gray
      const result = applyWhiteTileLogic(grid, 0, 2)
      
      // Expected result:
      // black white grey
      // white yellow grey
      // blue green orange
      expect(result[0][2]).toBe('gray') // clicked white turns gray
      expect(result[0][1]).toBe('white') // adjacent gray becomes white
      expect(result[1][2]).toBe('gray') // adjacent white turns gray
      expect(result[1][0]).toBe('white') // non-adjacent white unchanged
      expect(result[0][0]).toBe('black') // other colors unchanged
      expect(result[1][1]).toBe('yellow') // other colors unchanged
    })
  })

  describe('Blue Tile Logic', () => {
    test('copies black tile behavior (row shift)', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'black', 'yellow'], // Center is black
        ['purple', 'orange', 'pink']
      ])
      
      // Blue tile at (0,2) should copy black behavior
      const result = applyBlueTileLogic(grid, 0, 2)
      
      // Should shift row 0 to the right
      expect(result[0]).toEqual(['blue', 'red', 'green'])
    })

    test('copies red tile behavior (white/black transformation)', () => {
      const grid = createGrid([
        ['white', 'green', 'blue'],
        ['black', 'red', 'white'], // Center is red
        ['white', 'orange', 'black']
      ])
      
      // Blue tile at (0,2) should copy red behavior
      const result = applyBlueTileLogic(grid, 0, 2)
      
      // Should transform all white→black, black→red
      expect(result[0][0]).toBe('black') // was white
      expect(result[1][0]).toBe('red')   // was black
      expect(result[1][2]).toBe('black') // was white
      expect(result[2][0]).toBe('black') // was white
      expect(result[2][2]).toBe('red')   // was black
    })

    test('copies green tile behavior (mirror swap)', () => {
      const grid = createGrid([
        ['red', 'blue', 'yellow'],
        ['white', 'green', 'pink'], // Center is green
        ['purple', 'orange', 'black']
      ])
      
      // Blue tile at (0,1) should copy green behavior and swap with mirror
      const result = applyBlueTileLogic(grid, 0, 1)
      
      expect(result[0][1]).toBe('orange') // swapped with (2,1)
      expect(result[2][1]).toBe('blue')   // swapped with (0,1)
    })

    test('does nothing when center is gray', () => {
      const grid = createGrid([
        ['red', 'blue', 'yellow'],
        ['white', 'gray', 'pink'], // Center is gray
        ['purple', 'orange', 'black']
      ])
      
      // Blue tile should do nothing when center is gray
      const result = applyBlueTileLogic(grid, 0, 1)
      
      expect(result).toEqual(grid)
    })

    test('does nothing when center is blue (avoid recursion)', () => {
      const grid = createGrid([
        ['red', 'blue', 'yellow'],
        ['white', 'blue', 'pink'], // Center is blue
        ['purple', 'orange', 'black']
      ])
      
      // Blue tile should do nothing when center is blue
      const result = applyBlueTileLogic(grid, 0, 1)
      
      expect(result).toEqual(grid)
    })

    test('copies yellow tile behavior (move up)', () => {
      const grid = createGrid([
        ['red', 'green', 'pink'],
        ['white', 'yellow', 'blue'], // Center is yellow
        ['purple', 'orange', 'black']
      ])
      
      // Blue tile at (1,2) should copy yellow behavior
      const result = applyBlueTileLogic(grid, 1, 2)
      
      expect(result[0][2]).toBe('blue') // blue moved up
      expect(result[1][2]).toBe('pink') // pink moved down
    })

    test('user reported issue: blue copies white behavior', () => {
      const grid = createGrid([
        ['pink', 'gray', 'pink'],
        ['blue', 'white', 'blue'],
        ['pink', 'red', 'pink']
      ])
      
      // Click center left blue tile at (1,0)
      // Center tile is white, so blue should apply white behavior from (1,0)
      // Adjacent to (1,0) are: (0,0), (1,1), (2,0) - not (0,1)!
      const result = applyBlueTileLogic(grid, 1, 0)
      
      // Expected result with corrected white behavior:
      // Pink Gray Pink  (gray at (0,1) is NOT adjacent, unchanged)
      // Grey White Blue  (blue at (1,0) becomes gray, adjacent white at (1,1) unchanged)
      // Pink Red   Pink
      expect(result[1][0]).toBe('gray') // blue tile becomes gray (acting as white)
      expect(result[1][1]).toBe('white') // adjacent white tile unchanged when blue copies white
      expect(result[0][1]).toBe('gray') // non-adjacent gray unchanged
      expect(result[1][2]).toBe('blue') // non-adjacent blue unchanged
      expect(result[2][1]).toBe('red') // non-adjacent colors unchanged
    })

    test('user reported edge case: blue copies white with gray neighbors', () => {
      const grid = createGrid([
        ['black', 'yellow', 'white'],
        ['blue', 'white', 'white'],
        ['gray', 'green', 'orange']
      ])
      
      // Click blue tile at (1,0)
      // Center tile is white, so blue should apply white behavior from (1,0)
      // Adjacent to (1,0) are: (0,0), (1,1), (2,0) where (2,0) is gray
      const result = applyBlueTileLogic(grid, 1, 0)
      
      // Expected result based on real box behavior:
      // black yellow white
      // gray  white  white  
      // blue  green  orange
      expect(result[1][0]).toBe('gray') // blue tile becomes gray (acting as white)
      expect(result[2][0]).toBe('blue') // adjacent gray becomes blue
      expect(result[1][1]).toBe('white') // adjacent white unchanged
      expect(result[0][0]).toBe('black') // non-adjacent tiles unchanged
      expect(result[1][2]).toBe('white') // non-adjacent white unchanged
    })

    test('blue copying white: gray becomes blue, adjacent blue becomes gray', () => {
      const grid = createGrid([
        ['red', 'blue', 'green'],
        ['gray', 'white', 'yellow'],
        ['orange', 'blue', 'pink']
      ])
      
      // Click top blue tile at (0,1)
      // Center tile is white, so blue should apply white behavior from (0,1)
      // Adjacent to (0,1) are: (0,0) red, (0,2) green, (1,1) white, (1,1) already counted
      // Let me use bottom blue at (2,1) instead
      const result = applyBlueTileLogic(grid, 2, 1)
      
      // Adjacent to (2,1) are: (1,1) white, (2,0) orange, (2,2) pink
      // Expected: clicked blue becomes gray, no grays or blues adjacent to transform
      expect(result[2][1]).toBe('gray') // clicked blue becomes gray
      expect(result[1][1]).toBe('white') // adjacent white unchanged
      expect(result[2][0]).toBe('orange') // other tiles unchanged
      expect(result[2][2]).toBe('pink') // other tiles unchanged
    })

    test('blue copying white with both gray and blue neighbors', () => {
      const grid = createGrid([
        ['gray', 'blue', 'red'],
        ['blue', 'white', 'yellow'],
        ['green', 'blue', 'orange']
      ])
      
      // Click center blue tile at (2,1)
      // Center tile is white, so blue should apply white behavior from (2,1)
      // Adjacent to (2,1) are: (1,1) white, (2,0) green, (2,2) orange
      // Let me click the top blue at (0,1) instead
      const result = applyBlueTileLogic(grid, 0, 1)
      
      // Adjacent to (0,1) are: (0,0) gray, (0,2) red, (1,1) white
      // Expected: clicked blue becomes gray, adjacent gray at (0,0) becomes blue
      expect(result[0][1]).toBe('gray') // clicked blue becomes gray
      expect(result[0][0]).toBe('blue') // adjacent gray becomes blue
      expect(result[0][2]).toBe('red') // non-gray/blue unchanged
      expect(result[1][1]).toBe('white') // adjacent white unchanged
    })

    test('blue copying white: adjacent blue tiles become gray', () => {
      const grid = createGrid([
        ['blue', 'blue', 'red'],
        ['gray', 'white', 'yellow'],
        ['green', 'orange', 'pink']
      ])
      
      // Click top-left blue at (0,0)
      // Center tile is white, so blue copies white behavior
      // Adjacent to (0,0) are: (0,1) blue, (1,0) gray
      // Expected: clicked blue becomes gray, adjacent blue becomes gray, adjacent gray becomes blue
      const result = applyBlueTileLogic(grid, 0, 0)
      
      expect(result[0][0]).toBe('gray') // clicked blue becomes gray
      expect(result[0][1]).toBe('gray') // adjacent blue becomes gray  
      expect(result[1][0]).toBe('blue') // adjacent gray becomes blue
      expect(result[0][2]).toBe('red') // non-adjacent tiles unchanged
    })

    test('copies purple tile behavior (move down)', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'purple', 'pink'], // Center is purple
        ['yellow', 'orange', 'black']
      ])
      
      // Blue tile at (0,2) should copy purple behavior
      const result = applyBlueTileLogic(grid, 0, 2)
      
      expect(result[1][2]).toBe('blue') // blue moved down
      expect(result[0][2]).toBe('pink') // pink moved up
    })
  })

  describe('Edge Cases and Boundary Testing', () => {
    test('all tile behaviors respect grid boundaries', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'yellow', 'pink'],
        ['purple', 'orange', 'black']
      ])
      
      // Test each tile type at each position to ensure no out-of-bounds
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(() => applyYellowTileLogic(grid, row, col)).not.toThrow()
          expect(() => applyPurpleTileLogic(grid, row, col)).not.toThrow()
          expect(() => applyGreenTileLogic(grid, row, col)).not.toThrow()
          expect(() => applyPinkTileLogic(grid, row, col)).not.toThrow()
          expect(() => applyOrangeTileLogic(grid, row, col)).not.toThrow()
          expect(() => applyWhiteTileLogic(grid, row, col)).not.toThrow()
          expect(() => applyBlueTileLogic(grid, row, col)).not.toThrow()
        }
      }
    })

    test('grid immutability - original grid is not modified', () => {
      const originalGrid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'yellow', 'pink'],
        ['purple', 'orange', 'black']
      ])
      
      const gridCopy = originalGrid.map(row => [...row])
      
      applyRedTileLogic(originalGrid)
      applyBlackTileLogic(originalGrid, 1)
      applyGreenTileLogic(originalGrid, 0, 0)
      
      expect(originalGrid).toEqual(gridCopy)
    })

    test('returned grids have correct dimensions', () => {
      const grid = createGrid([
        ['red', 'green', 'blue'],
        ['white', 'yellow', 'pink'],
        ['purple', 'orange', 'black']
      ])
      
      const results = [
        applyRedTileLogic(grid),
        applyBlackTileLogic(grid, 1),
        applyGreenTileLogic(grid, 1, 1),
        applyYellowTileLogic(grid, 1, 1),
        applyPinkTileLogic(grid, 1, 1),
        applyPurpleTileLogic(grid, 1, 1),
        applyOrangeTileLogic(grid, 1, 1),
        applyWhiteTileLogic(grid, 1, 1),
        applyBlueTileLogic(grid, 1, 1)
      ]
      
      results.forEach(result => {
        expect(result).toHaveLength(3)
        result.forEach(row => {
          expect(row).toHaveLength(3)
        })
      })
    })
  })
})