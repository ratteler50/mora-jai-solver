// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import SolutionDisplay from './SolutionDisplay';
import { TileColor } from '../tileLogic';
import type { SolverResult, PuzzleState, Move } from '../solver';
import { estimateSolvability as mockedEstimateSolvability } from '../solver'; // Import for specific mock override

// Mock functions from solver that are used internally by SolutionDisplay
vi.mock('../solver', async (importOriginal) => {
  const actual = await importOriginal() as typeof import('../solver');
  return {
    ...actual,
    formatMoves: vi.fn((moves: Move[], states: PuzzleState[]) => moves.map((m, i) => `Formatted Move ${i + 1} (${m.row},${m.col}) for state ${states[i].grid[0][0]}`)),
    estimateSolvability: vi.fn(() => ({ likely: true, reason: "Mocked: Appears solvable" })),
  };
});

describe('SolutionDisplay', () => {
  const mockPuzzleState: PuzzleState = {
    grid: [
      [TileColor.Red, TileColor.Green, TileColor.Blue],
      [TileColor.Yellow, TileColor.Black, TileColor.Pink],
      [TileColor.Orange, TileColor.Purple, TileColor.White],
    ],
    corners: [TileColor.Red, TileColor.Green, TileColor.Blue, TileColor.Yellow],
    targetCorners: [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red],
  };

  const mockBaseSolverState = {
    isRunning: false,
    result: null,
    showSolution: false,
    currentStep: -1,
  };

  const mockSolvedResult: SolverResult = {
    solved: true,
    moves: [{ row: 0, col: 0 }, { row: 1, col: 1 }],
    states: [mockPuzzleState, mockPuzzleState, mockPuzzleState], // 2 moves -> 3 states (initial + state after each move)
    totalStatesExplored: 100,
    timeMs: 50,
  };

  const mockUnsolvedResult: SolverResult = {
    solved: false,
    moves: [],
    states: [mockPuzzleState],
    totalStatesExplored: 500,
    timeMs: 20,
  };

  const defaultProps = {
    mode: 'play' as 'play' | 'setup',
    solverState: mockBaseSolverState,
    puzzleStateForEstimator: mockPuzzleState,
    handleSolvePuzzle: vi.fn(),
    handleToggleSolution: vi.fn(),
    handleStepNext: vi.fn(),
    handleStepPrev: vi.fn(),
    handleStepReset: vi.fn(),
    getCurrentStepState: vi.fn(() => mockPuzzleState),
    isWinning: false,
  };

  it('does not render in setup mode', () => {
    const { container } = render(<SolutionDisplay {...defaultProps} mode="setup" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders solver buttons in play mode even when no solution is shown', () => {
    render(<SolutionDisplay {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Auto-Solve/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Show Solution/i })).not.toBeInTheDocument();
  });

  it('renders "Show Solution" button when there is a result', () => {
    render(<SolutionDisplay {...defaultProps} solverState={{ ...mockBaseSolverState, result: mockSolvedResult }} />);
    expect(screen.getByRole('button', { name: /Show Solution/i })).toBeInTheDocument();
  });

  it('renders solved state correctly when showSolution is true', () => {
    render(
      <SolutionDisplay
        {...defaultProps}
        solverState={{ ...mockBaseSolverState, result: mockSolvedResult, showSolution: true }}
      />
    );
    expect(screen.getByText('✅ Solution Found!')).toBeInTheDocument();
    expect(screen.getByText(`Moves:`)).toHaveTextContent('Moves: 2');
    expect(screen.getByText(/Move Sequence:/i)).toBeInTheDocument();
    expect(screen.getByText(/Formatted Move 1/)).toBeInTheDocument();
    expect(screen.getByText(/Formatted Move 2/)).toBeInTheDocument();
  });

  it('renders unsolved state correctly when showSolution is true', () => {
    vi.mocked(mockedEstimateSolvability).mockReturnValueOnce({ likely: false, reason: "Target color missing" });

    render(
      <SolutionDisplay
        {...defaultProps}
        solverState={{ ...mockBaseSolverState, result: mockUnsolvedResult, showSolution: true }}
      />
    );
    expect(screen.getByText('❌ No Solution Found')).toBeInTheDocument();
    expect(screen.getByText(/Explored 500 states/)).toBeInTheDocument();
    expect(screen.getByText('Analysis:')).toHaveTextContent("Analysis: Target color missing");
  });

  it('renders step navigation and current step preview', () => {
    // Ensure getCurrentStepState returns a state that matches the grid structure for the preview
    const previewState = { ...mockPuzzleState, grid: mockPuzzleState.grid }; // Use the 3x3 grid
    defaultProps.getCurrentStepState.mockReturnValue(previewState);

    render(
      <SolutionDisplay
        {...defaultProps}
        solverState={{ ...mockBaseSolverState, result: mockSolvedResult, showSolution: true, currentStep: 0 }}
      />
    );
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prev/i })).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 2/i)).toBeInTheDocument(); // currentStep 0 is Step 1
    expect(screen.getByText('Current Move:')).toBeInTheDocument();

    const previewGrid = screen.getByTestId('solution-preview-grid');
    // Expect 3x3 = 9 tiles in the preview
    expect(within(previewGrid).getAllByTestId(/^preview-tile-\d+-\d+$/).length).toBe(9);
  });
});
