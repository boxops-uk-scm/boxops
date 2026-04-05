import * as stylex from '@stylexjs/stylex';

import { nonsemanticBackgroundColor, nonsemanticTextColor } from '../tokens.stylex';

import { vars } from './vars.stylex';

export const variants = {
  color: stylex.create({
    gray: {
      [vars.color]: nonsemanticTextColor.gray,
      [vars.backgroundColor]: nonsemanticBackgroundColor.gray,
    },
    blue: {
      [vars.color]: nonsemanticTextColor.blue,
      [vars.backgroundColor]: nonsemanticBackgroundColor.blue,
    },
    green: {
      [vars.color]: nonsemanticTextColor.green,
      [vars.backgroundColor]: nonsemanticBackgroundColor.green,
    },
    yellow: {
      [vars.color]: nonsemanticTextColor.yellow,
      [vars.backgroundColor]: nonsemanticBackgroundColor.yellow,
    },
    orange: {
      [vars.color]: nonsemanticTextColor.orange,
      [vars.backgroundColor]: nonsemanticBackgroundColor.orange,
    },
    red: {
      [vars.color]: nonsemanticTextColor.red,
      [vars.backgroundColor]: nonsemanticBackgroundColor.red,
    },
    magenta: {
      [vars.color]: nonsemanticTextColor.pink,
      [vars.backgroundColor]: nonsemanticBackgroundColor.pink,
    },
    purple: {
      [vars.color]: nonsemanticTextColor.purple,
      [vars.backgroundColor]: nonsemanticBackgroundColor.purple,
    },
    teal: {
      [vars.color]: nonsemanticTextColor.teal,
      [vars.backgroundColor]: nonsemanticBackgroundColor.teal,
    },
    cyan: {
      [vars.color]: nonsemanticTextColor.cyan,
      [vars.backgroundColor]: nonsemanticBackgroundColor.cyan,
    },
  }),
};
