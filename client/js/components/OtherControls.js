/**
 * Created by micha on 18/12/16.
 */
import React from "react"
import Select from 'react-select';
import { connect } from "react-redux"
import _ from "lodash"
import ReactBootstrapSlider from 'react-bootstrap-slider';

import { colors } from "../common/constants"

import 'react-select/dist/react-select.css';
import "../../styles/search"

@connect((store) => {
  return {
  }
})
export default class OtherControls extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      changeValue: 5,
      stepValue: 2,
      zoomMin: 1,
      zoomMax: 100,
    };
  };

  handleZoomDecrement() {
    const {zoomMin, changeValue } = this.state;
    const zoomLevel = Math.max(zoomMin, this.props.zoomLevel - changeValue);
    this.props.onZoomLevelChange(zoomLevel);
  }

  handleZoomIncrement() {
    const {zoomMax, changeValue } = this.state;
    const zoomLevel = Math.min(zoomMax, this.props.zoomLevel + changeValue);
    this.props.onZoomLevelChange(zoomLevel);
  }

  handleZoomLevelChange(e) {
    const zoomLevel = e.target.value;
    this.props.onZoomLevelChange(zoomLevel);
  }

  handleHideToggle(e) {
    const checked = e.target.checked;
    this.props.onHideFilterToggle(checked);
  }

  handleZoomLevelChangeStop(d) {
    this.props.onZoomLevelChangeStop(d.target.value);
  }

  render() {
    return (
      <div className="otherControls">
        <div className="sliderControls">
          <button className="button" onClick={this.handleZoomDecrement.bind(this)}>-</button>

          <ReactBootstrapSlider
            value={this.props.zoomLevel}
            change={this.handleZoomLevelChange.bind(this)}
            slideStop={this.handleZoomLevelChangeStop.bind(this)}
            step={this.state.stepValue}
            max={this.state.zoomMax}
            min={this.state.zoomMin}
            orientation="horizontal"
            reverse={false}
            disabled="enabled" />

          <button className="button" onClick={this.handleZoomIncrement.bind(this)}>+</button>
        </div>
        <div className="inputs">
          <label>
            <input type="checkbox"
                   ref="checkbox"
                   checked={this.props.hidesFiltered}
                   onChange={this.handleHideToggle.bind(this)} />
            Hide filtered
          </label>
        </div>
      </div>
    )
  }
}

OtherControls.defaultProps = {
  hidesFiltered: false
};

OtherControls.propTypes = {
};
