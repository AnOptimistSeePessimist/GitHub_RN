import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from 'react-navigation';
import actions from '../action';
import PopularItem from '../common/PopularItem';
import NavigationUtil from "../navigator/NavigationUtil";

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const TITLE_COLOR = 'red';

type Props = {};
export default class PopularPage extends Component<Props> {

  constructor(props) {
    super(props);
    this.tabNames = [
      // 'Java',
      // 'Android',
      // 'iOS',
      // 'React',
      'React Native',
      // 'PHP'
    ];
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item}/>,
        navigationOptions: {
          title: item
        }
      };
    });
    return tabs;
  }


  render() {
    const TabNavigator = createMaterialTopTabNavigator(
      this._genTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: '#678'
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }
      }
    );
    return (
      <View style={{flex: 1, marginTop: 30}}>
        <TabNavigator/>
      </View>
    )
  }
}

class PopularTab extends Component {

  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const {onLoadPopularData} = this.props;
    const url = this.genFetchUrl(this.storeName);
    onLoadPopularData(this.storeName, url);
  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    return (
      <PopularItem
        item={data.item}
        onSelect={() => {

        }}
      />
    )
  }

  render() {
    let {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false
      };
    }
    return (
      <View style={styles.container}>
        <FlatList
          renderItem={data => this.renderItem(data)}
          data={store.items}
          keyExtractor={(item) => {
            return item.id + '';
          }}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={TITLE_COLOR}
              colors={[TITLE_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
            />
          }
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  popular: state.popular
});

const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);


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
  },
  tabStyle: {
    minWidth: 50
  },
  indicatorStyle: {
    height: 3,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    marginVertical: 6
  },
  item: {
    borderWidth: 2
  }
});
