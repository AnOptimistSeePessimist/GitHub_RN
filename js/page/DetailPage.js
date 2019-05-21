import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, WebView} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

export default class DetailPage extends Component {

  constructor(props) {
    super(props);
    this.params = props.navigation.state.params;
    const {projectModel} = this.params;
    this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName;
    const title = projectModel.full_name || projectModel.fullName;

    this.state = {
      title,
      url: this.url,
      canGoBack: false
    };
    this.backPress = new BackPressComponent({backPress: this.onBackPress});
  }

  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress =() => {
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

  renderRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {

          }}
        >
          <FontAwesome
            name={'star-o'}
            size={20}
            style={{color: 'white', marginRight: 10}}
          />
        </TouchableOpacity>
        {
          ViewUtil.getShareButton(() => {

          })
        }
      </View>
    )
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
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        titleLayoutStyle={title.length > 20 ? {paddingRight: 30} : null}
        rightButton={this.renderRightButton()}
        title={title}
        style={{backgroundColor: THEME_COLOR}}
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
