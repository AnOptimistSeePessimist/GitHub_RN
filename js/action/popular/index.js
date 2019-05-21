import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, handleData} from '../ActionUtil';

/**
 *
 * this is an async actionCreator for getting popular data
 *
 * @param storeName => 仓库名
 * @param url => 仓库地址
 * @param pageSize 每页显示的数据
 * @param favoriteDao
 * @return function => action
 */

export const onRefreshPopular = (storeName, url, pageSize, favoriteDao) => (dispatch, getState, {api}) => {
  dispatch({type: Types.POPULAR_REFRESH, storeName, hideLoadingMore: true});
  // let dataStore = new DataStore();
  api.fetchData(url, FLAG_STORAGE.flag_popular) // 异步 action 与数据流
    .then((data) => {
      handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao);
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: Types.POPULAR_REFRESH_FAIL,
        storeName,
        error
      });
    });
};
/**
 *
 *
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDao
 * @param callback 回调函数
 * @return {Function}
 */
export const onLoadMorePopular = (storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) => (dispatch, getState, extraArgument) => {
  setTimeout(() => {
    if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完全部数据
      if (typeof callback === 'function') {
        callback('no more');
      }
      dispatch({
        type: Types.POPULAR_LOAD_MORE_FAIL,
        error: 'no more',
        storeName,
        pageIndex: --pageIndex
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
}
