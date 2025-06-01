# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Mora Jai Box solver - a React TypeScript application that simulates the puzzle mechanics from the Blue Prince game. The app features dual-mode functionality (setup/play), an automatic BFS solver, and an optimized three-column responsive layout. Users can configure custom puzzles and get optimal solutions automatically.

## Development Commands

- `npm run dev` - Start development server (runs on http://localhost:5173/)
- `npm run build` - Build for production (runs TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm test` - Run Vitest test suite (44 tests covering all functionality)
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy using GitHub Actions (push to main branch)

## Architecture

### Dual-Mode System
The application operates in two distinct modes:
- **Setup Mode**: Configure puzzles with brush tool and target color selection
- **Play Mode**: Interactive solving with automatic solver integration
- Mode switching preserves puzzle state and provides mode-specific UI controls

### Puzzle Logic (src/tileLogic.ts)
Individual tile behavior functions implement 10 different tile mechanics:
- **Gray tiles** — No function (empty space)
- **Black tiles** — Move all tiles in the row one position to the right  
- **Red tiles** — Turn all white tiles black and all black tiles red
- **Green tiles** — Swap positions with the mirrored tile on the opposite side
- **Yellow tiles** — Move up one position
- **Pink tiles** — Rotate all adjacent tiles clockwise
- **Purple tiles** — Move down one position  
- **Orange tiles** — Change to match the majority color of adjacent tiles
- **White tiles** — Expand to adjacent gray tiles, or turn gray if no adjacent gray tiles
- **Blue tiles** — Copy the behavior of the center tile (position 1,1)

### Automatic Solver (src/solver.ts)
- **BFS Algorithm**: Breadth-first search guarantees optimal (shortest) solutions
- **State Management**: Efficient visited state tracking with Set-based deduplication
- **Performance Limits**: 50,000 state exploration cap prevents infinite loops
- **Move Formatting**: User-friendly descriptions like "Click red tile at Top Left"
- **Solvability Analysis**: Pre-solving heuristics for impossible puzzle detection

### State Management
Multiple React state interfaces manage different aspects:
- **PuzzleState**: Current grid state, corners, and target color
- **SetupState**: Brush color selection for painting mode
- **SolverState**: Solution results, loading state, and display control

### UI Layout (src/App.css)
- **Three-Column Responsive Grid**: Optimizes space utilization on laptops
  - **Left Panel**: Interactive puzzle and game controls
  - **Center Panel**: Solution display (when active) above tile behavior reference
  - **Right Panel**: Country symbols reference
- **Mobile Adaptation**: Single-column layout for screens < 1200px
- **Component Styling**: Modular CSS classes for tiles, panels, and interactions

### Deployment Configuration
- Configured for GitHub Pages with base path `/mora-jai-solver/`
- Uses official GitHub Actions deployment workflow (not third-party actions)
- GitHub Pages source is set to "GitHub Actions" (not "Deploy from a branch")
- Automatically deploys when pushing to `main` branch
- Live site: https://ratteler50.github.io/mora-jai-solver/
- For local development, access at root path (http://localhost:5173/)

## Key Files
- `src/App.tsx` - Main component with dual-mode system and three-column layout
- `src/App.css` - Responsive styling with three-column grid and mobile adaptation
- `src/tileLogic.ts` - Individual tile behavior implementations (10 tile types)
- `src/tileLogic.test.ts` - Comprehensive unit tests for all tile behaviors  
- `src/solver.ts` - BFS algorithm implementation and move formatting
- `src/solver.test.ts` - Solver tests including edge cases and performance limits
- `vite.config.ts` - Vite configuration with GitHub Pages base path
- `.github/workflows/deploy.yml` - GitHub Actions for deployment

## Testing
- **44 total tests** covering all tile behaviors and solver functionality
- **Vitest framework** for fast test execution
- **Edge case coverage** including user-reported bugs and performance limits
- **Regression testing** ensures solver accuracy and move alignment
- Run tests with `npm test` before committing changes