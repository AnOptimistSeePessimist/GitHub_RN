import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtil {

  /**
   *
   * @param callback
   * @param text
   * @param color
   * @param Icons
   * @param icon
   * @param expandableIco
   * @return {*}
   */
  static getSettingItem(callback, text, color, Icons, icon, expandableIco) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={callback}
        style={styles.setting_item_container}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {
            Icons && icon ?
              <Icons
                name={icon}
                size={16}
                style={{color: color, marginRight: 10}}
              /> :
              <View style={{width: 16, height: 16, opacity: 1}}/>
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIco ? expandableIco : 'ios-arrow-forward'}
          size={16}
          style={{
            marginRight: 10,
            alignSelf: 'center',
            color: color || 'black'
          }}
        />
      </TouchableOpacity>
    )
  }

  static getMenuItem(callback, menu, color, expandableIco) {
    return ViewUtil.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIco);
  }

  /**
   *  获取左侧返回按钮
   *
   * @param callback
   * @return {XML}
   */
  static getLeftBackButton(callback) {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={callback}
      >
        <Ionicons
          name={'ios-arrow-back'}
          size={26}
          style={{color: 'white'}}
        />
      </TouchableOpacity>
    )
  }

  /**
   * 获取分享按钮
   *
   * @param callback
   * @return {*}
   */
  static getShareButton(callback) {
    return (
      <TouchableOpacity
        underlayColor={'transparent'}
        onPress={callback}
      >
        <Ionicons
          name={'md-share'}
          size={20}
          style={{color: 'white', opacity: 0.9, marginRight: 9}}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: 'white',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});