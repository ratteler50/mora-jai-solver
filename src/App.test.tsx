import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { TileColor } from './tileLogic';
import premadeBoxesData from './premade_boxes.json'; // Fixed filename and import

describe('App Component', () => {
  test('renders premade box selector in setup mode', () => {
    render(<App />);
    const switchToPlayButton = screen.getByRole('button', { name: /🎮 Switch to Play Mode/i });
    expect(switchToPlayButton).toBeInTheDocument();
    const premadeBoxLabel = screen.getByText(/Load Premade Box:/i);
    expect(premadeBoxLabel).toBeInTheDocument();
    const premadeBoxSelect = screen.getByRole('combobox');
    expect(premadeBoxSelect).toBeInTheDocument();
    const defaultOption = screen.getByRole('option', { name: /Select a premade box.../i }) as HTMLOptionElement;
    expect(defaultOption).toBeInTheDocument();
    expect(defaultOption.selected).toBe(true);
  });

  test('loads "Trading Post" premade box pattern correctly', () => {
    const { container } = render(<App />); // Get container for querySelector

    const premadeBoxSelect = screen.getByRole('combobox');

    // Find the "Trading Post" box data from the imported JSON
    const tradingPostBox = premadeBoxesData.find(box => box.location === "Trading Post");
    expect(tradingPostBox).toBeDefined();
    // The tradingPostBox object will now have:
    // tradingPostBox.pattern = "pink grey grey grey yellow yellow grey yellow yellow"
    // tradingPostBox.corners = "yellow yellow yellow yellow" (representing TL, TR, BR, BL in the string)

    fireEvent.change(premadeBoxSelect, { target: { value: "Trading Post" } });

    // Verify grid colors based on tradingPostBox.pattern
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeInTheDocument();
    if (!gridElement) throw new Error('Grid element not found');
    const renderedTiles = gridElement.querySelectorAll('.tile');
    expect(renderedTiles.length).toBe(9);

    const expectedGridColors = [
      TileColor.Pink, TileColor.Gray, TileColor.Gray,
      TileColor.Gray, TileColor.Yellow, TileColor.Yellow,
      TileColor.Gray, TileColor.Yellow, TileColor.Yellow
    ];
    expectedGridColors.forEach((expectedColor, index) => {
      expect(renderedTiles[index]).toHaveClass(expectedColor);
    });

    // Verify target corner colors based on tradingPostBox.corners
    // The `corners` string in JSON is "yellow yellow yellow yellow" (TL, TR, BR, BL).
    // The `handlePremadeBoxSelect` function maps this to the `targetCorners` state array (TL, TR, BL, BR)
    // state[0] (TL) = jsonCorners[0] (Yellow)
    // state[1] (TR) = jsonCorners[1] (Yellow)
    // state[2] (BL) = jsonCorners[3] (Yellow)
    // state[3] (BR) = jsonCorners[2] (Yellow)
    const expectedTargetColors = [
      TileColor.Yellow, // TL
      TileColor.Yellow, // TR
      TileColor.Yellow, // BL
      TileColor.Yellow  // BR
    ];

    const topLeftCorner = container.querySelector('.corner.top-left .corner-tile');
    expect(topLeftCorner).toHaveClass(expectedTargetColors[0]); // Should be Yellow

    const topRightCorner = container.querySelector('.corner.top-right .corner-tile');
    expect(topRightCorner).toHaveClass(expectedTargetColors[1]); // Should be Yellow

    const bottomLeftCorner = container.querySelector('.corner.bottom-left .corner-tile');
    expect(bottomLeftCorner).toHaveClass(expectedTargetColors[2]); // Should be Yellow

    const bottomRightCorner = container.querySelector('.corner.bottom-right .corner-tile');
    expect(bottomRightCorner).toHaveClass(expectedTargetColors[3]); // Should be Yellow

    // Check if dropdown is reset
    const defaultOption = screen.getByRole('option', { name: /Select a premade box.../i }) as HTMLOptionElement;
    expect(defaultOption.selected).toBe(true);
  });
});
