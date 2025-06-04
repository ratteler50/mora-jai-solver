// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import PuzzleGrid from './PuzzleGrid';
import { TileColor } from '../tileLogic';

describe('PuzzleGrid', () => {
  const mockGridData = [
    [TileColor.Red, TileColor.Green, TileColor.Blue],
    [TileColor.Yellow, TileColor.Black, TileColor.Pink],
    [TileColor.Orange, TileColor.Purple, TileColor.White],
  ];
  const mockTargetCorners = [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red];
  const mockCurrentCorners = [TileColor.Red, TileColor.Green, TileColor.Blue, TileColor.Yellow];
  const mockHandleTileClick = vi.fn();
  const mockHandleCornerClick = vi.fn();
  const mockShouldHighlightTile = vi.fn(() => false);

  const defaultProps = {
    grid: mockGridData,
    targetCorners: mockTargetCorners,
    currentCorners: mockCurrentCorners,
    mode: 'play' as 'play' | 'setup',
    handleTileClick: mockHandleTileClick,
    handleCornerClick: mockHandleCornerClick,
    shouldHighlightTile: mockShouldHighlightTile,
  };

  it('renders the grid with 9 tiles', () => {
    render(<PuzzleGrid {...defaultProps} />);
    const gridContainer = screen.getByTestId('puzzle-grid-internal');
    const tiles = within(gridContainer).getAllByTestId(/^tile-\d-\d$/);
    expect(tiles.length).toBe(9);
  });

  it('renders all four corner elements', () => {
    render(<PuzzleGrid {...defaultProps} />);
    expect(screen.getByTestId('corner-top-left').querySelector('.corner-tile')).toBeInTheDocument();
    expect(screen.getByTestId('corner-top-right').querySelector('.corner-tile')).toBeInTheDocument();
    expect(screen.getByTestId('corner-bottom-left').querySelector('.corner-tile')).toBeInTheDocument();
    expect(screen.getByTestId('corner-bottom-right').querySelector('.corner-tile')).toBeInTheDocument();
  });

  it('applies "setup-mode" class to tiles in setup mode', () => {
    render(<PuzzleGrid {...defaultProps} mode="setup" />);
    const gridContainer = screen.getByTestId('puzzle-grid-internal');
    const firstTile = within(gridContainer).getAllByTestId(/^tile-\d-\d$/)[0];
    expect(firstTile).toHaveClass('setup-mode');
  });

  it('applies winning class to matching corners', () => {
    render(<PuzzleGrid {...defaultProps} currentCorners={[TileColor.Red, TileColor.Green, TileColor.Red, TileColor.Blue]} />);
    const topLeftCornerTile = screen.getByTestId('corner-top-left').querySelector('.corner-tile');
    const bottomLeftCornerTile = screen.getByTestId('corner-bottom-left').querySelector('.corner-tile');
    expect(topLeftCornerTile).toHaveClass('winning');
    expect(bottomLeftCornerTile).toHaveClass('winning');

    const topRightCornerTile = screen.getByTestId('corner-top-right').querySelector('.corner-tile');
    expect(topRightCornerTile).not.toHaveClass('winning');
  });
});
