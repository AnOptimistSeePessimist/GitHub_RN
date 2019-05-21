/**
 *
 * @param actionType
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 */
import ProjectModel from "../model/ProjectModel";
import Utils from "../util/Utils";

export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao) {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items;
    }
  }

  let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize); // 第一次要加载的数据
  _projectModels(showItems, favoriteDao, (projectModes) => {
    dispatch({
      type: actionType,
      projectModels: projectModes,
      items: fixItems,
      storeName,
      pageIndex: 1
    });
  });

}

/**
 * 通过本地的收藏状态包装Item
 *
 * @param showItems
 * @param favoriteDao
 * @param callback
 * @return {Promise<void>}
 * @private
 */
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = [];
  try {
    debugger;
    keys = await favoriteDao.getFavoriteKeys();
  } catch (e) {
    console.log(e);
  }

  let projectModels = [];

  for (let i = 0, len = showItems.length; i < len; i++) {
    projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)));
  }

  if (typeof callback === 'function') {
    callback(projectModels);
  }

}









