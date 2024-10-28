import {
  presetPalettes,
  presetDarkPalettes,
  red,
  volcano,
  gold,
  yellow,
  lime,
  green,
  cyan,
  blue,
  geekblue,
  purple,
  magenta,
  grey,
  orange
} from '@ant-design/colors';
import path from 'path';
import fs from 'fs-extra';
import Color from 'color';

let colorTemplate = '// DONT EDIT AUTO GENERATED BY ANTD COLORS\n';
let cssVarsImport = `@import './color.less';\n\n`;
let cssVarsLightTemplate = 'body { \n';
let cssVarsDarkTemplate = `body[twist-theme='dark'] { \n`;
const colorVarsMap = {
  primary: blue,
  success: green,
  danger: red,
  warning: orange,
  link: geekblue,
}

function getRgbStr(color) {
  return Color(color)
    .rgb()
    .round()
    .color
    .join(',')
}

function line(vi, vlength, ci, clength) {
  return (vi === vlength - 1 && ci === clength - 1) ? '' : '\n';
}

function generateColorFile() {
  // light
  Object.keys(presetPalettes).forEach(key => {
    const colors = presetPalettes[key];

    colors.forEach((color, idx) => {
      colorTemplate += `@${key}-${idx + 1}: ${color};\n`;
      cssVarsLightTemplate += `  --${key}-${idx + 1}: ${getRgbStr(color)};\n`;
    })

    colorTemplate += '\n';
  })

  // light css variables
  const colorsVarsArr = Object.keys(colorVarsMap);
  colorsVarsArr.forEach((key, vi) => {
    const colors = colorVarsMap[key];

    colors.forEach((color, ci) => {
      if (key === 'primary') {
        cssVarsLightTemplate += `  --primary-${ci + 1}: var(~'@primary-${ci + 1}');\n`;
        return;
      }
      cssVarsLightTemplate += `  --${key}-${ci + 1}: var(~'@${key}-${ci + 1}');${line(vi, colorsVarsArr.length, ci, colors.length)}`;
    })
  })


  // dark
  Object.keys(presetDarkPalettes).forEach(key => {
    const colors = presetDarkPalettes[key];

    colors.forEach((color, idx) => {
      colorTemplate += `@dark-${key}-${idx + 1}: ${color};\n`;
      cssVarsDarkTemplate += `  --${key}-${idx + 1}: ${getRgbStr(color)};\n`;
    })

    colorTemplate += '\n';
  })

  // dark css variables
  colorsVarsArr.forEach((key, vi) => {
    const colors = colorVarsMap[key];

    colors.forEach((color, ci) => {
      if (key === 'primary') {
        cssVarsDarkTemplate += `  --primary-${ci + 1}: var(~'@dark-primary-${ci + 1}');\n`;
        return;
      }
      cssVarsDarkTemplate += `  --${key}-${ci + 1}: var(~'@dark-${key}-${ci + 1}');${line(vi, colorsVarsArr.length, ci, colors.length)}`;
    })
  })

  cssVarsLightTemplate += '\n}';
  cssVarsDarkTemplate += '\n}';
  fs.outputFile(path.resolve('./color.less'), colorTemplate);
  fs.outputFileSync(path.resolve('./css-variables.less'), `${cssVarsImport}${cssVarsLightTemplate}\n\n${cssVarsDarkTemplate}`);
}

function generateLessVars() {
  Object.keys(colorVarsMap).forEach(key => {
    const colors = colorVarsMap[key];

    colors.forEach((color, idx) => {
      if (key === 'primary') {
        colorTemplate += `@${key}-${idx + 1}: rgb(var(--primary-${idx + 1}));\n`;
        return;
      }
      colorTemplate += `@${key}-${idx + 1}: rgb(var(--${key}-${idx + 1}));\n`;
    })

    colorTemplate += '\n';
  })

  fs.outputFile(path.resolve('./color.less'), colorTemplate);
}

generateColorFile()
generateLessVars()