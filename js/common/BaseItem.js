import React from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

export default class BaseItem extends React.Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite;
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite: isFavorite
      }
    }
    return null;
  }

  setFavoriteState(isFavorite) {
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite: isFavorite
    });
  }

  onPressFavorite() {
    const {isFavorite} = this.state;
    const {projectModel: {item}} = this.props;
     this.setFavoriteState(!isFavorite);
     this.props.onFavorite(item, !isFavorite);
  }

  _favoriteIcon() {
    const {isFavorite} = this.state;
    return (
      <TouchableOpacity
        style={{padding: 6}}
        underlayColor={'transparent'}
        onPress={() => this.onPressFavorite()}
      >
        <FontAwesome
          name={isFavorite ? 'star' : 'star-o'}
          size={26}
          style={{color: '#678'}}
        />
      </TouchableOpacity>
    )
  }


}
