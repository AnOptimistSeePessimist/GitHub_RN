import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';

type Props = {};
class FavoritePage extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FavoritePage</Text>
        <Button
          title={'改变主题色'}
          onPress={() => {
            this.props.onThemeChange('red');
          }}
        />
      </View>
    );
  }
}

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

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage);
