/**
 * Created by micha on 18/12/16.
 */

import React from "react"
import ReactDOM from "react-dom"
import d3Shots from "../components/d3Shots"

import "../../styles/shots"

export default class Shots extends React.Component {

  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
    d3Shots.create(dom, this.data(), this.getChartProps());

    const shotsView = ReactDOM.findDOMNode(this.refs.shotsView);
    this.props.onMountDOM(shotsView);
  }

  componentDidUpdate() {
    this.updateD3()
  }

  render() {
    const { keyframeMontageSize } = this.props.project;
    const keyframeHeight = keyframeMontageSize != null ? keyframeMontageSize[1] : 0;

    return (
      <div className="mid">
        <div className="background" style={{height: keyframeHeight}}></div>
        <button className="left" style={{height: keyframeHeight}} onClick={this.props.onStepLeft}/>
        <div className="wrapper">
          <div className="content">
            <div className="shots" ref="shotsView" onScroll={this.handleScrollChange.bind(this)}>
              <svg className="d3"/>
            </div>
          </div>
        </div>
        <button className="right" style={{height: keyframeHeight}} onClick={this.props.onStepRight}/>
      </div>
    )
  }

  handleScrollChange(d) {
    const dom = ReactDOM.findDOMNode(this.refs.shotsView);
    this.props.onScroll(dom)
  }

  data() {
    if (this.props.hidesFiltered && this.props.isFiltering) {
        const shots = this.props.shots.filter((d) => { return d.filtered; });
        return {
          shots: shots,
          allShots: this.props.allShots,
          subtitlesPerShot: this.props.subtitlesPerShot
        }
    }

    return {
      shots: this.props.shots,
      allShots: this.props.allShots,
      subtitlesPerShot: this.props.subtitlesPerShot
    }
  }

  updateD3() {
    const dom = ReactDOM.findDOMNode(this);
    d3Shots.update(dom, this.data(), this.getChartProps());
  }

  getChartProps() {
    const url = `${process.env.STORE_URL}/${this.props.project.identifier}/keyframe_montage.jpg`;

    const [width, height] = this.props.project.keyframeMontageSize;
    const chartProps = this.props.chartProps;
    chartProps.zoomLevel = this.props.zoomLevel / 100;
    chartProps.hidesFiltered = this.props.hidesFiltered;
    chartProps.isFiltering = this.props.isFiltering;
    chartProps.url = url;
    chartProps.width = width;
    chartProps.height = height;
    chartProps.onClick = this.props.removeNode;
    chartProps.onMouseOver = this.props.onMouseOver;
    chartProps.onMouseOut = this.props.onMouseOut;
    chartProps.project = this.props.project;

    return chartProps
  }
}

Shots.defaultProps = {
  chartProps: { shotWidth: 200, height: 105 },
};

