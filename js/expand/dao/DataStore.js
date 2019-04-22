import {AsyncStorage} from 'react-native';
import GitHubTrending from 'GitHubTrending';

export const FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending'
};

export default class DataStore {

  /**
   * 获取数据策略
   * @param url
   * @param flag
   * @returns {Promise<any> | Promise}
   */
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then((wrapData) => {
          if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData);
          } else {
            this.fetchNetData(url, flag)
              .then((data) => {
                resolve(this._wrapData(data));
              })
              .catch((error) => {
                reject(error);
              })
          }
        })
        .catch((error) => {
          this.fetchNetData(url, flag)
            .then((data) => {
              resolve(this._wrapData(data));
            })
            .catch((error) => {
              reject(error);
            });
        });
    });
  }

  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getFullYear() !== targetDate.getFullYear()) return false;
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;
    if (currentDate.getTime() > targetDate.getTime()) return false;
    return true;

  }

  /**
   * 保存数据
   * @param url
   * @param data
   * @param callback
   */
  saveData(url, data, callback) {
    if (!url || !data) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  }

  _wrapData(data) {
    return {
      data: data,
      timestamp: new Date().getTime()
    };
  }

  /**
   * 获取本地数据
   * @param url
   * @returns {Promise<any> | Promise}
   */
  fetchLocalData(url, flag) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.log(e);
          }
        } else {
          reject(error);
          console.log(error);
        }
      });
    });
  }

  /**
   *
   * 获取网络数据
   * @param url
   * @param flag
   * @returns {Promise<any> | Promise}
   */
  fetchNetData(url, flag) {
    return new Promise((resolve, reject) => {
      if (flag === FLAG_STORAGE.flag_popular) {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then((responseData) => {
            this.saveData(url, responseData);
            resolve(responseData);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        new GitHubTrending().fetchTrending(url)
          .then((items) => {
            if (!items) {
              throw new Error('responseData is null');
            }
            this.saveData(url, items);
            resolve(items);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

}