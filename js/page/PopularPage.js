import React, {Component} from 'react';
import {FlatList, StyleSheet, ActivityIndicator, View, RefreshControl, Text, DeviceInfo} from 'react-native';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from 'react-navigation';
import Toast from 'react-native-easy-toast';
import actions from '../action';
import PopularItem from '../common/PopularItem';
import NavigationBar from "../common/NavigationBar";
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const TITLE_COLOR = 'red';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

type Props = {};
export default class PopularPage extends Component<Props> {

  constructor(props) {
    super(props);
    this.tabNames = [
      'Java'
      /*
      ,
      'Android',
      'iOS',
      'React',
      'React Native',
      'PHP'
      */
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
            backgroundColor: '#678',
            height: 50,
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }
      }
    );

    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIphoneX_deprecated ? 30 : 0}}>
        <NavigationBar title={'最新'} style={{backgroundColor: '#678'}}/>
        <TabNavigator/>
      </View>
    )
  }
}

const pageSize = 10; // 设为常量，防止修改

class PopularTab extends Component {

  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(loadMore) {
    const {onRefreshPopular, onLoadMorePopular} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (callback) => {
        this.toast.show('没有更多了!');
      });
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
    }

  }

  /**
   * 获取与当前页面有关的数据
   * @return {*}
   * @private
   */
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 要显示的数据
        hideLoadingMore: true, // 默认隐藏加载更多

      };
    }
    return store;
  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    let item = data.item;
    return (
      <PopularItem
        projectModel={item}
        onSelect={(callback) => {
          NavigationUtil.goPage({projectModel: item, flag: FLAG_STORAGE.flag_popular, callback}, 'DetailPage');
        }}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular);
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
          data={store.projectModels}
          keyExtractor={(item) => {
            return item.item.id + '';
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
  popular: state.popular
});

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback))
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
    // minWidth: 50
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
