import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {updateProps} from 'redux/modules/Demo';

function mapStateToProps(state) {
  return {
    prop1: state.demo.prop1,
    prop2: state.demo.prop2
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateProps }, dispatch);
}

@connect(
  mapStateToProps,
  mapDispatchToProps)
export default class Demo extends Component {
  static propTypes = {
    prop1: PropTypes.string,
    prop2: PropTypes.number,
    updateProps: PropTypes.func
  };

  render() {
    const {prop1, prop2} = this.props;
    return (
      <div>
        <h1>Demo Component with Props</h1>
        <hr/>
        <p>
          <strong>prop1:</strong> {prop1}
        </p>
        <p>
          <strong>prop2:</strong> {prop2}
        </p>
        <hr/>
        <button className="btn btn-primary"
                onClick={()=>{
                  // If we destructure on line 28 for this actionCreator prop, it causes ESLint to constantly throw
                  // an annoying 'no-shadow' warning...
                  this.props.updateProps({prop1: 'some other string', prop2: 9000});
                }}>
          Dispatch action to update state
        </button>
      </div>
    );
  }
}
