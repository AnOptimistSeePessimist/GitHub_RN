import React, {Component} from 'react';
import {Button, TouchableOpacity, StyleSheet, Text, View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from "../common/NavigationBar";
import {MORE_MENU} from '../common/MORE_MENU';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../res/GlobalStyles';
import ViewUtil from "../util/ViewUtil";

const THEME_COLOR = '#678';

class MyPage extends Component {

  onClick(menu) {

  }

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }

  render() {
    const navigationBar = (
      <NavigationBar
        title={'我的'}
        style={{backgroundColor: '#678'}}
      />
    );

    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.item}
            onPress={() => this.onClick(MORE_MENU.About)}
          >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{
                  marginRight: 10,
                  color: THEME_COLOR,
                }}
              />
              <Text>GitHub Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: '#3388FF',
              }}/>
          </TouchableOpacity>
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Tutorial)}
          {/* 趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line}/>
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  about_left: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }
});
