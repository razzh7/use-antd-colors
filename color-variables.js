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
import Color from 'color';
import fs from 'fs-extra';

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

function getRgbStr(color) {
  return Color(color)
    .rgb()
    .round()
    .color
    .join(',');
}

function line(vi, vlength, ci, clength) {
  return (vi === vlength - 1 && ci === clength - 1) ? '' : '\n';
}

export function generateCSSVariables() {
  // rgb variables
  Object.keys(presetPalettes).forEach((key) => {
    const colors = presetPalettes[key];

    colors.forEach((color, idx) => {
      cssVarsLightTemplate += `  --${key}-${idx + 1}: ${getRgbStr(color)};\n`;
    });
  });

  Object.keys(presetDarkPalettes).forEach((key) => {
    const colors = presetDarkPalettes[key];

    colors.forEach((color, idx) => {
      cssVarsDarkTemplate += `  --${key}-${idx + 1}: ${getRgbStr(color)};\n`;
    });
  });

  // css status variables
  const colorsVarsArr = Object.keys(colorVarsMap);
  colorsVarsArr.forEach((key, vi) => {
    const colors = colorVarsMap[key];

    colors.forEach((color, ci) => {
      const cidx = ci + 1;
      if (key === 'primary') {
        cssVarsLightTemplate += `  --primary-${cidx}: var(~'@primary-${cidx}');\n`;
        cssVarsDarkTemplate += `  --primary-${cidx}: var(~'@dark-primary-${cidx}');\n`;
        return;
      }

      const canLine = line(vi, colorsVarsArr.length, ci, colors.length);
      cssVarsLightTemplate += `  --${key}-${cidx}: var(~'@${key}-${cidx}');${canLine}`;
      cssVarsDarkTemplate += `  --${key}-${cidx}: var(~'@dark-${key}-${cidx}');${canLine}`;
    });
  });

  cssVarsLightTemplate += '\n}';
  cssVarsDarkTemplate += '\n}';
  fs.outputFileSync(path.resolve('./css-variables.less'), `${cssVarsImport}${cssVarsLightTemplate}\n\n${cssVarsDarkTemplate}`);
}
