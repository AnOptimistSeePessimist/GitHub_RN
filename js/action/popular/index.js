import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData} from '../ActionUtil';

/**
 *
 * this is an async actionCreator for getting popular data
 *
 * @param storeName => 仓库名
 * @param url => 仓库地址
 * @param pageSize 每页显示的数据
 * @return function => action
 */

export const onRefreshPopular = (storeName, url, pageSize) => (dispatch, getState, {api}) => {
  dispatch({type: Types.POPULAR_REFRESH, storeName, hideLoadingMore: true});
  // let dataStore = new DataStore();
  api.fetchData(url, FLAG_STORAGE.flag_popular) // 异步 action 与数据流
    .then((data) => {
      handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize);
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

export const onLoadMorePopular = (storeName, pageIndex, pageSize, dataArray = [], callback) => (dispatch, getState, extraArgument) => {
  setTimeout(() => {
    if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完全部数据
      if (typeof callback === 'function') {
        callback('no more');
      }
      dispatch({
        type: Types.POPULAR_LOAD_MORE_FAIL,
        error: 'no more',
        storeName,
        pageIndex: --pageIndex,
        projectModes: dataArray
      });
    } else {
      // 本次和载入的最大数量
      let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
      dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        storeName,
        pageIndex,
        items: dataArray,
        projectModes: dataArray.slice(0, max)
      });
    }
  }, 500);
}
