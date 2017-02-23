/**
 * Created by micha on 18/12/16.
 */

import React from "react"
import ReactDOM from "react-dom"
import d3Chapters from "../components/d3Chapters"

import "../../styles/chapters"

export default class Chapters extends React.Component {

  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
    d3Chapters.create(dom, this.data(), this.getChartProps());

    window.addEventListener('resize', ::this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ::this.handleResize)
  }

  componentDidUpdate() {
    this.updateD3()
  }

  render() {
    return <div className="chapters">
      <svg className="d3Chapters"/>
      <svg className="d3ChaptersIndicators"/>
    </div>
  }

  handleResize(e) {
    this.updateD3()
  }

  data() {
    return {
      shots: this.props.shots,
      chapters: this.props.chapters
    }
  }

  updateD3() {
    const dom = ReactDOM.findDOMNode(this);
    d3Chapters.update(dom, this.data(), this.getChartProps());
  }

  handleChapterClick(d) {
    this.props.onSelection(d);
  }

  getChartProps() {
    const chartProps = this.props.chartProps;
    chartProps.zoomLevel = this.props.zoomLevel / 100;
    chartProps.offset = this.props.offset;
    chartProps.shotWidth = 200;
    chartProps.onClick = this.handleChapterClick.bind(this);
    chartProps.hidesFiltered = this.props.hidesFiltered;

    return chartProps
  }
}

Chapters.defaultProps = {
  offset: 0,
  chartProps: { shotWidth: 200, height: 30 },
};
