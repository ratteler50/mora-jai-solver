# Mora Jai Box Solver

A React TypeScript application that simulates the puzzle mechanics from the Blue Prince game. The app features dual-mode functionality with setup and play modes, an intelligent automatic solver, and an optimized three-column layout for efficient puzzle solving.

## 🎮 Live Demo

**[Play the game here!](https://ratteler50.github.io/mora-jai-solver/)**

## ✨ Features

### 🎨 **Setup Mode**
- Paint tiles with a brush tool using any of the 10 tile colors
- Select target corner color from authentic Blue Prince country symbols
- Visual country symbol selector with real game images
- Configure custom puzzle scenarios

### 🎯 **Play Mode**  
- Interactive 3x3 puzzle grid with tile click mechanics
- Real-time corner tracking and win condition detection
- Reset functionality to return to initial puzzle state
- Celebration animations when puzzle is solved

### 🧠 **Automatic Solver**
- Advanced BFS (Breadth-First Search) algorithm finds optimal solutions
- Performance optimized with state exploration limits
- User-friendly move descriptions ("Click red tile at Top Left")
- Solution statistics (moves, time, states explored)
- Solvability analysis for impossible puzzles

### 📱 **Optimized Layout**
- **Three-column responsive design** for efficient space utilization
- **Left Panel**: Interactive puzzle and controls
- **Center Panel**: Solution display and tile behavior reference  
- **Right Panel**: Country symbols reference
- **Mobile-friendly**: Automatically adapts to single-column on smaller screens

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
- **White tiles** — "Lights Out" style: toggle clicked tile and adjacent white/gray tiles (white ↔ gray)
- **Blue tiles** — Copy the behavior of the center tile (position 1,1)

**Objective**: Get all four corner tiles to match the target color. Each country symbol from Blue Prince corresponds to a specific target color.

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

### **Dual-Mode System**
- **Setup Mode**: Tile painting and puzzle configuration
- **Play Mode**: Interactive puzzle solving with solver integration
- Mode-specific UI controls and behaviors

### **Automatic Solver**
- **BFS Algorithm**: Guarantees optimal (shortest) solutions
- **State Management**: Efficient state tracking and duplicate detection
- **Performance Limits**: 50,000 state exploration cap prevents infinite loops
- **User-Friendly Output**: Human-readable move descriptions with position names

### **Responsive Layout**
- **Three-Column Grid**: Optimized for laptop/desktop screens
- **Mobile Adaptation**: Single-column layout for smaller screens
- **Component Organization**: Logical grouping of related UI elements

### **State Management**
- **PuzzleState Interface**: Grid, corners, and target color tracking
- **SetupState Interface**: Brush color selection for painting mode
- **SolverState Interface**: Solution results and display control

### **Testing**
- **Comprehensive Test Suite**: 44 unit tests covering all tile behaviors
- **Solver Testing**: Edge cases, performance limits, and bug regression tests
- **Vitest Framework**: Fast and reliable test execution

## 📁 Project Structure

```
src/
├── App.tsx              # Main component with dual-mode logic and UI
├── App.css              # Three-column layout and responsive styling
├── tileLogic.ts         # Individual tile behavior implementations
├── tileLogic.test.ts    # Unit tests for all tile behaviors
├── solver.ts            # BFS algorithm and solution formatting
├── solver.test.ts       # Solver tests including edge cases
├── main.tsx             # React entry point
└── index.css            # Global styles
```