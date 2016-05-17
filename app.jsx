import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import DocumentMeta from 'react-document-meta';
import { pushState } from 'redux-router';
import config from '../../config';

@connect(
  state => ({device: state.device}),
  {pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static childContextTypes = {
    device: PropTypes.object
  };

  getChildContext() {
    return {
      device: this.props.device
    };
  }

  componentWillReceiveProps(nextProps) {
    return nextProps;
  }

  render() {
    const styles = require('./App.scss');
    return (
      <div className={styles.app}>
        <DocumentMeta {...config.app}/>
        <div className={styles.appContent}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
