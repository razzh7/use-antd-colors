import path from 'node:path';
import {
  blue,
  geekblue,
  green,
  orange,
  presetDarkPalettes,
  presetPalettes,
  red,
} from '@ant-design/colors';
import fs from 'fs-extra';
import { line } from './util.js';

const cssVarsImport = `@import './colors.less';\n\n`;
let cssVarsLightTemplate = 'body { \n';
let cssVarsDarkTemplate = `body[twist-theme='dark'] { \n`;
const colorVarsMap = {
  primary: blue,
  success: green,
  danger: red,
  warning: orange,
  link: geekblue,
};

export function generateCSSVariables() {
  // rgb variables
  Object.keys(presetPalettes).forEach((key) => {
    const colors = presetPalettes[key];

    colors.forEach((color, idx) => {
      const ci = idx + 1;
      cssVarsLightTemplate += `  --${key}-${ci}: get-rgb-str(@${key}-${ci});\n`;
    });
  });

  Object.keys(presetDarkPalettes).forEach((key) => {
    const colors = presetDarkPalettes[key];

    colors.forEach((color, idx) => {
      const ci = idx + 1;
      cssVarsDarkTemplate += `  --${key}-${ci}: get-rgb-str(@dark-${key}-${ci});\n`;
    });
  });

  // css status variables
  const colorsVarsArr = Object.keys(colorVarsMap);
  colorsVarsArr.forEach((key, vi) => {
    const colors = colorVarsMap[key];

    colors.forEach((color, ci) => {
      const cidx = ci + 1;
      if (key === 'primary') {
        cssVarsLightTemplate += `  --primary-${cidx}: get-var-str(~'@{primary-${cidx}}');\n`;
        cssVarsDarkTemplate += `  --primary-${cidx}: get-var-str(~'@{dark-primary-${cidx}}');\n`;
        return;
      }

      const canLine = line(vi, colorsVarsArr.length, ci, colors.length);
      cssVarsLightTemplate += `  --${key}-${cidx}: get-var-str(~'@{${key}-${cidx}}');${canLine}`;
      cssVarsDarkTemplate += `  --${key}-${cidx}: get-var-str(~'@{dark-${key}-${cidx}}');${canLine}`;
    });
  });

  cssVarsLightTemplate += '\n}';
  cssVarsDarkTemplate += '\n}';
  fs.outputFileSync(path.resolve('./css-variables.less'), `${cssVarsImport}${cssVarsLightTemplate}\n\n${cssVarsDarkTemplate}`);
}
