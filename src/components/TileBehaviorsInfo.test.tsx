// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TileBehaviorsInfo from './TileBehaviorsInfo';

describe('TileBehaviorsInfo', () => {
  it('renders the "Tile Behaviors" spoiler section', () => {
    render(<TileBehaviorsInfo />);
    expect(screen.getByText('Tile Behaviors')).toBeInTheDocument(); // Checks for the summary
    expect(screen.getByText('How Each Tile Works:')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('Expands to adjacent gray or turns gray')).toBeInTheDocument();
    expect(screen.getByText('Gray')).toBeInTheDocument();
    expect(screen.getByText('No function (empty space)')).toBeInTheDocument();
  });

  it('renders all 10 behavior items', () => {
    render(<TileBehaviorsInfo />);
    const behaviorItems = screen.getAllByTestId('behavior-item');
    expect(behaviorItems.length).toBe(10);
  });
});
