import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import NavigationUtil from "../navigator/NavigationUtil";

type Props = {};

class MyPage extends Component<Props> {
  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MyPage</Text>
        <Button
          title={'改变主题色'}
          onPress={() => {
            this.props.onThemeChange('#000');
          }}
        />
        <Text
          onPress={() => {
            NavigationUtil.goPage({}, 'DetailPage');
          }}
        >跳转到详情页</Text>
        <Button
          title={'Fetch 使用'}
          onPress={() => {
            NavigationUtil.goPage({}, 'FetchDemoPage');
          }}
        />
        <View style={{height: 10}}/>
        <Button
          title={'AsyncStorage 使用'}
          onPress={() => {
            NavigationUtil.goPage({}, 'AsyncStorageDemoPage');
          }}
        />
        <View style={{height: 10}}/>
        <Button
          title={'DataStore 使用'}
          onPress={() => {
            NavigationUtil.goPage({}, 'DataStoreDemoPage');
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchtoProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchtoProps)(MyPage);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
