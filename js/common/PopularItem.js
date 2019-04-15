import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

export default class PopularItem extends React.Component {
  render() {
    const {item, onSelect} = this.props;
    console.log('item: ', item);
    if (!item || !item.owner) {
      return null;
    }
    return (
      <TouchableOpacity
        activeOpacity={.8}
        onPress={onSelect}
      >
        <View
          style={styles.container}
        >
          <Text style={styles.title}>
            {item.full_name}
          </Text>
          <Text style={styles.description}>
            {item.description}
          </Text>
          <View style={styles.row}>
            <View style={{flexDirection: 'row'}}>
              <Text>Author: {}</Text>
              <Image
                style={{height: 22, width: 22}}
                source={{uri: item.owner.avatar_url}}
              />
            </View>
            <Text>Star: {item.stargazers_count}</Text>
            <Text>星星</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0.5,
      height: 0.5
    },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121'
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575'
  }
});