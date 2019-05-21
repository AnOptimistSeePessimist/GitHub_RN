import {AsyncStorage} from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
  constructor(flag) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }

  /**
   * 收藏项目, 保存收藏的项目
   *
   * @param key
   * @param value
   * @param callback
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, true);
      }
    });
  }

  /**
   *
   * 取消收藏, 移除已经收藏的项目
   *
   * @param key
   */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, false);
      }
    });
  }

  /**
   * 更新Favorite Key集合
   *
   * @param key
   * @param isAdd
   */
  updateFavoriteKeys(key, isAdd) {
    // 将收藏列表从缓存中读取出来
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) { // 如果是添加，且 key 不存在则添加到数组中
          if (index === -1) favoriteKeys.push(key);
        } else { // 如果是删除，且 key 存在则将其从数值中移除
          if (index !== -1) favoriteKeys.splice(index, 1);
        }
        // 再次存储到缓存中去
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
      }
    });
  }

  /**
   *
   * 获取收藏的 Repository 对应的 key
   * @return {Promise<any> | Promise}
   */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error);
          }
          resolve();
        } else {
          reject(error);
        }
      });
    });
  }

  /**
   * 获取所有收藏的项目
   *
   * @return {Promise}
   */
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys().then((keys) => {
        let items = [];
        if (keys) {
          AsyncStorage.multiGet(key, (err, stores) => {
            try {
              stores.map((result, i, store) => {
                let key = store[i][0];
                let value = store[i][1];
                if (value) {
                  items.push(JSON.parse(value));
                }
              });
              resolve(items);
            } catch (e) {
              reject(e);
            }
          });
        } else {
          resolve(items);
        }
      })
        .catch((e) => {
          reject(e);
        });
    });
  }

  


}
