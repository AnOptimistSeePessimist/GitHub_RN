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

  loadData2() {
    const url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
      .then((response) => {
        console.log('response: ', response);
        if (!response.ok) {
          return response.text();
        }
        throw new Error('Network response was not ok.');
      })
      .then((responseText) => {
        this.setState({
          showText: responseText
        });
      })
      .catch((e) => {
        this.setState({
          showText: e.toString()
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            console.log('text: ', text);
            this.searchKey = text;
          }}
          onSubmitEditing={() => {
            this.loadData();
          }}
        />
        <Text style={styles.welcome}>Fetch 使用</Text>
        <Button
          title={'获取'}
          onPress={() => {
            this.loadData();
          }}
        />
        <View style={{height: 5}}/>
        <Button
          title={'处理请求异常 - 获取'}
          onPress={() => {
            this.loadData2();
          }}
        />
        <View style={{height: 5}}/>
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
    paddingVertical: 5,
    borderColor: '#000',
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 10
  }
});