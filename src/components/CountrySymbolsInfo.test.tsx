// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountrySymbolsInfo from './CountrySymbolsInfo';
import { TileColor } from '../tileLogic'; // For mock data

describe('CountrySymbolsInfo', () => {
  const mockCountrySymbols = [
    { color: TileColor.Red, name: "Fenn Aries", image: "path/to/fenn.jpg", description: "Red Pentagon" },
    { color: TileColor.Blue, name: "Mt Holly", image: "path/to/holly.jpg", description: "Blue Throne" },
  ];

  const defaultProps = {
    countrySymbols: mockCountrySymbols,
  };

  it('renders the "Country Symbols" spoiler section', () => {
    render(<CountrySymbolsInfo {...defaultProps} />);
    expect(screen.getByText('Country Symbols')).toBeInTheDocument(); // Checks for the summary
    expect(screen.getByText('Country Symbols & Target Colors:')).toBeInTheDocument();
  });

  it('renders the correct number of country symbol items', () => {
    render(<CountrySymbolsInfo {...defaultProps} />);
    const countryItems = screen.getAllByTestId(/^country-info-item-/);
    expect(countryItems.length).toBe(mockCountrySymbols.length);
  });

  it('displays names and descriptions for country symbols', () => {
    render(<CountrySymbolsInfo {...defaultProps} />);
    expect(screen.getByText('Fenn Aries')).toBeInTheDocument();
    expect(screen.getByText('Red Pentagon')).toBeInTheDocument();
    expect(screen.getByText('Mt Holly')).toBeInTheDocument();
    expect(screen.getByText('Blue Throne')).toBeInTheDocument();
  });
});
