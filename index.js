import { generateCSSVariables } from './color-variables.js';
import { generatorColors } from './colors.js';

function main() {
  generatorColors();
  generateCSSVariables();
}

main();
