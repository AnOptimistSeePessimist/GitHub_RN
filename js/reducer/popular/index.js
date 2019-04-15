import Types from '../../action/types';

const defaultState = {};

/**
 * popular: {
 *   java: {
 *     items: [],
 *     isLoading: false
 *   },
 *   ios: {
 *     items: [],
 *     isLoading: true
 *   }
 * }
 * 0. state tree, 横向扩展
 * 1. 如何动态设置 store, 和动态获取 store（storeKey 不固定）
 *
 * @param state
 * @param action
 * @return {{theme: ({comment: string, content: string, prop: string, tag: string, value: string}|string|onAction)}}
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.LOAD_POPULAR_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,
          isLoading: false
        }
      };
    case Types.POPULAR_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          // items: action.items,
          isLoading: true
        }
      };
    case Types.LOAD_POPULAR_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          // items: action.items,
          isLoading: false
        }
      };
    default:
      return state;
  }
}