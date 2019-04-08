import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View, TextInput} from 'react-native';

type Props = {};
const KEY = 'save_key';

export default class AsyncStorageDemoPage extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    };
  }

  async doSave() {
    // 用法一
    AsyncStorage.setItem(KEY, this.value, error => {
      error && console.log(error.toString());
    });
    /*// 用法二
    AsyncStorage.setItem(KEY, this.value)
      .catch((error) => {
        error && console.log(error.toString());
      });
    // 用法三
    try {
      await AsyncStorage.setItem(KEY, this.state);
    } catch (error) {
      error && console.log(error.toString());
    }*/
  }

  async doRemove() {
    // 用法一
    AsyncStorage.removeItem(KEY, error => {
      error && console.log(error.toString());
    });
    /*// 用法二
    AsyncStorage.removeItem(KEY)
      .catch((error) => {
        error && console.log(error.toString());
      });
    // 用法三
    try {
      await AsyncStorage.removeItem(KEY);
    } catch (error) {
      error && console.log(error.toString());
    }*/
  }

  async getData() {
    // 用法一
    AsyncStorage.getItem(KEY, (error, value) => {
      this.setState({
        showText: value
      });
      console.log(value);
      error && console.log(error.toString());
    });
    /*// 用法二
    AsyncStorage.getItem(KEY)
      .then(value => {
        this.setState({
          showText: value
        });
        console.log(value);
      })
      .catch((error) => {
        error && console.log(error.toString());
      });
    // 用法三
    try {
      const value = await AsyncStorage.getItem(KEY);
      this.setState({
        showText: value
      });
    } catch (error) {
      error && console.log(error.toString());
    };*/
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>AsyncStorage 使用</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            this.value = text;
          }}
          onSubmitEditing={() => {}}
        />
        <Text
          style={styles.text}
          onPress={() => {
            this.doSave();
          }}
        >存储</Text>

        <Text
          style={styles.text}
          onPress={() => {
            this.doRemove();
          }}
        >删除</Text>

        <Text
          style={styles.text}
          onPress={() => {
            this.getData();
          }}
        >获取</Text>
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
    borderWidth: 1,
    width: 150
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
    borderWidth: 1,
    paddingVertical: 5
  }
});