import React, {Component, Fragment} from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  RefreshControl,
  Text,
  DeviceInfo,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from 'react-navigation';
import Toast from 'react-native-easy-toast';
import actions from '../action';
import TrendingItem from '../common/TrendingItem';
import NavigationBar from "../common/NavigationBar";
import TrendingDialog, {timeSpans} from '../common/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";

const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const URL = 'https://github.com/trending/';
const QUERY_STR = '?since=daily';
const TITLE_COLOR = 'red';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

type Props = {};
export default class TrendingPage extends Component<Props> {

  constructor(props) {
    super(props);
    this.tabNames = [
      'All'
      /*
      ,
      'Unknown',
      'C',
      'C#',
      'PHP',
      'JavaScript'
      */
    ];
    this.state = {
      timeSpan: timeSpans[0].showText
    };
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item}/>,
        navigationOptions: {
          title: item
        }
      };
    });
    return tabs;
  }

  renderTitleView() {
    return (
      <Fragment>
        <TouchableOpacity
          underlayColor={'transparent'}
          onPress={() => this.dialog.show()}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: '#FFFFFF', fontWeight: '400'}}>
              趋势 {this.state.timeSpan}
            </Text>
            <MaterialIcons name={'arrow-drop-down'} size={26} color={'white'}/>
          </View>
        </TouchableOpacity>
      </Fragment>
    )
  }

  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab.showText
    });
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }

  renderTrendingDialog() {
    return (
      <TrendingDialog
        ref={dialog => this.dialog = dialog}
        onSelect={tab => this.onSelectTimeSpan(tab)}
      />
    )
  }

  _tabNav() {
    if (!this.tabNav) {
      this.tabNav = createMaterialTopTabNavigator(
        this._genTabs(),
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false,
            scrollEnabled: true,
            style: {
              backgroundColor: '#678',
              height: 50
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle
          }
        }
      );
    }
    return this.tabNav;
  }

  render() {
    const TabNavigator = this._tabNav();
    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIphoneX_deprecated ? 30 : 0}}>
        <NavigationBar titleView={this.renderTitleView()} style={{backgroundColor: '#678'}}/>
        <TabNavigator/>
        {this.renderTrendingDialog()}
      </View>
    )
  }
}

const pageSize = 10; // 设为常量，防止修改

class TrendingTab extends Component {

  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
  }

  componentDidMount() {
    this.loadData();
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (tab) => {
      this.timeSpan = tab.searchText;
      this.loadData();
    });
  }

  componentWillUnmount() {
    this.timeSpanChangeListener && this.timeSpanChangeListener.remove();
  }

  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (callback) => {
        this.toast.show('没有更多了!');
      });
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao);
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
        projectModels: [], // 要显示的数据
        hideLoadingMore: true, // 默认隐藏加载更多
      };
    }
    return store;
  }

  genFetchUrl(key) {
    const keyValue = (key === 'All' ? '' : key.toLowerCase());
    console.log(keyValue);
    return URL + keyValue + '?' + this.timeSpan;
  }

  renderItem(data) {
    let item = data.item;
    return (
      <TrendingItem
        projectModel={item}
        onSelect={(callback) => {
          NavigationUtil.goPage({projectModel: item, flag: FLAG_STORAGE, callback}, 'DetailPage');
        }}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)
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
            return (item.item.id || item.item.fullName) + '';
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
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callback))
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
