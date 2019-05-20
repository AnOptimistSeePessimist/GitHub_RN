import React, {Component} from 'react';
import {Modal, View, Text, StatusBar, StyleSheet, Platform, TouchableOpacity, DeviceInfo} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../model/TimeSpan';

export const timeSpans = [
  new TimeSpan('今 天', 'since=daily'),
  new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly')
];

export default class TrendingDialog extends Component {
  state = {
    visible: false,

  };

  show() {
    this.setState({
      visible: true
    });
  }

  dismiss() {
    this.setState({
      visible: false
    });
  }

  render() {
    const {onClose, onSelect} = this.props;
    const {visible} = this.state;
    return (
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.dismiss()}
        >
          <MaterialIcons
            name={'arrow-drop-up'}
            size={56}
            style={styles.arrow}
          />
          <View style={styles.content}>
            {
              timeSpans.map((result, index, array) => {
                return (
                  <TouchableOpacity
                    key={index.toString()}
                    onPress={() => onSelect(result)}
                    underlayColor={'transparent'}
                  >
                    <View style={styles.text_container}>
                      <Text style={styles.text}>{result.showText}</Text>
                    </View>
                    {
                      index !== array.length ?
                        (
                          <View style={styles.line}/>
                        )
                        : null
                    }
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    alignItems: 'center',
    paddingTop: DeviceInfo.isIphoneX_deprecated ? 30 : 0
  },
  arrow: {
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: - 25
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3
  },
  text_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray'
  }
});
