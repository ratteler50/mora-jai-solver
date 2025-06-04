import React from 'react';
import { type TileColor as TileColorType } from '../tileLogic'; // For countrySymbols prop type if specific color type is used

interface CountrySymbolsInfoProps {
  countrySymbols: Array<{ color: TileColorType | string; name: string; image: string; description: string }>;
}

const CountrySymbolsInfo: React.FC<CountrySymbolsInfoProps> = ({ countrySymbols }) => {
  return (
    <details className="spoiler-section country-symbols-section">
      <summary className="spoiler-toggle">Country Symbols</summary>
      <div className="spoiler-content">
        <h3>Country Symbols & Target Colors:</h3>
        <div className="countries-grid">
          {countrySymbols.map(symbol => (
            <div className="country-item" key={symbol.name} data-testid={`country-info-item-${symbol.name}`}>
              <img src={symbol.image} alt={`${symbol.name} symbol`} className="country-symbol-img" />
              <div className="country-info">
                <strong>{symbol.name}</strong>
                <span className={`${symbol.color} legend-tile`}></span>
                <small>{symbol.description}</small>
              </div>
            </div>
          ))}
        </div>
        <p className="spoiler-note">
          <strong>How to solve:</strong> Look at the symbols in the corners of your puzzle box. Each symbol represents a country. Get all four corners to match that country's flag color, then click the corners to complete the puzzle.
        </p>
      </div>
    </details>
  );
};

export default CountrySymbolsInfo;
