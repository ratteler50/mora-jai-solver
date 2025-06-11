interface PremadeBox {
  location: string;
  pattern: string;
  corners: string;
}

declare module '*.json' {
  const value: PremadeBox[];
  export default value;
}

