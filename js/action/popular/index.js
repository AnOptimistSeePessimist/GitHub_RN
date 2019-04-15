import Types from '../types';
import DataStore from '../../expand/dao/DataStore';

/**
 *
 * this is an async actionCreator for getting popular data
 *
 * @param storeName => 仓库名
 * @param url => 仓库地址
 * @param pageSize 每页显示的数据
 * @return function => action
 */

export const onRefreshPopular = (storeName, url, pageSize) => (dispatch, getState, extraArgument) => {
  dispatch({type: Types.POPULAR_REFRESH, storeName});
  let dataStore = new DataStore();
  dataStore.fetchData(url) // 异步 action 与数据流
    .then((data) => {
      handleData(dispatch, storeName, data, pageSize);
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
        projectModes: dataArray.slice(0, max)
      });
    }
  }, 500);
}

function handleData(dispatch, storeName, data, pageSize) {
  let fixItems = [];
  if (data && data.data && data.data.time) {
    fixItems = data.data.time;
  }
  dispatch({
    type: Types.POPULAR_REFRESH_SUCCESS,
    projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize), // 第一次要加载的数据
    items: fixItems,
    storeName,
    pageIndex: 1
  });
}

