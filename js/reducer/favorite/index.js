import Types from '../../action/types';

const defaultState = {};

/**
 *
 * favorite: {
 *   popular: {
 *      projectModels: [],
 *      isLoading: false
 *   },
 *   trending: {
 *      projectModels: [],
 *      isLoading: false
 *   }
 * }
 * */

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.FAVORITE_LOAD_DATA: // 获取数据
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true
        }
      };
    case Types.FAVORITE_LOAD_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels, // 此次要展示的数据
          isLoading: false
        }
      };
    case Types.FAVORITE_LOAD_FAIL: // 下拉获取数据失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true
        }
      };
    default:
      return state;
  }
}











