import Types from '../types';
import DataStore from '../../expand/dao/DataStore';

/**
 *
 * this is an async actionCreator for getting popular data
 *
 * @param storeName => 仓库名
 * @param url => 仓库地址
 * @return function => action
 */

export var onLoadPopularData = (storeName, url) => (dispatch, getState, extraArgument) => {
  dispatch({type: Types.POPULAR_REFRESH, storeName});
  let dataStore = new DataStore();
  dataStore.fetchData(url) // 异步 action 与数据流
    .then((data) => {
      handleData(dispatch, storeName, data);
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: Types.LOAD_POPULAR_FAIL,
        storeName,
        error
      });
    });
};

function handleData(dispatch, storeName, data) {
  dispatch({
    type: Types.LOAD_POPULAR_SUCCESS,
    items: data && data.data && data.data.items,
    storeName
  });
}

