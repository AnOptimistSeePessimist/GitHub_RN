import React, {Component} from 'react';
import {FlatList, StyleSheet, ActivityIndicator, View, RefreshControl, Text} from 'react-native';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from 'react-navigation';
import Toast from 'react-native-easy-toast';
import actions from '../action';
import PopularItem from '../common/PopularItem';
import NavigationBar from "../common/NavigationBar";

const URL = 'https://github.com/trending/';
const QUERY_STR = '?since=daily';
const TITLE_COLOR = 'red';

type Props = {};
export default class TrendingPage extends Component<Props> {

  constructor(props) {
    super(props);
    this.tabNames = [
      'All',
      /*
      'Unknown',
      'C',
      'C#',
      'PHP',
      'JavaScript'
      */
    ];
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} tabLabel={item}/>,
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
        <NavigationBar title={'趋势'} style={{backgroundColor: '#678'}}/>
        <TabNavigator/>
      </View>
    )
  }
}

const pageSize = 10; // 设为常量，防止修改

class TrendingTab extends Component {

  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, (callback) => {
        this.toast.show('没有更多了!');
      });
    } else {
      onRefreshTrending(this.storeName, url, pageSize);
    }

  }

  /**
   * 获取与当前页面有关的数据
   * @return {*}
   * @private
   */
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModes: [], // 要显示的数据
        hideLoadingMore: true, // 默认隐藏加载更多
      };
    }
    return store;
  }

  genFetchUrl(key) {
    const keyValue = (key === 'All' ? '' : key.toLowerCase());
    console.log(keyValue);
    return URL + keyValue + QUERY_STR;
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

  genIndicator() {
    // console.log('hideLoadingMore: ', this._store().hideLoadingMore);
    return (
      this._store().hideLoadingMore ? null :
        <View style={styles.indicatorContainer}>
          <ActivityIndicator style={styles.indicator}/>
          <Text>正在加载更多</Text>
        </View>
    )
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          renderItem={data => this.renderItem(data)}
          data={store.projectModes}
          keyExtractor={(item) => {
            return (item.id || item.fullName) + '';
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
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            setTimeout(() => {
              if (this.canLoadMore) {
                console.log('----onEndReached----');
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;
          }}
        />
        <Toast
          ref={toast => this.toast = toast}
          position={'center'}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  trending: state.trending
});

const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callback))
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);


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
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});
