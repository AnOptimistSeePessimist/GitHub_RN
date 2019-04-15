import Types from '../types';

/**
 *
 * update theme actionCreator
 * @param theme
 * @returns {{type: string, theme: *}}
 */
export function onThemeChange(theme) {
  return {
    type: Types.THEME_CHANGE,
    theme: theme
  }
}