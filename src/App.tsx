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

interface PuzzleState {
  grid: TileColorType[][]
  corners: TileColorType[]
  targetColor: TileColorType
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


  const updateCorners = (grid: TileColorType[][]): TileColorType[] => {
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

          <div className="corner bottom-left"
               onClick={() => handleCornerClick()}>
            <div className={`corner-tile ${puzzleState.corners[2]}`}></div>
          </div>
          <div className="corner bottom-right"
               onClick={() => handleCornerClick()}>
            <div className={`corner-tile ${puzzleState.corners[3]}`}></div>
          </div>
        </div>

        <div className="info">
          <p>Target: Get all corners to be <span
              className={puzzleState.targetColor}>{puzzleState.targetColor}</span>
          </p>
          <p>Click corners to reset puzzle</p>

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
  )
}

export default App
