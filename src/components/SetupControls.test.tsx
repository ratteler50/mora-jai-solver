// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react'; // Removed 'within' as it's not used here
import SetupControls from './SetupControls';
import { TileColor } from '../tileLogic';

describe('SetupControls', () => {
  const mockCountrySymbols = [
    { color: TileColor.Red, name: "Fenn Aries", image: "path/to/fenn.jpg", description: "Red Pentagon" },
    { color: TileColor.Blue, name: "Mt Holly", image: "path/to/holly.jpg", description: "Blue Throne" },
  ];
  const mockAllColors = [TileColor.Red, TileColor.Blue, TileColor.Green, TileColor.White, TileColor.Black];

  const defaultProps = {
    puzzleTargetCorners: [TileColor.Red, TileColor.Red, TileColor.Red, TileColor.Red],
    selectedBrushColor: TileColor.White,
    countrySymbols: mockCountrySymbols,
    allColors: mockAllColors,
    onBrushColorSelect: vi.fn(),
    onTargetColorSelect: vi.fn(),
  };

  it('renders the "Set All Corners" section with country symbols', () => {
    render(<SetupControls {...defaultProps} />);
    expect(screen.getByText('Set All Corners (Country Symbol):')).toBeInTheDocument();

    const symbolItems = screen.getAllByTestId(/^country-symbol-item-/);
    expect(symbolItems.length).toBe(mockCountrySymbols.length);
    expect(screen.getByText('Fenn Aries')).toBeInTheDocument(); // Check by text within the rendered output
    expect(screen.getByText('Mt Holly')).toBeInTheDocument();  // Check by text within the rendered output
  });

  it('renders the "Brush Color" section with color palette buttons', () => {
    render(<SetupControls {...defaultProps} />);
    expect(screen.getByText('Brush Color:')).toBeInTheDocument();

    const colorButtons = screen.getAllByTestId(/^color-btn-/);
    expect(colorButtons.length).toBe(mockAllColors.length);

    const whiteButton = screen.getByTestId(`color-btn-${TileColor.White}`);
    expect(whiteButton).toHaveClass('selected');
  });

  it('highlights the selected country symbol', () => {
    render(<SetupControls {...defaultProps} puzzleTargetCorners={[TileColor.Blue, TileColor.Blue, TileColor.Blue, TileColor.Blue]} />);
    // Assuming mockCountrySymbols[1] is Mt Holly which is Blue
    const mtHollySymbol = screen.getByTestId(`country-symbol-item-${mockCountrySymbols[1].name}`);
    expect(mtHollySymbol).toHaveClass('selected');

    const fennAriesSymbol = screen.getByTestId(`country-symbol-item-${mockCountrySymbols[0].name}`);
    expect(fennAriesSymbol).not.toHaveClass('selected');
  });
});
