import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HtmlView from 'react-native-htmlview';
import BaseItem from "./BaseItem";

export default class TrendingItem extends BaseItem {
  render() {
    const {projectModel, onSelect} = this.props;
    // console.log('item: ', item);
    const {item} = projectModel;
    if (!item) {
      return null;
    }

    let description = '<p>' + item.description + '</p>';

    return (
      <TouchableOpacity
        onPress={onSelect}
      >
        <View
          style={styles.container}
        >
          <Text style={styles.title}>
            {item.fullName}
          </Text>
          <HtmlView
            value={description}
            onLinkPress={(url) => {
            }}
            stylesheet={{
              p: styles.description,
              a: styles.description
            }}
          />
          <View style={styles.row}>
            <View style={{flexDirection: 'row'}}>
              <Text>Built by: </Text>
              {
                item.contributors.map((result, i, arr) => {
                  return (
                    <Image
                      key={i}
                      style={{height: 22, width: 22, margin: 2}}
                      source={{uri: arr[i]}}
                    />
                  )
                })
              }
            </View>
            {/*<Text>Star: {item.meta}</Text>*/}
            {this._favoriteIcon()}
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
