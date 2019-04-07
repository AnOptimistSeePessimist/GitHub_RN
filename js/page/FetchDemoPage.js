import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, TextInput} from 'react-native';

type Props = {};
export default class FetchDemoPage extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
  }

  loadData() {
    const url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((responseText) => {
        this.setState({
          showText: responseText
        });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            console.log('text: ', text);
            this.searchKey = text;
          }}
        />
        <Text style={styles.welcome}>Fetch 使用</Text>
        <Button
          title={'获取'}
          onPress={() => {
            this.loadData();
          }}
        />
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  input: {
    height: 30,
    width: 100,
    // flex: 1,
    borderColor: '#000',
    borderWidth: 1,
    marginRight: 10
  }
});