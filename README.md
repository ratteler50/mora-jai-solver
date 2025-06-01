# Mora Jai Box Solver

A React TypeScript application that simulates the puzzle mechanics from the Blue Prince game. The app allows users to interact with a 3x3 grid of colored tiles, each with different behaviors when clicked, with the goal of getting all four corners to be the same target color.

## 🎮 Live Demo

**[Play the game here!](https://ratteler50.github.io/mora-jai-solver/)**

## 🧩 Game Mechanics

The puzzle features a 3x3 grid where each tile has different behaviors when clicked:

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

**Objective**: Get all four corner tiles to match the target color shown at the top.

## 🚀 Development

### Prerequisites
- Node.js (v18 or later)
- npm

### Setup
```bash
git clone https://github.com/ratteler50/mora-jai-solver.git
cd mora-jai-solver
npm install
```

### Available Scripts
- `npm run dev` - Start development server (http://localhost:5173/)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## 🔧 Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **CSS** for styling (no external UI libraries)
- **GitHub Pages** for deployment
- **GitHub Actions** for CI/CD

## 📦 Deployment

The app automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The deployment uses GitHub's official Pages action for reliable builds and proper MIME type handling.

## 🏗️ Architecture

- **Single Component Design**: Main logic in `src/App.tsx`
- **State Management**: Simple React state with `PuzzleState` interface
- **Responsive Design**: CSS Grid layout that works on mobile and desktop
- **No External Dependencies**: Pure React/TypeScript implementation

## 📁 Project Structure

```
src/
├── App.tsx          # Main component with puzzle logic
├── App.css          # Styling for grid, tiles, and UI
├── main.tsx         # React entry point
└── index.css        # Global styles
```