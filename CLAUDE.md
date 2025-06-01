# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Mora Jai Box solver - a React TypeScript application that simulates the puzzle mechanics from the Blue Prince game. The app allows users to interact with a 3x3 grid of colored tiles, each with different behaviors when clicked, with the goal of getting all four corners to be the same target color.

## Development Commands

- `npm run dev` - Start development server (runs on http://localhost:5173/)
- `npm run build` - Build for production (runs TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy using GitHub Actions (push to main branch)

## Architecture

### Puzzle Logic
The core puzzle mechanics are implemented in `src/App.tsx` with 10 different tile behaviors:
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

### State Management
- Single React state object (`PuzzleState`) contains:
  - `grid`: 3x3 matrix of tile colors
  - `corners`: Array of 4 corner colors (derived from grid corners)
  - `targetColor`: Goal color for all corners

### Deployment Configuration
- Configured for GitHub Pages with base path `/mora-jai-solver/`
- Uses official GitHub Actions deployment workflow (not third-party actions)
- GitHub Pages source is set to "GitHub Actions" (not "Deploy from a branch")
- Automatically deploys when pushing to `main` branch
- Live site: https://ratteler50.github.io/mora-jai-solver/
- For local development, access at root path (http://localhost:5173/)

## Key Files
- `src/App.tsx` - Main component with puzzle logic and UI
- `src/App.css` - Styling for puzzle grid, tiles, and corners
- `vite.config.ts` - Vite configuration with GitHub Pages base path
- `.github/workflows/deploy.yml` - GitHub Actions for deployment