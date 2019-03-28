/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry, YellowBox} from 'react-native';
import App from './js/App';
import {name as appName} from './app.json';

YellowBox.ignoreWarnings([
  'You should only render one navigator',
  'Remote debugger is in a background'
]);

AppRegistry.registerComponent(appName, () => App);
