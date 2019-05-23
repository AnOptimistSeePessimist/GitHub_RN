import Types from '../types';
import {FLAG_STORAGE} from "../../expand/dao/DataStore";
import {_projectModels, handleData} from "../ActionUtil";

/**
 *
 * this is an async actionCreator for getting trending data
 *
 * @param storeName => 仓库名
 * @param url => 仓库地址
 * @param pageSize 每页显示的数据
 * @return function => action
 */

export const onRefreshTrending = (storeName, url, pageSize, favoriteDao) => (dispatch, getState, {api}) => {
  dispatch({type: Types.TRENDING_REFRESH, storeName, hideLoadingMore: true});
  // let dataStore = new DataStore();
  // console.log('api: ', api);
  api.fetchData(url, FLAG_STORAGE.flag_trending) // 异步 action 与数据流
    .then((data) => {
      handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao);
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: Types.TRENDING_REFRESH_FAIL,
        storeName,
        error
      });
    });
};

export const onLoadMoreTrending = (storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) => (dispatch, getState, extraArgument) => {
  setTimeout(() => {
    if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完全部数据
      if (typeof callback === 'function') {
        callback('no more');
      }
      dispatch({
        type: Types.TRENDING_LOAD_MORE_FAIL,
        error: 'no more',
        storeName,
        pageIndex: --pageIndex,
        projectModels: dataArray
      });
    } else {
      // 本次和载入的最大数量
      let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
      _projectModels(dataArray.slice(0, max), favoriteDao, data => {
        dispatch({
          type: Types.POPULAR_REFRESH_SUCCESS,
          storeName,
          pageIndex,
          items: dataArray,
          projectModels: data
        });
      });
    }
  }, 500);
};

export function onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
  return dispatch => {
    let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max), favoriteDao, data => {
      dispatch({
        type: Types.FLUSH_TRENDING_FAVORITE,
        storeName,
        pageIndex,
        items: dataArray,
        projectModels: data
      });
    });
  }
}

