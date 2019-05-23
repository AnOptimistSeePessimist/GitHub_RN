import React, {Component} from 'react';
import {StyleSheet, View, WebView} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";

const THEME_COLOR = '#678';

export default class WebViewPage extends Component {

  constructor(props) {
    super(props);
    this.params = props.navigation.state.params;
    const {title, url} = this.params;

    this.state = {
      title,
      url: url,
      canGoBack: false,
    };
    this.backPress = new BackPressComponent({backPress: this.onBackPress});
  }

  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress = () => {
    this.onBack();
    return true;
  }

  onBack() {
    const {canGoBack} = this.state;
    if (canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url

    });
  }

  render() {
    const {title, url} = this.state;
    let navigationBar = (
      <NavigationBar
        title={title}
        style={{backgroundColor: THEME_COLOR}}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      />
    );

    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={event => this.onNavigationStateChange(event)}
          source={{uri: url}}
        />
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
