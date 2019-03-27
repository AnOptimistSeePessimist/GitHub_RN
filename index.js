/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry, YellowBox} from 'react-native';
// import App from './js/App';
import AppNavigator from './js/navigator/AppNavigator';
// import WelcomePage from './js/page/WelcomePage';
import {name as appName} from './app.json';

YellowBox.ignoreWarnings([
  'You should only render one navigator',
  'Remote debugger is in a background'
]);

AppRegistry.registerComponent(appName, () => AppNavigator);
