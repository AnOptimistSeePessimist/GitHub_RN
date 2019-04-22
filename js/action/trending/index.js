import Types from '../types';
import {FLAG_STORAGE} from "../../expand/dao/DataStore";
import {handleData} from "../ActionUtil";

/**
 *
 * this is an async actionCreator for getting trending data
 *
 * @param storeName => 仓库名
 * @param url => 仓库地址
 * @param pageSize 每页显示的数据
 * @return function => action
 */

export const onRefreshTrending = (storeName, url, pageSize) => (dispatch, getState, {api}) => {
  dispatch({type: Types.TRENDING_REFRESH, storeName, hideLoadingMore: true});
  // let dataStore = new DataStore();
  // console.log('api: ', api);
  api.fetchData(url, FLAG_STORAGE.flag_trending) // 异步 action 与数据流
    .then((data) => {
      handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize);
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

export const onLoadMoreTrending = (storeName, pageIndex, pageSize, dataArray = [], callback) => (dispatch, getState, extraArgument) => {
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
        projectModes: dataArray
      });
    } else {
      // 本次和载入的最大数量
      let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
      dispatch({
        type: Types.TRENDING_REFRESH_SUCCESS,
        storeName,
        pageIndex,
        items: dataArray,
        projectModes: dataArray.slice(0, max)
      });
    }
  }, 500);
}

